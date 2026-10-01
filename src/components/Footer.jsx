import { motion } from 'framer-motion'
import { ArrowUp } from 'lucide-react'
import { Container } from './ui/Section'
import { Logo } from './ui/Logo'
import { EmailForm } from './ui/EmailForm'
import { footerColumns, socials } from '../data/platforms'

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-cream/8 bg-ink pt-20 pb-10">
      <div
        aria-hidden
        className="bloom bg-lime/8 size-[26rem] -bottom-24 left-1/2 -translate-x-1/2"
      />

      <Container size="wide" className="relative">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_2fr]">
          {/* brand + newsletter */}
          <div>
            <a
              href="#top"
              aria-label="Hush home"
              className="inline-block py-2"
            >
              <Logo />
            </a>
            <p className="mt-5 max-w-xs text-[0.92rem] leading-relaxed text-cream/45">
              A cross-device focus app, still in development. No streaks, no
              points, no reason to come back — because you have somewhere else
              to be.
            </p>

            <EmailForm className="mt-7 max-w-sm" buttonLabel="Join" />

            {/* socials — placeholders until the accounts exist */}
            <ul className="mt-8 flex flex-wrap gap-2">
              {socials.map((s) => (
                <li key={s}>
                  <span className="block cursor-default rounded-full bg-cream/5 px-3.5 py-2 text-[0.78rem] text-cream/35 ring-1 ring-cream/8 select-none">
                    {s}
                    <span className="ml-2 font-mono text-eyebrow tracking-wider text-cream/20 uppercase">
                      soon
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* link columns */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {footerColumns.map((col, ci) => (
              <motion.div
                key={col.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: ci * 0.07 }}
              >
                <h3 className="font-mono text-eyebrow tracking-[0.2em] uppercase text-cream/35">
                  {col.title}
                </h3>
                {/* -my-1 gives each row a 44px hit area without opening up
                    the gap between them. */}
                <ul className="-my-1 mt-4 space-y-1.5">
                  {col.links.map((l) => (
                    <li key={l.label}>
                      <a
                        href={l.href}
                        className="group inline-flex min-h-11 items-center text-[0.88rem] text-cream/55 transition-colors hover:text-lime"
                      >
                        <span className="bg-linear-to-r from-lime to-lime bg-[length:0%_1px] bg-left-bottom bg-no-repeat transition-[background-size] duration-500 ease-[var(--ease-out-expo)] group-hover:bg-[length:100%_1px]">
                          {l.label}
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>

        {/* bottom bar */}
        <div className="mt-16 flex flex-col items-center gap-5 border-t border-cream/8 pt-8 sm:flex-row sm:justify-between">
          <p className="font-mono text-[0.72rem] text-cream/35">
            &copy; 2026 Hush. Currently a work in progress.
          </p>

          <div className="-my-1.5 flex items-center gap-3 py-1.5">
            <a
              href="mailto:hello@hush.app"
              className="flex min-h-11 items-center px-1 text-[0.78rem] text-cream/35 transition-colors hover:text-cream/70"
            >
              Contact
            </a>
            <a
              href="#faq"
              /* "FAQ" is only 23px wide, so it needs a little horizontal
                 padding to clear the 24px target floor. */
              className="-mx-2 flex min-h-11 min-w-11 items-center justify-center px-2 text-[0.78rem] text-cream/35 transition-colors hover:text-cream/70"
            >
              FAQ
            </a>
            <a
              href="#top"
              aria-label="Back to top"
              className="group grid size-11 place-items-center rounded-full bg-cream/8 ring-1 ring-cream/12 transition-all duration-300 hover:-translate-y-1 hover:bg-lime hover:text-deep hover:ring-lime"
            >
              <ArrowUp className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5" />
            </a>
          </div>
        </div>
      </Container>
    </footer>
  )
}
