import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { Monitor, Check, Timer, Ban } from 'lucide-react'
import { Container, Section, SectionIntro } from './ui/Section'
import { Button } from './ui/Button'
import { steps } from '../data/platforms'
import { cn } from '../lib/utils'

/* ---------------- step illustrations ---------------- */

function DevicesArt() {
  return (
    <div className="flex items-end justify-center gap-3">
      {[
        { i: Monitor, w: 'w-16', h: 'h-11', d: 0 },
        { i: Monitor, w: 'w-24', h: 'h-16', d: 0.1 },
        { i: Monitor, w: 'w-14', h: 'h-20', d: 0.2 },
      ].map((s, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: s.d, ease: [0.16, 1, 0.3, 1] }}
          className={cn('relative', s.w)}
        >
          <div
            className={cn(
              'w-full rounded-xl bg-linear-to-b from-cream/20 to-cream/6 ring-1 ring-cream/15',
              s.h
            )}
          />
          <div className="mx-auto h-1 w-6 rounded-b-full bg-cream/15" />
          <span className="absolute top-1/2 left-1/2 size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-lime shadow-[0_0_12px_2px] shadow-lime/80" />
        </motion.div>
      ))}
    </div>
  )
}

function BlocklistArt() {
  return (
    <div className="w-full space-y-2">
      {[
        { l: 'Social', c: 'bg-coral', on: true },
        { l: 'Video', c: 'bg-amber', on: true },
        { l: 'News', c: 'bg-sky', on: true },
        { l: 'Everything', c: 'bg-lime', on: false },
      ].map((r, i) => (
        <motion.div
          key={r.l}
          initial={{ opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center gap-3 rounded-xl bg-cream/6 px-3 py-2.5 ring-1 ring-cream/10"
        >
          <span className={cn('size-2 rounded-full', r.c)} />
          <span className="flex-1 text-left text-[0.8rem] font-medium text-cream/75">
            {r.l}
          </span>
          <span
            className={cn(
              'relative h-4 w-7 rounded-full',
              r.on ? 'bg-lime/70' : 'bg-cream/12'
            )}
          >
            <span
              className={cn(
                'absolute top-0.5 size-3 rounded-full bg-cream',
                r.on ? 'left-3.5' : 'left-0.5'
              )}
            />
          </span>
        </motion.div>
      ))}
    </div>
  )
}

function TimerArt() {
  return (
    <div className="relative grid place-items-center">
      <svg viewBox="0 0 100 100" className="size-40 -rotate-90">
        <circle
          cx="50" cy="50" r="44" fill="none"
          stroke="currentColor" strokeWidth="5" className="text-cream/10"
        />
        <motion.circle
          cx="50" cy="50" r="44" fill="none"
          stroke="currentColor" strokeWidth="5" strokeLinecap="round"
          className="text-lime"
          strokeDasharray={2 * Math.PI * 44}
          initial={{ strokeDashoffset: 2 * Math.PI * 44 }}
          whileInView={{ strokeDashoffset: 2 * Math.PI * 44 * 0.35 }}
          viewport={{ once: true }}
          transition={{ duration: 1.8, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
        />
      </svg>
      <div className="absolute text-center">
        <div className="font-mono text-2xl text-cream">90:00</div>
        <div className="mt-0.5 text-eyebrow tracking-[0.16em] uppercase text-cream/40">
          deep work
        </div>
      </div>
    </div>
  )
}

const arts = { devices: DevicesArt, blocklist: BlocklistArt, timer: TimerArt }
const icons = { devices: Monitor, blocklist: Ban, timer: Timer }

/* ---------------- section ---------------- */

export function HowItWorks() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.75', 'end 0.4'],
  })
  const lineScale = useTransform(scrollYProgress, [0, 1], [0, 1])

  return (
    <Section id="how" tone="dark" className="overflow-hidden">
      <Container size="wide" ref={ref}>
        <SectionIntro
          kicker="How it will work"
          body="This is the design, not a demo you can try yet. Three steps, and then the app is out of your way."
        >
          <span>Reclaim your time in </span>
          <span className="text-gradient-lime italic">three steps.</span>
        </SectionIntro>

        <div className="relative mt-20">
          {/* progress line runs down the left on mobile, centre on desktop */}
          <div
            aria-hidden
            className="absolute top-0 left-[1.65rem] h-full w-px bg-cream/10 lg:left-1/2 lg:-translate-x-1/2"
          >
            <motion.div
              className="h-full w-px origin-top bg-linear-to-b from-lime via-lime to-sky"
              style={{ scaleY: lineScale }}
            />
          </div>

          <div className="space-y-16 lg:space-y-24">
            {steps.map((step, i) => {
              const Art = arts[step.visual]
              const Icon = icons[step.visual]
              const left = i % 2 === 0

              return (
                <div
                  key={step.n}
                  className={cn(
                    'relative grid items-center gap-10 lg:grid-cols-2 lg:gap-20'
                  )}
                >
                  {/* art panel */}
                  <motion.div
                    initial={{ opacity: 0, x: left ? -40 : 40, filter: 'blur(10px)' }}
                    whileInView={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                    viewport={{ once: true, amount: 0.35 }}
                    transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                    className={cn(
                      'relative order-1 overflow-hidden rounded-[2rem] bg-cream/4 p-8 ring-1 ring-cream/10',
                      left ? 'lg:order-1' : 'lg:order-2'
                    )}
                  >
                    <div className="absolute -top-24 -right-16 size-56 rounded-full bg-lime/10 blur-3xl" />
                    <div className="relative flex min-h-52 items-center justify-center">
                      <Art />
                    </div>
                    <span className="absolute top-5 left-5 flex items-center gap-1.5 rounded-full bg-cream/8 px-2.5 py-1 text-eyebrow font-bold tracking-[0.14em] uppercase text-cream/50">
                      <Icon className="size-3 text-lime" /> step {step.n}
                    </span>
                  </motion.div>

                  {/* copy */}
                  <motion.div
                    initial={{ opacity: 0, x: left ? 40 : -40 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.35 }}
                    transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                    className={cn(
                      'relative order-2 pl-16 lg:pl-0',
                      left ? 'lg:order-2 lg:text-left' : 'lg:order-1 lg:text-right'
                    )}
                  >
                    {/* big ghost number on mobile */}
                    <span className="absolute top-0 left-0 font-serif text-6xl leading-none text-cream/8 lg:hidden">
                      {step.n}
                    </span>

                    <span className="hidden font-mono text-eyebrow tracking-[0.2em] text-lime/60 lg:block">
                      {step.n}
                    </span>
                    <h3 className="mt-0 font-serif text-[clamp(1.6rem,3.2vw,2.2rem)] leading-tight text-cream lg:mt-3">
                      {step.title}
                    </h3>
                    <p className="mt-4 max-w-md text-[1.02rem] leading-relaxed text-cream/60 lg:ml-auto">
                      {step.body}
                    </p>
                    {i === 2 && (
                      <div className="mt-7 flex items-center gap-2 text-[0.85rem] text-lime lg:justify-end">
                        <Check className="size-4" />
                        Set it once — it runs itself
                      </div>
                    )}
                  </motion.div>
                </div>
              )
            })}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mt-24 flex flex-col items-center gap-4"
        >
          <Button href="#waitlist" size="lg" variant="dark">
            Get it at launch
          </Button>
          <span className="font-mono text-eyebrow text-cream/35">
            Free to join · nothing to pay now
          </span>
        </motion.div>
      </Container>
    </Section>
  )
}
