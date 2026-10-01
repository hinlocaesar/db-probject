import { chromium } from '@playwright/test'
import { revealAll } from './scroll.mjs'

/**
 * Measures the things that are wrong with a layout but invisible in the
 * DOM: unreadable contrast, text that fell below its intended size, tap
 * targets too small to hit, clipped overflow, heading skips, cramped
 * section padding.
 *
 *   node tests/audit.mjs
 *   node tests/audit.mjs --widths=390,1440
 *
 * Colours are resolved by painting them into a canvas rather than by
 * parsing the computed string. Tailwind v4 emits `oklab()` with a slash
 * alpha, so naive number-splitting gives garbage channels and every ratio
 * comes out wrong.
 *
 * Reads computed styles, so it catches problems that only appear once
 * Tailwind, the webfonts and the animation end-states have all applied.
 */

const arg = (name, fallback) => {
  const hit = process.argv.find((a) => a.startsWith(`--${name}=`))
  return hit ? hit.split('=')[1] : fallback
}
const flag = (name) => process.argv.includes(`--${name}`)

const url = arg('url', 'http://localhost:5173')
const widths = arg('widths', '390,768,1440').split(',').map(Number)

/* ------------------------------------------------------------------ *
 * In-page. One function so it serialises cleanly.
 * ------------------------------------------------------------------ */

