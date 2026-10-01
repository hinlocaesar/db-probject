import { test, expect } from '@playwright/test'
import { revealAll } from './scroll.mjs'

/**
 * Structural and content checks. These are the assertions that would have
 * caught the fabricated-claims problem: no invented proof, no dead
 * download buttons, working anchors.
 */

/** Every Lenis anchor scroll is animated, so give it room to land. */
async function settle(page) {
  await page.waitForTimeout(900)
}

test.beforeEach(async ({ page }) => {
  await page.goto('/')
  await page.waitForLoadState('networkidle')
})

test('renders the hero with exactly one h1', async ({ page }) => {
  await expect(page.locator('h1')).toHaveCount(1)
  await expect(page.locator('h1')).toContainText('Silence')
  await expect(page.locator('h1')).toBeVisible()
})

test('every section anchor in the nav resolves', async ({ page }) => {
  const hrefs = await page
    .locator('header nav a[href^="#"], header nav a[href="#top"]')
    .evaluateAll((els) => els.map((e) => e.getAttribute('href')))

  expect(hrefs.length).toBeGreaterThan(3)

  for (const href of new Set(hrefs)) {
    const id = href.slice(1)
    if (id === 'top') continue
    await expect(
      page.locator(`section#${id}, [id="${id}"]`),
      `anchor ${href} should resolve to an element`
    ).toHaveCount(1)
  }
})

test('clicking a nav link scrolls to that section', async ({ page, isMobile }) => {
  // Below `lg` the desktop nav is display:none, so this only applies there.
  test.skip(isMobile, 'desktop nav links are hidden on mobile')

  await page.locator('header nav a[href="#pricing"]').first().click()
  await settle(page)

  const pricing = page.locator('#pricing')
  await expect(pricing).toBeInViewport()
})

/**
 * The point of the rewrite. An unreleased product cannot honestly have any
 * of these, so they must not appear anywhere in the rendered page.
 */
test('no fabricated proof anywhere in the rendered page', async ({ page }) => {
  const body = await page.locator('body').innerText()

  const banned = [
    '9,214',
    '9214',
    '4.8',
    '4.2M',
    '2.5hrs',
    '96%',
    '80%',
    'Millions of hours',
    'rated 5 stars',
    'As seen in',
    'Start free',
    'Log in',
    'Get Hush free',
    'Try it free',
    'Download for free',
    '30 seconds to set up',
  ]

  for (const phrase of banned) {
    expect(body, `"${phrase}" should not appear on the page`).not.toContain(phrase)
  }

  // The old JSON-LD claimed a rating and prices. It must be gone too.
  const ld = await page.locator('script[type="application/ld+json"]').allTextContents()
  const joined = ld.join(' ')
  expect(joined).not.toContain('aggregateRating')
  expect(joined).not.toContain('"offers"')
  expect(joined).not.toContain('SoftwareApplication')
})

test('the page says it is not released yet', async ({ page }) => {
  await expect(page.locator('body')).toContainText('In development')
  await expect(page.locator('#waitlist')).toContainText('In development')
  await expect(page.locator('#faq')).toContainText('Not yet')
})

/**
 * These labels are uppercased with CSS, so compare case-insensitively
 * rather than asserting the source casing.
 */
test('app screens are labelled as previews', async ({ page }) => {
  const body = (await page.locator('body').innerText()).toLowerCase()
  expect(body).toContain('app preview')
  expect(body).toContain('previews of the app we are building')
})

/**
 * The whole point of the site. There are six forms; each needs its own
 * input id, or every label points at the first one.
 */
test.describe('waitlist forms', () => {
  test('each form input has a unique id with a matching label', async ({ page }) => {
    const inputs = page.locator('input[type="email"]')
    const count = await inputs.count()
    expect(count).toBeGreaterThanOrEqual(5)

    const ids = await inputs.evaluateAll((els) => els.map((e) => e.id))
    expect(new Set(ids).size, 'every form needs a unique input id').toBe(ids.length)

    for (const id of ids) {
      await expect(
        page.locator(`label[for="${id}"]`),
        `input #${id} needs a label`
      ).toHaveCount(1)
    }
  })

  test('rejects an invalid address and shows the error', async ({ page }) => {
    const band = page.locator('#waitlist')

    await band.locator('input').fill('not-an-email')
    await band.locator('button[type="submit"]').click()

    await expect(band.getByRole('alert')).toBeVisible()
    await expect(band.getByRole('alert')).toContainText('does not look like an email')
    await expect(band.locator('input')).toHaveAttribute('aria-invalid', 'true')
  })

  /**
   * The success state replaces the whole form, so scope to the band rather
   * than to a `<form>` that no longer exists.
   */
  test('accepts a valid address and confirms it', async ({ page }) => {
    const band = page.locator('#waitlist')

    await band.locator('input').fill('someone@example.com')
    await band.locator('button[type="submit"]').click()

    await expect(band.getByRole('status')).toBeVisible()
    await expect(band.getByRole('status')).toContainText('You are on the list')
    await expect(band.getByRole('status')).toContainText('someone@example.com')

    // The form is gone, so a duplicate submit is not possible.
    await expect(band.locator('button[type="submit"]')).toHaveCount(0)
  })

  test('one submission does not fill in the other forms', async ({ page }) => {
    const inputs = page.locator('input[type="email"]')
    const first = inputs.first()

    await first.fill('first@example.com')
    await first.press('Enter')

    await expect(page.locator('#waitlist').getByRole('status')).toBeVisible()

    // The other forms are untouched.
    const others = await inputs.evaluateAll((els) => els.slice(1).map((e) => e.value))
    expect(others.every((v) => v === '')).toBe(true)
  })

  test('the error clears as soon as you edit the field', async ({ page }) => {
    const band = page.locator('#waitlist')

    await band.locator('input').fill('bad')
    await band.locator('button[type="submit"]').click()
    await expect(band.getByRole('alert')).toBeVisible()

    await band.locator('input').fill('b')
    await expect(band.getByRole('alert')).toBeHidden()
  })
})

