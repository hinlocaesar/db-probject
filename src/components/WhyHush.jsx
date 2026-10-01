import { motion } from 'framer-motion'
import { ShieldCheck, ArrowRight } from 'lucide-react'
import { Container, Section, SectionIntro } from './ui/Section'
import { Aurora } from './ui/Aurora'
import { EmailForm } from './ui/EmailForm'
import { useCases, trustNote } from '../data/positioning'
import { waitlistPerks, realityCheck } from '../data/waitlist'

/**
 * The four animated counters this section used to open with — 4.2M users,
 * +2.5hrs, 96%, 80% — are gone. None of them can be true of a product
 * that has never shipped, so the section argues the product instead of
 * proving it: what joining the list gets you, who it is for, an honest
 * status block, and the privacy stance.
 *
 * The counters themselves are still built and waiting in
 * `src/hooks/useCountUp.js` for real post-launch metrics.
 */
export function WhyHush() {
  return (
    <Section id="why" tone="dark" className="overflow-hidden">
      <Aurora variant="warm" opacity={0.5} />

      <Container size="wide" className="relative">
        <SectionIntro kicker="Why Hush" width="max-w-3xl">
          <span>Not a productivity hack </span>
          <span className="text-gradient-lime italic">you abandon in a fortnight.</span>
        </SectionIntro>

        <motion.p
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="mx-auto mt-6 max-w-2xl text-center text-[1.06rem] leading-relaxed text-cream/60"
        >
          Hush is meant to work like a commitment device. You make the
          decision once, and the app makes it easy to keep.
        </motion.p>

        {/* ---- three reasons to join the list ---- */}
        <div className="mt-16 grid gap-5 lg:grid-cols-3">
          {waitlistPerks.map((p, i) => (
            <motion.article
              key={p.title}
              initial={{ opacity: 0, y: 26, filter: 'blur(8px)' }}
              whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className={`lit-top group relative overflow-hidden rounded-3xl p-7 ring-1 ring-cream/10 transition-all duration-500 ease-[var(--ease-out-expo)] hover:-translate-y-2 ${
                p.tone === 'lime'
                  ? 'bg-lime/8 hover:bg-lime/12 hover:ring-lime/35'
                  : p.tone === 'sky'
                    ? 'bg-sky/8 hover:bg-sky/12 hover:ring-sky/35'
                    : 'bg-coral/8 hover:bg-coral/12 hover:ring-coral/35'
              }`}
            >
              <div className="relative">
                <h3 className="font-serif text-[1.45rem] leading-tight text-cream">
                  {p.title}
                </h3>
                <p className="mt-3.5 text-[0.95rem] leading-relaxed text-cream/60">
                  {p.body}
                </p>
              </div>
            </motion.article>
          ))}
        </div>

        {/* ---- use cases ---- */}
        <div className="mt-20 text-center">
          <p className="font-mono text-eyebrow tracking-[0.28em] uppercase text-cream/35">
            Hush is for
          </p>
          <ul className="mt-7 space-y-3">
            {useCases.map((c, i) => (
              <motion.li
                key={c}
                initial={{ opacity: 0, x: -24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
                className="group flex items-center justify-center gap-3"
              >
                <span className="h-px w-8 bg-linear-to-r from-transparent to-lime/50 transition-all duration-500 group-hover:w-14" />
                <span className="font-serif text-[clamp(1.5rem,3.4vw,2.35rem)] text-cream/85 transition-colors duration-300 group-hover:text-lime">
                  {c}
                </span>
                <span className="h-px w-8 bg-linear-to-l from-transparent to-lime/50 transition-all duration-500 group-hover:w-14" />
              </motion.li>
            ))}
          </ul>
        </div>

        {/* ---- capture ---- */}
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mx-auto mt-14 max-w-xl"
        >
          <EmailForm />
        </motion.div>

        {/* ---- honest status: replaces the "why believe you" deflection ---- */}
        <div className="mt-24">
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center font-serif text-[clamp(1.6rem,3.6vw,2.3rem)] text-cream"
          >
            {realityCheck.title}
          </motion.h3>

          <div className="mt-10 grid gap-4 lg:grid-cols-3">
            {realityCheck.points.map((p, i) => (
              <motion.div
                key={p.q}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.7, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="rounded-3xl bg-cream/4 p-6 ring-1 ring-cream/10"
              >
                <h4 className="text-[0.95rem] font-semibold text-lime">
                  {p.q}
                </h4>
                <p className="mt-2.5 text-[0.92rem] leading-relaxed text-cream/60">
                  {p.a}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ---- privacy promise ---- */}
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mx-auto mt-16 flex max-w-3xl items-start gap-4 rounded-3xl bg-cream/4 p-6 ring-1 ring-cream/10 sm:p-7"
        >
          <span className="grid size-10 shrink-0 place-items-center rounded-2xl bg-lime/15">
            <ShieldCheck className="size-5 text-lime" />
          </span>
          <div>
            <p className="text-[1.02rem] leading-relaxed text-cream/75">
              {trustNote}
            </p>
            <a
              href="#faq"
              /* -my-1.5 cancels the padding so the hit area reaches 44px
                 without moving the paragraph above. */
              className="-my-1.5 mt-3 inline-flex min-h-11 items-center gap-1.5 py-1.5 text-[0.9rem] font-semibold text-lime transition-colors hover:text-lime-bright"
            >
              Read the privacy promise
              <ArrowRight className="size-3.5" />
            </a>
          </div>
        </motion.div>
      </Container>
    </Section>
  )
}
