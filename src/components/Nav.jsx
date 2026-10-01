import { useCallback, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { Logo } from './ui/Logo'
import { Button } from './ui/Button'
import { Container } from './ui/Section'
import { useScrolled } from '../hooks/useScrolled'
import { useModalFocus } from '../hooks/useModalFocus'
import { cn } from '../lib/utils'
import { footerColumns } from '../data/platforms'

const links = [
  { label: 'Why Hush', href: '#why' },
  { label: 'Platforms', href: '#platforms' },
  { label: 'How it works', href: '#how' },
  { label: 'Features', href: '#features' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'FAQ', href: '#faq' },
]

export function Nav() {
  const scrolled = useScrolled(60)
  const [open, setOpen] = useState(false)
  const close = useCallback(() => setOpen(false), [])
  const sheetRef = useModalFocus(open, close)

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50">
        <Container size="wide">
          <motion.nav
            initial={{ y: -28, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            className={cn(
              'mt-3 flex items-center gap-4 rounded-full px-4 transition-all duration-500 ease-[var(--ease-out-expo)] sm:mt-5 sm:px-5',
              scrolled
                ? 'glass py-2.5 shadow-[0_18px_50px_-24px_rgba(0,0,0,0.95)]'
                : 'border border-transparent py-3.5'
            )}
          >
            <a
              href="#top"
              className="group -my-2 shrink-0 py-2"
              aria-label="Hush home"
            >
              <Logo
                animated={scrolled}
                className="transition-transform duration-300 group-hover:scale-[1.03]"
              />
            </a>

            {/* desktop links */}
            <ul className="mx-auto hidden items-center gap-1 lg:flex">
              {links.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    className="group relative block min-h-11 rounded-full px-3.5 py-2.5 text-[0.9rem] font-medium text-cream/70 transition-colors hover:text-cream"
                  >
                    {l.label}
                    <span className="absolute inset-x-3.5 -bottom-0.5 h-px origin-left scale-x-0 bg-lime transition-transform duration-400 ease-[var(--ease-out-expo)] group-hover:scale-x-100" />
                  </a>
                </li>
              ))}
            </ul>

            <div className="ml-auto flex items-center gap-2 lg:ml-0">
              <Button href="#waitlist" size="sm" className="hidden sm:inline-flex">
                Join the list
              </Button>

              <button
                onClick={() => setOpen((v) => !v)}
                aria-label={open ? 'Close menu' : 'Open menu'}
                aria-expanded={open}
                className="grid size-11 place-items-center rounded-full bg-cream/8 text-cream ring-1 ring-cream/12 transition-colors hover:bg-cream/14 lg:hidden"
              >
                {open ? <X className="size-5" /> : <Menu className="size-5" />}
              </button>
            </div>
          </motion.nav>
        </Container>
      </header>

      {/* mobile sheet */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-40 bg-ink/70 backdrop-blur-sm lg:hidden"
            />
            <motion.div
              ref={sheetRef}
              initial={{ y: -24, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -24, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              role="dialog"
              aria-label="Site menu"
              aria-modal="true"
              tabIndex={-1}
              className="glass fixed inset-x-4 top-24 z-40 max-h-[75vh] overflow-y-auto rounded-3xl p-6 lg:hidden"
            >
              <ul className="space-y-1">
                {links.map((l, i) => (
                  <motion.li
                    key={l.href}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.06 + i * 0.05 }}
                  >
                    <a
                      href={l.href}
                      onClick={() => setOpen(false)}
                      className="block rounded-xl px-3 py-3 font-serif text-2xl text-cream/85 transition-colors hover:bg-cream/6 hover:text-cream"
                    >
                      {l.label}
                    </a>
                  </motion.li>
                ))}
              </ul>

              <div className="mt-5 border-t border-cream/10 pt-5">
                <Button
                  href="#waitlist"
                  size="lg"
                  className="w-full"
                  onClick={() => setOpen(false)}
                >
                  Join the waitlist
                </Button>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-1 border-t border-cream/10 pt-5">
                {footerColumns.slice(0, 2).map((col) => (
                  <div key={col.title}>
                    <div className="font-mono text-eyebrow tracking-[0.18em] uppercase text-cream/35">
                      {col.title}
                    </div>
                    <ul className="-my-1.5 mt-2 space-y-0.5">
                      {col.links.slice(0, 4).map((l) => (
                        <li key={l.label}>
                          <a
                            href={l.href}
                            onClick={() => setOpen(false)}
                            className="flex min-h-11 items-center text-[0.85rem] text-cream/55 transition-colors hover:text-lime"
                          >
                            {l.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
