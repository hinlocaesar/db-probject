import { motion } from 'framer-motion'
import { Container, Section, SectionIntro } from './ui/Section'
import { PhoneMock } from './ui/PhoneMock'
import { features } from '../data/features'
import { cn } from '../lib/utils'

const toneMap = {
  lime: { chip: 'bg-lime/12 text-lime ring-lime/25', glow: 'bg-lime/18', dot: 'bg-lime' },
  sky: { chip: 'bg-sky/12 text-sky ring-sky/25', glow: 'bg-sky/18', dot: 'bg-sky' },
  coral: { chip: 'bg-coral/12 text-coral ring-coral/25', glow: 'bg-coral/18', dot: 'bg-coral' },
  lilac: { chip: 'bg-lilac/12 text-lilac ring-lilac/25', glow: 'bg-lilac/18', dot: 'bg-lilac' },
  amber: { chip: 'bg-amber/12 text-amber ring-amber/25', glow: 'bg-amber/18', dot: 'bg-amber' },
}

/**
 * Alternating feature rows. The phone shows a different app screen per
 * feature, driven by `feature.screen`.
 */
function Row({ feature, index }) {
  const t = toneMap[feature.tone] ?? toneMap.lime
  const left = index % 2 === 0

  return (
    <div
      className={cn(
        'relative grid items-center gap-12 lg:grid-cols-2 lg:gap-20',
        'py-4'
      )}
    >
      {/* phone */}
      <motion.div
        initial={{ opacity: 0, y: 50, rotate: left ? -8 : 8 }}
        whileInView={{ opacity: 1, y: 0, rotate: left ? -4 : 4 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        whileHover={{ rotate: 0, scale: 1.03 }}
        className={cn(
          'relative flex justify-center',
          left ? 'lg:order-1 lg:justify-end' : 'lg:order-2 lg:justify-start'
        )}
      >
        <div
          aria-hidden
          className={cn('absolute inset-0 -z-10 rounded-full blur-3xl', t.glow)}
        />
        <PhoneMock screen={feature.screen} float={index !== 1} />
      </motion.div>

      {/* copy */}
      <motion.div
        initial={{ opacity: 0, x: left ? 44 : -44, filter: 'blur(8px)' }}
        whileInView={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
        viewport={{ once: true, amount: 0.35 }}
        transition={{ duration: 0.9, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
        className={left ? 'lg:order-2' : 'lg:order-1'}
      >
        <span
          className={cn(
            'inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-eyebrow font-bold tracking-[0.16em] uppercase ring-1',
            t.chip
          )}
        >
          <span className={cn('size-1.5 rounded-full', t.dot)} />
          {feature.eyebrow}
        </span>

        <h3 className="mt-5 font-serif text-[clamp(1.75rem,3.6vw,2.6rem)] leading-[1.08] text-cream">
          {feature.title}
        </h3>

        <p className="mt-5 max-w-lg text-[1.04rem] leading-relaxed text-cream/60">
          {feature.body}
        </p>

        <a
          href="#waitlist"
          className="group -my-2 mt-7 inline-flex min-h-11 items-center gap-2 py-2 text-[0.92rem] font-semibold text-lime transition-colors hover:text-lime-bright"
        >
          Get it at launch
          <span className="grid size-7 place-items-center rounded-full bg-lime/12 transition-all duration-400 ease-[var(--ease-out-expo)] group-hover:translate-x-1.5 group-hover:bg-lime group-hover:text-deep">
            <svg viewBox="0 0 24 24" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </span>
        </a>
      </motion.div>
    </div>
  )
}

export function Features() {
  return (
    <Section id="features" tone="dark" className="overflow-hidden">
      {/* the screens below are previews, so the section says so up front */}
      <p className="relative pb-2 text-center font-mono text-eyebrow tracking-[0.24em] uppercase text-cream/30">
        Previews of the app we are building
      </p>
      {/* ambient glows that sit behind the alternating rows */}
      <div
        aria-hidden
        className="bloom bg-lime/10 size-[34rem] -left-40 top-40"
      />
      <div
        aria-hidden
        className="bloom bg-sky/10 size-[30rem] -right-40 bottom-60"
      />

      <Container size="wide" className="relative">
        <SectionIntro kicker="Planned features">
          <span>What we are building, </span>
          <span className="text-gradient-lime italic">screen by screen.</span>
        </SectionIntro>

        <div className="mt-16 space-y-24 lg:mt-24 lg:space-y-36">
          {features.map((f, i) => (
            <Row key={f.id} feature={f} index={i} />
          ))}
        </div>
      </Container>
    </Section>
  )
}
