import { motion } from 'framer-motion'
import { FlaskConical, Check } from 'lucide-react'
import { Container, Section } from './ui/Section'
import { launchPlatforms } from '../data/waitlist'
import { cn } from '../lib/utils'

/**
 * This slot used to be an eight-card grid of universities citing research
 * we made up. Every institution and statistic in it was invented, and
 * citing invented research to sell something that has never been tested
 * is the kind of thing that ends up quoted back at you.
 *
 * Platform availability is genuinely knowable before launch, so that is
 * what lives here now. The section keeps its `id` of "platforms" and the
 * nav points at it.
 *
 * If you ever want real research back, cite real, verifiable studies with
 * links, and be explicit that they are about distraction in general rather
 * than about Hush specifically.
 */

/** Build order and the reasoning behind it. */
const rationale = [
  ['macOS + Windows', 'The hardest to block properly, so we start there'],
  ['iOS + Android', 'Store review is the long pole, not the build'],
  ['Chrome + Edge', 'Straightforward once the engine exists'],
  ['Linux', 'Only if people actually ask for it'],
]

function isFirstWave(status) {
  return status === 'Public beta'
}

export function Platforms() {
  return (
    <Section id="platforms" tone="mist" className="overflow-hidden grain">
      <Container size="wide">
        <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          {/* ---------------------------- heading ---------------------------- */}
          <div className="lg:sticky lg:top-32 lg:self-start">
            <div className="flex items-center gap-2 font-mono text-eyebrow tracking-[0.28em] uppercase text-moss/60">
              <FlaskConical className="size-3.5" />
              Where it is
            </div>
            <h2 className="mt-5 font-serif text-[clamp(2.1rem,4.6vw,3.4rem)] leading-[1.05] text-deep">
              Platforms, in the
              <br />
              <span className="bg-linear-to-r from-moss to-fern bg-clip-text italic text-transparent">
                order we build them.
              </span>
            </h2>
            <p className="mt-6 max-w-md text-[1.03rem] leading-relaxed text-deep/65">
              We are not shipping everything at once. Each platform has its
              own blocking quirks, and a half-working block is worse than no
              block at all — so we are doing them properly, in this order.
            </p>

            <div className="mt-9 space-y-3 border-l-2 border-moss/25 pl-5">
              {rationale.map(([k, v], i) => (
                <motion.div
                  key={k}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                >
                  <div className="text-[0.95rem] font-semibold text-moss">
                    {k}
                  </div>
                  <div className="mt-0.5 text-[0.86rem] text-deep/60">{v}</div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* ------------------------- availability list ------------------------ */}
          <div className="grid gap-3 sm:grid-cols-2">
            {launchPlatforms.map((p, i) => {
              const first = isFirstWave(p.status)
              return (
                <motion.div
                  key={p.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{
                    duration: 0.7,
                    delay: (i % 2) * 0.08,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className={cn(
                    'group relative flex flex-col justify-between gap-5 rounded-3xl p-6 ring-1 transition-all duration-500 hover:-translate-y-1.5',
                    first
                      ? 'bg-moss/8 ring-moss/30 hover:ring-moss/50'
                      : 'bg-white/50 ring-deep/10 hover:ring-deep/20'
                  )}
                >
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-serif text-[1.22rem] leading-snug text-deep">
                      {p.name}
                    </h3>
                    {first && (
                      <span className="shrink-0 rounded-full bg-moss px-2.5 py-1 text-eyebrow font-bold tracking-[0.1em] text-cream uppercase">
                        First
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2.5 border-t border-deep/8 pt-4">
                    <span className="relative flex size-2">
                      {first && (
                        <span className="absolute inline-flex size-full animate-ping rounded-full bg-moss opacity-70" />
                      )}
                      <span
                        className={cn(
                          'relative inline-flex size-2 rounded-full',
                          first ? 'bg-moss' : 'bg-deep/25'
                        )}
                      />
                    </span>
                    <span className="text-[0.85rem] font-medium text-deep/70">
                      {p.status}
                    </span>
                    <span className="text-[0.8rem] text-deep/40">·</span>
                    <span className="text-[0.8rem] text-deep/50">{p.timing}</span>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-12 flex items-center justify-center gap-2 text-center text-[0.88rem] text-deep/50"
        >
          <Check className="size-4 shrink-0 text-moss" />
          Dates here are intentions, not commitments. We will not move a
          launch date to hit one.
        </motion.p>
      </Container>
    </Section>
  )
}