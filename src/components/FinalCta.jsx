import { motion } from 'framer-motion'
import { Container } from './ui/Section'
import { Aurora } from './ui/Aurora'
import { Logomark } from './ui/Logo'
import { EmailForm } from './ui/EmailForm'
import { closingLine, launchPhases } from '../data/launch'

/** Full-bleed closing CTA with concentric rings. */
export function FinalCta() {
  return (
    <section id="launch" className="relative isolate overflow-hidden py-28 sm:py-36 lg:py-44">
      <Aurora variant="hero" opacity={0.9} />

      {/* concentric rings behind the heading */}
      <div aria-hidden className="absolute inset-0 grid place-items-center">
        {[0, 1, 2, 3].map((r) => (
          <motion.div
            key={r}
            className="absolute rounded-full border border-lime/12"
            style={{
              width: `${28 + r * 17}%`,
              height: `${28 + r * 17}%`,
            }}
            animate={{ scale: [1, 1.04, 1], opacity: [0.7, 0.35, 0.7] }}
            transition={{
              duration: 6 + r * 1.5,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: r * 0.4,
            }}
          />
        ))}
      </div>

      <Container size="narrow" className="relative text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.7 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="flex justify-center"
        >
          <Logomark animated className="size-16 shadow-[0_0_60px_-6px] shadow-lime/70" />
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 28, filter: 'blur(10px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="mt-9 font-serif text-[clamp(2.4rem,6.4vw,4.4rem)] leading-[1.02]"
        >
          <span className="block text-cream">{closingLine.title}</span>
          <span className="text-gradient-lime block italic">{closingLine.accent}</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: 0.25 }}
          className="mx-auto mt-7 max-w-md text-[1.08rem] leading-relaxed text-cream/60"
        >
          {closingLine.body}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: 0.35 }}
          className="mx-auto mt-11 max-w-lg text-left"
        >
          <EmailForm buttonLabel="Join the waitlist" />
        </motion.div>

        {/* where the build actually is */}
        <div className="mx-auto mt-20 max-w-3xl">
          <div className="font-mono text-eyebrow tracking-[0.24em] uppercase text-cream/35">
            Where the build is
          </div>

          <ol className="mt-8 grid gap-3 text-left sm:grid-cols-2 lg:grid-cols-4">
            {launchPhases.map((p, i) => (
              <motion.li
                key={p.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.7, delay: i * 0.08 }}
                className={`rounded-2xl p-5 ring-1 ${
                  p.state === 'active'
                    ? 'bg-lime/10 ring-lime/30'
                    : 'bg-cream/4 ring-cream/10'
                }`}
              >
                <div className="flex items-center gap-2">
                  {p.state === 'active' ? (
                    <span className="relative flex size-1.5">
                      <span className="absolute inline-flex size-full animate-ping rounded-full bg-lime opacity-70" />
                      <span className="relative inline-flex size-1.5 rounded-full bg-lime" />
                    </span>
                  ) : (
                    <span className="size-1.5 rounded-full bg-cream/20" />
                  )}
                  <span
                    className={`font-mono text-eyebrow tracking-[0.2em] uppercase ${
                      p.state === 'active' ? 'text-lime' : 'text-cream/30'
                    }`}
                  >
                    {p.label}
                  </span>
                </div>
                <h3 className="mt-3 font-serif text-[1.1rem] text-cream">
                  {p.title}
                </h3>
                <p className="mt-2 text-[0.82rem] leading-relaxed text-cream/50">
                  {p.body}
                </p>
              </motion.li>
            ))}
          </ol>
        </div>
      </Container>
    </section>
  )
}
