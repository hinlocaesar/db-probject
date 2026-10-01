import { useEffect, useRef } from 'react'

/**
 * The focus half of a modal. A full focus trap, because a menu that traps
 * nothing is worse than no menu at all: Tab walks straight out of the sheet
 * into the page behind it and the user has no idea where they are.
 *
 * Handles four things:
 *   - moves focus into the dialog when it opens
 *   - wraps Tab and Shift+Tab at the ends
 *   - closes on Escape
 *   - puts focus back on whatever opened it
 *
 * Also marks the rest of the document `inert` while open, which is what
 * actually stops screen readers and the Tab key reaching the page behind.
 * (React 18 has no built-in equivalent; the `inert` attribute is the
 * standard mechanism.)
 *
 * `isOpen` false means "no dialog on screen" — pass `false` freely rather
 * than conditionally rendering the hook.
 */

const FOCUSABLE = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',')

export function useModalFocus(isOpen, onClose) {
  const dialogRef = useRef(null)
  const restoreRef = useRef(null)

  useEffect(() => {
    if (!isOpen) return

    const dialog = dialogRef.current
    if (!dialog) return

    // Remember where focus came from so it can go back on close.
    restoreRef.current = document.activeElement

    /*
     * Take everything outside the dialog out of the focus order.
     *
     * Walking up from the dialog and inert-ing each sibling is what makes
     * this correct when the dialog is nested — the nav header holds both the
     * menu button and the sheet, so marking whole top-level children would
     * leave the nav links and the toggle live behind the open menu.
     */
    const marked = []
    for (let node = dialog; node && node.parentElement; node = node.parentElement) {
      for (const sib of node.parentElement.children) {
        if (sib === node) continue
        if (sib.hasAttribute('inert')) continue
        sib.setAttribute('inert', '')
        marked.push(sib)
      }
    }

    // Focus the first control, or the dialog itself as a last resort.
    const first = dialog.querySelector(FOCUSABLE)
    ;(first ?? dialog).focus({ preventScroll: true })

    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose?.()
        return
      }

      if (e.key !== 'Tab') return

      const items = [...dialog.querySelectorAll(FOCUSABLE)].filter((el) => {
        const s = getComputedStyle(el)
        return s.display !== 'none' && s.visibility !== 'hidden'
      })
      if (!items.length) {
        e.preventDefault()
        return
      }

      const firstItem = items[0]
      const lastItem = items[items.length - 1]
      const active = document.activeElement

      // Wrap at both ends so focus can never escape the dialog.
      if (e.shiftKey && (active === firstItem || !dialog.contains(active))) {
        e.preventDefault()
        lastItem.focus()
      } else if (!e.shiftKey && active === lastItem) {
        e.preventDefault()
        firstItem.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      for (const el of marked) el.removeAttribute('inert')

      const restore = restoreRef.current
      restoreRef.current = null
      if (restore && document.contains(restore)) {
        restore.focus({ preventScroll: true })
      }
    }
  }, [isOpen, onClose])

  return dialogRef
}