function audit() {
  const cv = document.createElement('canvas')
  cv.width = cv.height = 1
  const ctx = cv.getContext('2d', { willReadFrequently: true })

  /** Any CSS colour string -> sRGB [r,g,b,a] 0-255 / 0-1. */
  function resolve(str) {
    if (!str || str === 'transparent' || str === 'none') return [0, 0, 0, 0]
    ctx.clearRect(0, 0, 1, 1)
    // Seed with a sentinel so a rejected value is detectable.
    ctx.fillStyle = '#ff00ff'
    try {
      ctx.fillStyle = str
    } catch {
      return null
    }
    ctx.fillRect(0, 0, 1, 1)
    const d = ctx.getImageData(0, 0, 1, 1).data
    if (d[0] === 255 && d[1] === 0 && d[2] === 255 && d[3] === 255) {
      return ctx.fillStyle === '#ff00ff' ? [0, 0, 0, 0] : null
    }
    return [d[0], d[1], d[2], d[3] / 255]
  }

  const srgb = (c) => {
    const v = c / 255
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)
  }
  const lum = ([r, g, b]) => 0.2126 * srgb(r) + 0.7152 * srgb(g) + 0.0722 * srgb(b)
  const ratio = (fg, bg) => {
    const a = lum(fg)
    const b = lum(bg)
    return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05)
  }
  const over = (fg, bg) => fg.map((c, i) => c * fg[3] + bg[i] * (1 - fg[3]))
  const solid = (c) => (c[3] >= 0.999 ? c : [...c.slice(0, 3), 1])

  /** Average colour of a CSS gradient, for `background-clip: text`. */
  function gradientColors(bgImage) {
    const stops = bgImage.match(/rgba?\([^)]+\)|oklab\([^)]+\)|#[0-9a-f]{3,8}|[a-z]+(?=\s)/gi)
    if (!stops) return []
    return stops
      .map(resolve)
      .filter((c) => c && c[3] > 0)
      .map(solid)
  }

  function visible(el) {
    const s = getComputedStyle(el)
    if (s.visibility === 'hidden' || s.display === 'none') return false
    if (Number(s.opacity) === 0) return false
    const r = el.getBoundingClientRect()
    return r.width > 1 && r.height > 1
  }

  /**
   * Composite every opaque ancestor background (plus the body) down to the
   * element. Fixed-position and sticky layers are skipped because their
   * painted backdrop is a sibling, not an ancestor.
   */
  function backdrop(el) {
    const stack = []
    // Start at the element itself: a chip's own fill is what its label sits
    // on, not the section behind it.
    let node = el
    while (node) {
      const s = getComputedStyle(node)
      const bg = resolve(s.backgroundColor)
      if (bg && bg[3] > 0) {
        stack.push(bg)
        if (bg[3] >= 0.999) break
      }
      node = node.parentElement
    }
    let out = [255, 255, 255, 1]
    for (let i = stack.length - 1; i >= 0; i--) out = over(stack[i], out)
    return out
  }

  const leaves = [...document.querySelectorAll('body *')].filter(
    (el) =>
      // SVG elements expose `children` as an HTMLCollection with no `.some`.
      ![...el.children].some((c) => (c.textContent ?? '').trim().length > 0) &&
      (el.textContent ?? '').trim().length > 0 &&
      visible(el)
  )

  /* ---------------------------- contrast ---------------------------- */
  const contrast = leaves.map((el) => {
    const s = getComputedStyle(el)
    const px = parseFloat(s.fontSize)
    const bold = Number(s.fontWeight) >= 700
    const large = px >= 24 || (px >= 18.66 && bold)
    const need = large ? 3 : 4.5
    const bg = backdrop(el)

    let fg = resolve(s.color)
    let via = null

    // Gradient text: the fill colour is transparent and the real colour
    // comes from the background image clipped to the glyphs.
    if (!fg || fg[3] === 0) {
      const grads = gradientColors(s.backgroundImage)
      if (grads.length) {
        const avg = grads
          .reduce((a, c) => a.map((v, i) => v + c[i] / grads.length), [0, 0, 0])
        fg = avg
        via = 'gradient'
      }
    }

    if (!fg) return null

    return {
      text: (el.textContent ?? '').trim().slice(0, 56),
      ratio: Number(ratio(solid(fg), solid(bg)).toFixed(2)),
      need,
      px: Number(px.toFixed(1)),
      via,
      cls: (el.className?.toString?.() ?? '').slice(0, 64),
    }
  })
  const contrastFails = contrast.filter((c) => c && c.ratio < c.need)

  /* ----------------------------- size ----------------------------- */
  // Anything inside a phone mock is a scaled rendering of app UI, not page
  // copy, so it is reported separately rather than counted as page text.
  const inMock = (el) => !!el.closest('[data-mock]')

  const tiny = leaves
    .map((el) => ({
      text: (el.textContent ?? '').trim().slice(0, 56),
      px: Number(parseFloat(getComputedStyle(el).fontSize).toFixed(1)),
      mock: inMock(el),
      cls: (el.className?.toString?.() ?? '').slice(0, 64),
    }))
    .filter((t) => t.px < 11 && !t.mock)

  /* -------------------------- tap targets -------------------------- */
  /**
   * WCAG 2.2 SC 2.5.8 requires 24x24 CSS px and exempts targets that sit
   * inside a sentence. 44px is the AAA/iOS figure, so it is advisory only.
   */
  const inlineish = (el) => {
    if (el.closest('p, li, h1, h2, h3, h4')) return true
    const s = getComputedStyle(el)
    return s.display === 'inline'
  }
  const tappable = [...document.querySelectorAll('a[href], button, input, [role="button"]')]
    .filter(visible)
    .map((el) => {
      const r = el.getBoundingClientRect()
      const cs = getComputedStyle(el)
      const inMockEl = inMock(el)
      return {
        label: (el.getAttribute('aria-label') || el.textContent || '').trim().slice(0, 38),
        w: Math.round(r.width),
        h: Math.round(r.height),
        inline: inlineish(el),
        mock: inMockEl,
        size: cs.fontSize,
      }
    })
    // Hard failure: real controls below the 24px AA floor.
    .filter((t) => !t.mock && !t.inline && (t.h < 24 || t.w < 24))
    // Advisory: below 44px.
    .concat(
      [...document.querySelectorAll('a[href], button, [role="button"]')]
        .filter(visible)
        .map((el) => {
          const r = el.getBoundingClientRect()
          return {
            label: (el.getAttribute('aria-label') || el.textContent || '').trim().slice(0, 38),
            w: Math.round(r.width),
            h: Math.round(r.height),
            mock: inMock(el),
            advisory: true,
          }
        })
        .filter((t) => !t.mock && (t.h < 44 || t.w < 44))
    )

  /* ---------------------------- overflow ---------------------------- */
  const vw = document.documentElement.clientWidth

  /**
   * True when some ancestor clips its children. An element sticking out of
   * an `overflow-hidden` box is not a layout bug — that is how decorative
   * glows and oversized numerals are meant to bleed past their frame — and
   * it cannot cause the document to scroll sideways.
   */
  const clipped = (el) => {
    for (let n = el.parentElement; n; n = n.parentElement) {
      if (/hidden|clip/.test(getComputedStyle(n).overflowX)) return true
    }
    return false
  }

  const overflow = [...document.querySelectorAll('body *')]
    .filter((el) => visible(el) && !el.closest('[aria-hidden="true"]') && !clipped(el))
    .map((el) => ({ el, r: el.getBoundingClientRect() }))
    .filter(({ r }) => r.right > vw + 2 || r.left < -2)
    .map(({ el, r }) => ({
      tag: el.tagName.toLowerCase(),
      cls: (el.className?.toString?.() ?? '').slice(0, 64),
      left: Math.round(r.left),
      right: Math.round(r.right),
    }))

  /* ----------------------------- headings ---------------------------- */
  const headings = [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')].map((h) => ({
    level: Number(h.tagName[1]),
    text: (h.textContent ?? '').trim().slice(0, 46),
  }))
  const skips = []
  let prev = 0
  for (const h of headings) {
    if (prev && h.level > prev + 1) skips.push(`h${prev} -> h${h.level} at "${h.text}"`)
    prev = h.level
  }

  /* ------------------------- section rhythm ------------------------- */
  const sections = [...document.querySelectorAll('main > section, footer')]
    .map((el) => {
      const s = getComputedStyle(el)
      return {
        id: el.id || '(no id)',
        h: Math.round(el.getBoundingClientRect().height),
        padTop: Math.round(parseFloat(s.paddingTop)),
        padBottom: Math.round(parseFloat(s.paddingBottom)),
      }
    })

  return {
    vw,
    contrastFails,
    contrastTotal: contrast.filter(Boolean).length,
    tiny,
    tappable,
    overflow,
    headings,
    skips,
    sections,
    imagesNoAlt: [...document.querySelectorAll('img')].filter((i) => !i.alt).length,
    fontsLoaded: [...document.fonts].filter((f) => f.status === 'loaded').map((f) => f.family),
  }
}

