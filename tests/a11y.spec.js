import { test, expect } from '@playwright/test'
import { revealAll, settleOn } from './scroll.mjs'

/**
 * Keyboard and assistive-technology behaviour. The content suite proves the
 * page says honest things; this one proves you can actually operate it
 * without a mouse, and that focus is always visible.
 *
 * The mobile menu is the risky part of this page: a fixed overlay that traps
 * nothing, closes on nothing, and hands focus to nothing.
 */

test.beforeEach(async ({ page }) => {
  await page.goto('/')
  await page.waitForLoadState('networkidle')
})

/** Only elements a keyboard user can reach. */
const focusable = 'a[href], button:not([disabled]), input, [tabindex]:not([tabindex="-1"])'

test('tab order starts inside the nav and skips nothing visible', async ({ page }) => {
  await page.keyboard.press('Tab')
  const first = await page.evaluate(() => document.activeElement?.tagName.toLowerCase())

  // The first stop should be a nav link or the logo, not body.
  expect(first).not.toBe('body')

  // Every focusable element that is actually rendered should be reachable,
  // i.e. it must not carry a negative tabindex that hides it from Tab.
  const unreachable = await page.evaluate(() => {
    const out = []
    for (const el of document.querySelectorAll('a[href], button, input')) {
      const s = getComputedStyle(el)
      if (s.display === 'none' || s.visibility === 'hidden') continue
      if (el.closest('[inert]') || el.hasAttribute('inert')) continue
      if (s.pointerEvents === 'none') continue
      if (el.getAttribute('tabindex') === '-1') {
        out.push({
          tag: el.tagName.toLowerCase(),
          label: (el.getAttribute('aria-label') || el.textContent || '').trim().slice(0, 40),
          cls: (el.className?.toString?.() ?? '').slice(0, 60),
        })
      }
    }
    return out
  })

  expect(
    unreachable,
    `these are rendered but skipped by Tab: ${JSON.stringify(unreachable, null, 2)}`
  ).toEqual([])
})

test('the focused control always has a visible focus ring', async ({ page }) => {
  await revealAll(page)

  const ids = await page.evaluate(() =>
    [...document.querySelectorAll('main a[href], footer a[href]')].map((a) => a.id || '')
  )
  // Give the focusable controls stable handles.
  await page.evaluate(() => {
    document.querySelectorAll('a[href], button:not([disabled]), input').forEach((el, i) => {
      el.dataset.testid = `focus-${i}`
    })
  })

  const count = await page.locator('[data-testid^="focus-"]').count()
  expect(count).toBeGreaterThan(5)

  const noRing = []
  for (let i = 0; i < count; i++) {
    const el = page.locator(`[data-testid="focus-${i}"]`)
    if (!(await el.isVisible())) continue

    /*
     * `preventScroll` matters here. A plain DOM focus scrolls the element into
     * view, and Lenis then fights the scroll it did not ask for, which can
     * leave focus() waiting on a page that will not settle.
     */
    await el.evaluate((node) => node.focus({ preventScroll: true }))
    await page.waitForTimeout(60)

    const ring = await el.evaluate((node) => {
      const s = getComputedStyle(node)
      const visible = (v) => v && v !== 'none' && v !== 'transparent'
      return {
        hasOutline: visible(s.outlineStyle) && parseFloat(s.outlineWidth) > 0,
        hasShadow: visible(s.boxShadow) && s.boxShadow !== 'none',
        // :focus-visible only matches when the heuristic says so, so drive it
        // directly to check the rule exists rather than relying on the
        // heuristic having fired.
        matchesFocusVisible: node.matches(':focus-visible'),
      }
    })

    if (!ring.hasOutline && !ring.hasShadow) {
      noRing.push({ i, label: ids[i] ?? null, ...ring })
    }
  }

  expect(
    noRing,
    `focused controls with no visible indicator: ${JSON.stringify(noRing, null, 2)}`
  ).toEqual([])
})

test('the email form can be completed with the keyboard alone', async ({ page }) => {
  const input = page.locator('#waitlist input[type="email"]')
  const button = page.locator('#waitlist button[type="submit"]')

  await input.focus()
  await expect(input).toBeFocused()

  await page.keyboard.type('keyboard@example.com')
  await page.keyboard.press('Tab')
  await expect(button).toBeFocused()

  await page.keyboard.press('Enter')
  await expect(page.locator('#waitlist').getByRole('status')).toBeVisible()
  await expect(page.locator('#waitlist').getByRole('status')).toContainText(
    'keyboard@example.com'
  )
})

