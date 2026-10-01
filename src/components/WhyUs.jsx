import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import { Container, Section } from './ui/Section'
import { EmailForm } from './ui/EmailForm'

/**
 * What used to be the five-star review wall.
 *
 * Those cards were invented, and a product that has never shipped cannot
 * honestly collect reviews, so the section now argues for the product
 * instead of claiming social proof. The marquee machinery that drove the
 * wall was removed along with it rather than left in as dead code.
 *
 * When you do have real quotes, this is a natural slot for them: a grid
 * of attributed cards, no stars, no marquee.
 */

/** Design commitments. Framed as decisions, not as accomplishments. */
const commitments = [
  {
    title: 'No dark patterns',
    body: 'We are not trying to make this hard to put down. No streak you can lose, no notification that manufactures guilt, nothing designed to pull you back in.',
  },
  {
    title: 'No browsing data',
    body: 'Blocking happens on your device. We have no interest in holding a record of the websites you visit or the apps you open — that is the opposite of the point.',
  },
  {
    title: 'No subscription guilt',
    body: 'One free tier that genuinely works, one paid tier priced fairly. If it stops being worth paying for, stop paying for it.',
  },
]

export function WhyUs() {
  return (
    <Section id="about" tone="forest" className="overflow-hidden">
      <Container size="wide">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          {/* ---------------- left: the argument ---------------- */}
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex items-center gap-2 font-mono text-eyebrow tracking-[0.24em] uppercase text-lime/70">
              <Sparkles className="size-3" />
              Why we are building it
            </div>

            <h2 className="mt-5 font-serif text-[clamp(1.9rem,4.4vw,3.1rem)] leading-[1.06]">
              <span className="text-cream">
                Every focus tool we tried either managed{' '}
                <span className="text-cream/45">one screen</span>, or became{' '}
                <span className="text-cream/45">another thing to check</span>.
              </span>
            </h2>

            <p className="mt-6 max-w-lg text-[1.04rem] leading-relaxed text-cream/60">
              Neither is good enough. Hush is a small team building the
              version that covers every device you own, does one job, and
              then gets out of the way.
            </p>

            <ul className="mt-9 space-y-3.5">
              {commitments.map((c, i) => (
                <motion.li
                  key={c.title}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.15 + i * 0.1 }}
                  className="flex items-start gap-3"
                >
                  <span className="mt-2 size-1.5 shrink-0 rounded-full bg-lime" />
                  <span>
                    <span className="text-[0.95rem] font-semibold text-cream/85">
                      {c.title}.{' '}
                    </span>
                    <span className="text-[0.95rem] leading-relaxed text-cream/55">
                      {c.body}
                    </span>
                  </span>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* ---------------- right: capture ---------------- */}
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
            className="lg:pl-4"
          >
            <div className="glass rounded-[2rem] p-8 sm:p-10">
              <div className="font-mono text-eyebrow tracking-[0.24em] uppercase text-lime/70">
                Get in early
              </div>
              <p className="mt-4 font-serif text-[1.7rem] leading-tight text-cream">
                Be first in line.
              </p>
              <p className="mt-3 text-[0.95rem] leading-relaxed text-cream/55">
                Join the waitlist and you get the launch link before the
                public announcement, plus founding pricing that will not come
                back.
              </p>
              <EmailForm className="mt-7" />
            </div>
          </motion.div>
        </div>
      </Container>
    </Section>
  )
}