/* ------------------------------------------------------------------ */

const browser = await chromium.launch()
let hard = 0
let soft = 0

for (const width of widths) {
  const context = await browser.newContext({ viewport: { width, height: 900 } })
  const page = await context.newPage()
  await page.goto(url, { waitUntil: 'networkidle' })
  await revealAll(page)

  const r = await page.evaluate(audit)

  console.log(`\n${'='.repeat(66)}\n${width}px\n${'='.repeat(66)}`)
  console.log(`fonts: ${[...new Set(r.fontsLoaded)].join(', ')}`)
  console.log(`contrast checked: ${r.contrastTotal} text nodes`)

  const report = (label, list, kind = 'hard') => {
    if (!list.length) {
      console.log(`  ok    ${label}`)
      return
    }
    if (kind === 'hard') hard += list.length
    else soft += list.length
    console.log(`  FAIL  ${label} (${list.length})`)

    // Tiny text is usually one repeated utility, so collapse identical
    // class signatures into a single line with a count and examples.
    if (label === 'page text under 11px') {
      const byCls = new Map()
      for (const item of list) {
        const key = `${item.px}px ${item.cls}`
        if (!byCls.has(key)) byCls.set(key, { ...item, n: 0, texts: [] })
        const bucket = byCls.get(key)
        bucket.n++
        if (bucket.texts.length < 4) bucket.texts.push(item.text)
      }
      for (const bucket of byCls.values()) {
        console.log(
          `          ${bucket.n}x ${bucket.px}px  ${bucket.cls}`
        )
        console.log(`              ${JSON.stringify(bucket.texts)}`)
      }
      return
    }

    for (const item of list.slice(0, 14)) console.log(`          ${JSON.stringify(item)}`)
    if (list.length > 14) console.log(`          ...and ${list.length - 14} more`)
  }

  report('contrast below WCAG AA', r.contrastFails)
  report('page text under 11px', r.tiny)
  report('controls below the 24px AA target floor', r.tappable.filter((t) => !t.advisory))
  report('elements overflowing the viewport', r.overflow)
  report('heading level skips', r.skips)
  report('images without alt', r.imagesNoAlt ? [r.imagesNoAlt] : [])
  report(
    'section padding under 40px',
    r.sections.filter((s) => s.padTop < 40 || s.padBottom < 40)
  )
  report('controls under 44px (advisory)', r.tappable.filter((t) => t.advisory), 'soft')

  if (flag('verbose')) {
    console.log('\n  section rhythm:')
    for (const s of r.sections) console.log(`          ${JSON.stringify(s)}`)
  }

  await context.close()
}

await browser.close()
console.log(
  `\n${hard === 0 ? 'PASS' : `FAIL — ${hard} hard issue(s)`}${
    soft ? `, ${soft} advisory` : ''
  }`
)
process.exit(hard === 0 ? 0 : 1)