import { chromium } from '@playwright/test'
import { mkdir } from 'node:fs/promises'
import { revealAll } from './scroll.mjs'

/**
 * Visual capture. This is not an assertion suite — it renders the page at a
 * few widths and writes full-page screenshots plus one image per section, so
 * the layout can actually be looked at.
 *
 *   node tests/screenshots.mjs
 *
 * Options:
 *   --url=http://localhost:5173   page to shoot (default that)
 *   --out=shots                    output directory
 *   --widths=390,768,1440          viewport widths to capture
 *   --reduced                     also shoot with prefers-reduced-motion
 */

const arg = (name, fallback) => {
  const hit = process.argv.find((a) => a.startsWith(`--${name}=`))
  return hit ? hit.split('=')[1] : fallback
}
const flag = (name) => process.argv.includes(`--${name}`)

const url = arg('url', 'http://localhost:5173')
const outDir = arg('out', 'shots')
const widths = arg('widths', '390,768,1440')
  .split(',')
  .map((w) => Number(w.trim()))
  .filter(Boolean)

await mkdir(outDir, { recursive: true })

const browser = await chromium.launch()

/** Every section id we care about, in page order. */
const SECTIONS = [
  'top',
  'waitlist',
  'about',
  'why',
  'platforms',
  'pricing',
  'how',
  'features',
  'faq',
  'launch',
]

for (const width of widths) {
  for (const reduced of flag('reduced') ? [false, true] : [false]) {
    const context = await browser.newContext({
      viewport: { width, height: Math.round(width * 0.66) },
      deviceScaleFactor: 2,
      reducedMotion: reduced ? 'reduce' : 'no-preference',
    })
    const page = await context.newPage()

    await page.goto(url, { waitUntil: 'networkidle' })
    // Fire every whileInView reveal before capturing, so nothing is
    // screenshotted at its pre-animation `initial` transform.
    await revealAll(page)

    const tag = `${width}${reduced ? '-reduced' : ''}`

    await page.screenshot({
      path: `${outDir}/full-${tag}.png`,
      fullPage: true,
    })

    for (const id of SECTIONS) {
      const el = page.locator(`#${id}`)
      if ((await el.count()) === 0) continue
      await el.scrollIntoViewIfNeeded()
      await page.waitForTimeout(450)
      await el.screenshot({ path: `${outDir}/${id}-${tag}.png` })
    }

    console.log(`${tag}: captured ${SECTIONS.length} sections + full page`)
    await context.close()
  }
}

await browser.close()
console.log(`\nScreenshots written to ${outDir}/`)