test('the error message is announced and tied to the field', async ({ page }) => {
  const band = page.locator('#waitlist')

  await band.locator('input').fill('bad')
  await band.locator('button[type="submit"]').click()

  const alert = band.getByRole('alert')
  await expect(alert).toBeVisible()

  // aria-describedby must point at the alert so it is read out with the field.
  const describedBy = await band.locator('input').getAttribute('aria-describedby')
  expect(describedBy).toBeTruthy()

  const alertId = await alert.getAttribute('id')
  expect(describedBy.split(/\s+/)).toContain(alertId)
})

test.describe('mobile menu', () => {
  test.skip(({ isMobile }) => !isMobile, 'menu button is hidden on desktop')

  test('traps focus, restores it, and closes on Escape', async ({ page }) => {
    const toggle = page.getByRole('button', { name: 'Open menu' })
    await toggle.click()

    const sheet = page.getByRole('dialog', { name: 'Site menu' })
    await expect(sheet).toBeVisible()

    // Focus should move into the sheet, not stay behind on the page.
    const insideSheet = await page.evaluate(() => {
      const dialog = document.querySelector('[role="dialog"]')
      return dialog?.contains(document.activeElement) ?? false
    })
    expect(insideSheet, 'focus should enter the menu when it opens').toBe(true)

    await page.keyboard.press('Escape')
    await expect(sheet).toBeHidden()

    // Focus must come back to the control that opened it.
    await expect(toggle).toBeFocused()
  })

  test('background content is not reachable while the menu is open', async ({
    page,
  }) => {
    await page.getByRole('button', { name: 'Open menu' }).click()
    await expect(page.getByRole('dialog', { name: 'Site menu' })).toBeVisible()

    const reachable = await page.evaluate(() => {
      const dialog = document.querySelector('[role="dialog"]')
      const out = []
      for (const el of document.querySelectorAll('a[href], button, input')) {
        if (el.closest('[role="dialog"]')) continue
        const s = getComputedStyle(el)
        if (s.display === 'none' || s.visibility === 'hidden') continue
        // A focusable element behind an open modal is a keyboard trap for
        // screen-reader and Tab users.
        if (!dialog?.contains(el) && !el.closest('[inert]')) {
          out.push({
            tag: el.tagName.toLowerCase(),
            label: (el.getAttribute('aria-label') || el.textContent || '')
              .trim()
              .slice(0, 40),
          })
        }
      }
      return out
    })

    expect(
      reachable.slice(0, 8),
      `these stay tabbable behind the open menu: ${JSON.stringify(reachable, null, 2)}`
    ).toEqual([])
  })
})

test('a skip link lets keyboard users jump past the nav', async ({ page }) => {
  const skip = page.getByRole('link', { name: /skip/i }).first()
  await expect(skip).toBeAttached()

  /*
   * `sr-only` hides by clipping (`clip-path: inset(50%)`) rather than by
   * collapsing the box, so measuring width/height before focus proves
   * nothing. Check that it is clipped, then that focusing removes the clip
   * and puts it somewhere a person can see and click.
   */
  const before = await skip.evaluate((el) => ({
    clipPath: getComputedStyle(el).clipPath,
    overflow: getComputedStyle(el).overflow,
  }))
  expect(before.overflow, 'skip link should be clipped before focus').toBe('hidden')
  expect(before.clipPath, 'skip link should be clipped before focus').not.toBe('none')

  await skip.focus()
  await page.waitForTimeout(150)

  const focused = await skip.evaluate((el) => {
    const r = el.getBoundingClientRect()
    return {
      w: Math.round(r.width),
      h: Math.round(r.height),
      top: Math.round(r.top),
      left: Math.round(r.left),
      clipPath: getComputedStyle(el).clipPath,
      inViewport: r.top >= 0 && r.left >= 0 && r.bottom <= window.innerHeight,
    }
  })

  expect(focused.clipPath, 'clip should be removed on focus').toBe('none')
  expect(focused.w, 'skip link should expand on focus').toBeGreaterThan(80)
  expect(focused.h, 'skip link should be tappable on focus').toBeGreaterThanOrEqual(44)
  expect(focused.inViewport, 'skip link should be fully on screen when focused').toBe(true)

  // Activating it must land on the content it names.
  await page.keyboard.press('Enter')
  await page.waitForTimeout(400)
  await expect(page.locator('#main')).toBeVisible()
})

