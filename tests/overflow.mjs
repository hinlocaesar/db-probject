import { chromium } from '@playwright/test'
import { revealAll } from './scroll.mjs'

/**
 * Explains an overflow report: for every element that sticks out past the
 * viewport, print the offending rect plus its ancestor chain with the
 * class that produced the geometry. Guessing from the leaf class alone
 * hides which wrapper is actually the width culprit.
 *
 *   node tests/overflow.mjs --widths=390
 *   node tests/overflow.mjs --widths=390 --selector="h3"
 */

const arg = (name, fallback) => {
  const hit = process.argv.find((a) => a.startsWith(`--${name}=`))
  return hit ? hit.split('=')[1] : fallback
}

const url = arg('url', 'http://localhost:5173')
const width = Number(arg('widths', '390'))
const selector = arg('selector', '')

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width, height: 900 } })
await page.goto(url, { waitUntil: 'networkidle' })
await revealAll(page)

const out = await page.evaluate((sel) => {
  const vw = document.documentElement.clientWidth
  const seen = new Set()
  const rows = []

  const visible = (el) => {
    const s = getComputedStyle(el)
    if (s.visibility === 'hidden' || s.display === 'none') return false
    if (Number(s.opacity) === 0) return false
    const r = el.getBoundingClientRect()
    return r.width > 1 && r.height > 1
  }

  for (const el of document.querySelectorAll(sel || 'body *')) {
    if (!visible(el)) continue
    if (el.closest('[aria-hidden="true"]')) continue
    const r = el.getBoundingClientRect()
    if (r.right <= vw + 2 && r.left >= -2) continue

    // Identify by class signature so repeats collapse to one entry.
    const sig = `${el.tagName.toLowerCase()}.${(el.className?.toString?.() ?? '').slice(0, 60)}`
    if (seen.has(sig)) continue
    seen.add(sig)

    const chain = []
    for (let n = el; n && n !== document.body; n = n.parentElement) {
      const s = getComputedStyle(n)
      const b = n.getBoundingClientRect()
      chain.push(
        [
          n.tagName.toLowerCase(),
          Math.round(b.left),
          Math.round(b.width),
          s.display,
          s.gridTemplateColumns === 'none' ? '' : `cols[${s.gridTemplateColumns}]`,
          (n.className?.toString?.() ?? '').slice(0, 90),
        ].join(' ')
      )
      if (chain.length >= 9) break
    }

    rows.push({
      leaf: sig,
      text: (el.textContent ?? '').trim().slice(0, 40),
      rect: `${Math.round(r.left)}..${Math.round(r.right)}`,
      chain,
    })
  }

  return { vw, scrollWidth: document.documentElement.scrollWidth, rows }
}, selector)

console.log(`viewport ${out.vw}, document scrollWidth ${out.scrollWidth}`)
console.log(`${out.rows.length} distinct overflowing elements\n`)

for (const row of out.rows) {
  console.log(`--- ${row.leaf}  [${row.rect}]  "${row.text}"`)
  for (const link of row.chain) console.log(`      ${link}`)
  console.log()
}

await browser.close()