test('the FAQ accordion opens and closes', async ({ page }) => {
  const faq = page.locator('#faq')
  const first = faq.locator('button[aria-expanded]').first()

  // The first item is open on load, so its panel is already in the DOM.
  await expect(first).toHaveAttribute('aria-expanded', 'true')
  await expect(page.locator('#faq-panel-0')).toBeVisible()

  await first.click()
  await expect(first).toHaveAttribute('aria-expanded', 'false')
  await expect(page.locator('#faq-panel-0')).toBeHidden()

  await first.click()
  await expect(first).toHaveAttribute('aria-expanded', 'true')
  await expect(page.locator('#faq-panel-0')).toBeVisible()
})

test('the mobile menu opens and navigates', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'desktop has no menu button')

  await page.getByRole('button', { name: 'Open menu' }).click()

  // Several sections have their own "Join the waitlist" button, so scope
  // every lookup to the sheet instead of the whole document.
  const sheet = page.getByRole('dialog', { name: 'Site menu' })
  await expect(sheet).toBeVisible()
  await expect(sheet.getByRole('link', { name: 'Join the waitlist' })).toBeVisible()

  await sheet.getByRole('link', { name: 'Pricing', exact: true }).click()
  await settle(page)

  await expect(page.locator('#pricing')).toBeInViewport()

  // The sheet closes on navigation, so the toggle is reachable again.
  await expect(page.getByRole('button', { name: 'Open menu' })).toBeVisible()
})

/**
 * Horizontal overflow is the failure mode a phone user notices first, and
 * the one static review misses: it only shows up at narrow widths, and only
 * after every scroll-reveal has run. Both are handled below.
 */
test('nothing overflows the viewport horizontally', async ({ page }) => {
  await revealAll(page)

  const overflow = await page.evaluate(() => {
    const docWidth = document.documentElement.clientWidth
    const offenders = []

    /**
     * An element hanging out of an `overflow-hidden` box is not a bug — that
     * is how the decorative glows and oversized numerals are meant to bleed.
     * It also cannot make the document scroll sideways.
     */
    const clipped = (el) => {
      for (let n = el.parentElement; n; n = n.parentElement) {
        if (/hidden|clip/.test(getComputedStyle(n).overflowX)) return true
      }
      return false
    }

    for (const el of document.querySelectorAll('body *')) {
      const r = el.getBoundingClientRect()
      if (r.width === 0 || r.height === 0) continue
      if (el.closest('[aria-hidden="true"]')) continue
      if (clipped(el)) continue
      if (r.right > docWidth + 2 || r.left < -2) {
        offenders.push({
          tag: el.tagName.toLowerCase(),
          cls: (el.className?.toString?.() ?? '').slice(0, 80),
          left: Math.round(r.left),
          right: Math.round(r.right),
        })
      }
    }
    return { docWidth, scrollWidth: document.documentElement.scrollWidth, offenders }
  })

  // 2px of tolerance for sub-pixel rounding.
  expect(
    overflow.scrollWidth,
    'document should not scroll sideways'
  ).toBeLessThanOrEqual(overflow.docWidth + 2)

  expect(
    overflow.offenders,
    `these elements stick out: ${JSON.stringify(overflow.offenders.slice(0, 6), null, 2)}`
  ).toHaveLength(0)
})

test('no console errors or failed requests', async ({ page }) => {
  const errors = []
  const failed = []

  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(m.text())
  })
  page.on('pageerror', (e) => errors.push(e.message))
  page.on('requestfailed', (r) =>
    failed.push(`${r.url()} — ${r.failure()?.errorText}`)
  )

  await page.goto('/', { waitUntil: 'networkidle' })
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
  await page.waitForTimeout(1500)

  expect(errors, errors.join('\n')).toHaveLength(0)
  expect(failed, failed.join('\n')).toHaveLength(0)
})