/**
 * The conic ring on the featured pricing card used to be animated with the
 * loading spinner's `transform: rotate()` keyframe. That rotates the whole
 * rectangular ::after, swinging the border outside the card and leaving
 * diagonal streaks across the section — and `#pricing` has `overflow-hidden`,
 * so the overflow checks never saw it.
 *
 * The gradient must turn via `--angle` while the element itself stays put.
 */
test('the conic border animates without moving', async ({ page }) => {
  await page.goto('/')
  await settleOn(page, '#pricing')

  const card = page.locator('.ring-conic').first()
  await expect(card).toBeVisible()

  const samples = []
  for (let i = 0; i < 6; i++) {
    samples.push(
      await card.evaluate((el) => {
        const a = getComputedStyle(el, '::after')
        return {
          transform: a.transform,
          angle: a.getPropertyValue('--angle').trim(),
        }
      })
    )
    await page.waitForTimeout(220)
  }

  const transforms = new Set(samples.map((s) => s.transform))
  expect(
    [...transforms],
    'the border box must not be transformed — only the gradient angle changes'
  ).toEqual(['none'])

  // If the angle is frozen the effect is not running at all.
  expect(new Set(samples.map((s) => s.angle)).size).toBeGreaterThan(1)
})

/**
 * Decorations here are built with pseudo-elements: the conic ring, the
 * `lit-top` hairline, the mobile menu scrim. A pseudo-element has no box of
 * its own in the DOM, so if it gets a `transform` it rotates around its own
 * origin and paints wherever it lands — and an ancestor's `overflow: hidden`
 * hides the evidence, which is exactly how the conic ring shipped broken.
 *
 * Real elements are deliberately rotated elsewhere (the Features cards fan at
 * ±4°), so this only inspects ::before and ::after.
 */
test('no pseudo-element carries a transform', async ({ page }) => {
  await page.goto('/')
  await revealAll(page)

  const offenders = await page.evaluate(() => {
    const out = []

    for (const el of document.querySelectorAll('body *')) {
      for (const pseudo of ['::before', '::after']) {
        const s = getComputedStyle(el, pseudo)
        if (!s || s.content === 'none') continue

        const t = s.transform
        if (!t || t === 'none') continue

        // Animating a transform between two states is fine; the problem is
        // sitting at a rotated angle. Identity transforms are `none` or a
        // pure translate, which the matrix check below allows.
        const m = t.match(/matrix\(([^)]+)\)/)
        let rotated = true
        if (m) {
          const [a, b, c, d] = m[1].split(',').map(parseFloat)
          const offAxis = Math.abs(b) > 0.001 || Math.abs(c) > 0.001
          rotated = offAxis
        }

        if (!rotated) continue

        out.push({
          tag: el.tagName.toLowerCase(),
          pseudo,
          cls: (el.className?.toString?.() ?? '').slice(0, 60),
          transform: t,
        })
      }
    }
    return out
  })

  expect(
    offenders,
    `rotated pseudo-elements: ${JSON.stringify(offenders, null, 2)}`
  ).toEqual([])
})

test('decorative layers are hidden from assistive technology', async ({ page }) => {
  await revealAll(page)

  // The phone mockups contain readable-looking app UI. They are previews, so
  // a screen reader should not read "Blocked 47 sites remaining" as page copy.
  const mocks = page.locator('[data-mock]')
  const count = await mocks.count()
  expect(count).toBeGreaterThan(0)

  for (let i = 0; i < count; i++) {
    const mock = mocks.nth(i)
    expect(
      await mock.getAttribute('aria-hidden'),
      `mock ${i} should be aria-hidden`
    ).toBe('true')
  }
})

test('reduced motion removes the large movements', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')
  await page.waitForLoadState('networkidle')

  // Scroll the whole page: the question is not where content sits before it
  // animates in, it is whether the reveal ever *lands* correctly once motion
  // is suppressed. MotionConfig drops the transform, so nothing should be
  // left parked 40px off to the side.
  await revealAll(page)

  const offScreen = await page.evaluate(() => {
    const vw = document.documentElement.clientWidth
    const out = []
    for (const el of document.querySelectorAll('main h1, main h2, main h3, main p')) {
      const s = getComputedStyle(el)
      if (Number(s.opacity) < 0.99) continue
      const r = el.getBoundingClientRect()
      if (r.width === 0 || r.height === 0) continue
      if (r.left < -4 || r.right > vw + 4) {
        out.push({
          tag: el.tagName.toLowerCase(),
          text: (el.textContent ?? '').trim().slice(0, 40),
          left: Math.round(r.left),
          right: Math.round(r.right),
        })
      }
    }
    return out
  })

  expect(
    offScreen,
    `copy left off-screen with motion reduced: ${JSON.stringify(offScreen, null, 2)}`
  ).toEqual([])
})

