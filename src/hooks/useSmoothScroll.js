import { useEffect } from 'react'
import Lenis from 'lenis'

/**
 * Momentum smooth scrolling. Gives the page the "expensive product site"
 * feel that Framer Motion alone can't do (it also drives anchor clicks).
 */
export function useSmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.6,
    })

    let frame
    const raf = (time) => {
      lenis.raf(time)
      frame = requestAnimationFrame(raf)
    }
    frame = requestAnimationFrame(raf)

    // Lenis owns the scroll position and resets it to its own target every
    // frame, so `window.scrollTo()` from a test or a script silently snaps
    // back. Handing out the instance lets tooling scroll the real thing.
    window.__lenis = lenis

    // Let in-page anchors use the same momentum scroll
    const onClick = (e) => {
      const anchor = e.target.closest?.('a[href^="#"]')
      if (!anchor) return
      const id = anchor.getAttribute('href')
      if (!id || id === '#') return
      const target = document.querySelector(id)
      if (!target) return
      e.preventDefault()
      lenis.scrollTo(target, { offset: -90, duration: 1.3 })
    }
    document.addEventListener('click', onClick)

    return () => {
      document.removeEventListener('click', onClick)
      cancelAnimationFrame(frame)
      delete window.__lenis
      lenis.destroy()
    }
  }, [])
}
