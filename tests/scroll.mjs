/**
 * Scrolls the page the way a person would, so `whileInView` reveals fire
 * before anything is measured or screenshotted.
 *
 * The subtlety: Lenis rewrites the scroll position on every animation frame
 * from its own target, so a plain `window.scrollTo()` from script gets
 * silently undone. Sections that never enter the viewport keep their
 * `initial` transform, and un-animated content looks exactly like broken
 * layout — phantom overflow, phantom misalignment. Always go through
 * `window.__lenis` when it exists.
 */

export async function revealAll(page) {
  await page.evaluate(async () => {
    const lenis = window.__lenis
    const go = (y) =>
      lenis ? lenis.scrollTo(y, { immediate: true }) : window.scrollTo(0, y)

    // Half a viewport at a time, so even a section taller than the screen
    // gets a look at the observer threshold.
    const step = Math.round(window.innerHeight * 0.5)
    const total = document.body.scrollHeight

    for (let y = 0; y <= total; y += step) {
      go(y)
      await new Promise((r) => setTimeout(r, 130))
    }

    go(0)
    await new Promise((r) => setTimeout(r, 600))
  })

  // Animations ease out over ~0.9s; give the last ones time to settle.
  await page.waitForTimeout(700)
}

/**
 * Scrolls to a specific element and waits for the reveal to finish.
 * Lenis' anchor handler is bypassed on purpose so the offset is exact.
 */
export async function settleOn(page, selector) {
  await page.evaluate((sel) => {
    const target = document.querySelector(sel)
    if (!target) return
    const y = target.getBoundingClientRect().top + window.scrollY - 80
    if (window.__lenis) window.__lenis.scrollTo(y, { immediate: true })
    else window.scrollTo(0, y)
  }, selector)
  await page.waitForTimeout(1100)
}