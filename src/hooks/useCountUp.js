import { useEffect, useRef, useState } from 'react'
import { useInView } from 'framer-motion'

/**
 * Counts a number up when the element scrolls into view.
 *
 * Currently unused: the counters it was built for (4.2M users, +2.5hrs,
 * 96%, 80%) were invented figures and were removed when Hush became a
 * pre-launch waitlist page. Kept because it is the right tool for real
 * post-launch metrics — see the note in src/data/positioning.js.
 */
export function useCountUp(end, { duration = 1.8, decimals = 0, start = 0 } = {}) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-15% 0px' })
  const [value, setValue] = useState(start)

  useEffect(() => {
    if (!inView) return

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) {
      setValue(end)
      return
    }

    let frame
    const t0 = performance.now()

    const tick = (t) => {
      const p = Math.min((t - t0) / (duration * 1000), 1)
      // easeOutExpo — fast start, long soft settle
      const eased = p === 1 ? 1 : 1 - Math.pow(2, -10 * p)
      setValue(Number((start + (end - start) * eased).toFixed(decimals)))
      if (p < 1) frame = requestAnimationFrame(tick)
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [inView, end, duration, decimals, start])

  return [ref, value]
}