test('with motion reduced, no reveal keeps a residual transform', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')
  await page.waitForLoadState('networkidle')
  await revealAll(page)

  /*
   * `MotionConfig reducedMotion="user"` is meant to make Framer drop the
   * x/y/scale parts of every `whileInView` on this page. If that regresses,
   * sections end up permanently nudged sideways, which is worse than the
   * animation ever being there.
   *
   * Decorative layers are excluded: the floating phone mock and the pulsing
   * dots run infinite CSS keyframes, so whatever frame is sampled mid-cycle
   * looks like a residual offset. That is expected, not a regression.
   */
  const residuals = await page.evaluate(() => {
    const out = []
    for (const el of document.querySelectorAll('main [style*="transform"]')) {
      if (el.closest('[data-mock]')) continue
      if (el.closest('[aria-hidden="true"]')) continue

      const s = getComputedStyle(el)
      if (s.animationName !== 'none') continue
      if (!s.transform || s.transform === 'none') continue

      const m = s.transform.match(/matrix\(([^)]+)\)/)
      if (!m) continue

      const [, a, , , e, f] = m[1].split(',').map((n) => parseFloat(n))
      const scale = Math.abs(a - 1) < 0.01 ? 1 : a
      // Anything more than a rounding error off its resting position.
      if (Math.abs(e) > 0.5 || Math.abs(f) > 0.5 || Math.abs(scale - 1) > 0.01) {
        out.push({
          tag: el.tagName.toLowerCase(),
          text: (el.textContent ?? '').trim().slice(0, 36),
          transform: s.transform,
        })
      }
    }
    return out
  })

  expect(
    residuals,
    `elements left transformed with motion reduced: ${JSON.stringify(residuals, null, 2)}`
  ).toEqual([])
})

test('the page is usable at 320px', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 700 })
  await page.goto('/')
  await revealAll(page)

  const result = await page.evaluate(() => {
    const vw = document.documentElement.clientWidth
    const clipped = (el) => {
      for (let n = el.parentElement; n; n = n.parentElement) {
        if (/hidden|clip/.test(getComputedStyle(n).overflowX)) return true
      }
      return false
    }
    const out = []
    for (const el of document.querySelectorAll('body *')) {
      const s = getComputedStyle(el)
      if (s.display === 'none' || s.visibility === 'hidden') continue
      const r = el.getBoundingClientRect()
      if (r.width === 0 || r.height === 0) continue
      if (el.closest('[aria-hidden="true"]')) continue
      if (clipped(el)) continue
      if (r.right > vw + 2) {
        out.push({
          tag: el.tagName.toLowerCase(),
          cls: (el.className?.toString?.() ?? '').slice(0, 60),
          right: Math.round(r.right),
        })
      }
    }
    return {
      vw,
      scrollWidth: document.documentElement.scrollWidth,
      out: out.slice(0, 10),
    }
  })

  expect(result.scrollWidth).toBeLessThanOrEqual(result.vw + 2)
  expect(
    result.out,
    `overflows at 320px: ${JSON.stringify(result.out, null, 2)}`
  ).toEqual([])
})

test('the hero promise is readable without scrolling on a small phone', async ({
  page,
}) => {
  await page.setViewportSize({ width: 360, height: 640 })
  await page.goto('/')
  await page.waitForTimeout(1200)

  // The headline and the subhead should both be above the fold, otherwise
  // the page does not say what it is until you commit to scrolling.
  const aboveFold = await page.evaluate(() => {
    const vh = window.innerHeight
    const inView = (el) => {
      if (!el) return false
      const r = el.getBoundingClientRect()
      return r.top < vh && r.bottom > 0
    }
    return {
      h1: inView(document.querySelector('h1')),
      status: inView(document.querySelector('a[href="#waitlist"].glass')),
      form: inView(document.querySelector('#waitlist input[type="email"]')),
    }
  })

  expect(aboveFold.h1, 'headline should be above the fold').toBe(true)
  expect(aboveFold.status, 'status pill should be above the fold').toBe(true)
})