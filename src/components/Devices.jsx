import { motion } from 'framer-motion'
import { Smartphone, Laptop, Tablet, Chrome, Apple, Monitor } from 'lucide-react'
import { Container, Section, SectionIntro } from './ui/Section'
import { Button } from './ui/Button'
import { platforms } from '../data/platforms'
import { cn } from '../lib/utils'

const icons = { Mac: Apple, Win: Monitor, iOS: Smartphone, And: Smartphone, Web: Chrome, Lx: Laptop }

/** Small device glyph used in the sync diagram. */
function DeviceNode({ icon: Icon, label, className, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 16 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        'glass flex w-24 flex-col items-center gap-2 rounded-2xl px-2 py-4 shadow-[0_20px_50px_-24px_rgba(0,0,0,0.9)]',
        className
      )}
    >
      <Icon className="size-5 text-lime" />
      <span className="text-eyebrow font-medium text-cream/70">{label}</span>
      {/* live pulse */}
      <span className="relative mt-0.5 flex size-1.5">
        <span className="absolute inline-flex size-full animate-ping rounded-full bg-lime opacity-70" />
        <span className="relative inline-flex size-1.5 rounded-full bg-lime" />
      </span>
    </motion.div>
  )
}

/** Dashed arcs between the devices, drawn with an animated dash offset. */
function SyncArcs() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 400 240"
      className="pointer-events-none absolute inset-0 h-full w-full"
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id="arc" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="var(--color-lime)" stopOpacity="0" />
          <stop offset="50%" stopColor="var(--color-lime)" stopOpacity="0.9" />
          <stop offset="100%" stopColor="var(--color-sky)" stopOpacity="0" />
        </linearGradient>
      </defs>

      {[
        'M60,60 C140,60 260,40 340,40',
        'M60,60 C140,120 260,120 340,120',
        'M60,60 C140,180 260,200 340,200',
        'M40,180 C160,180 240,60 360,60',
      ].map((d, i) => (
        <motion.path
          key={d}
          d={d}
          fill="none"
          stroke="url(#arc)"
          strokeWidth="1.6"
          className="dash-flow"
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.4, delay: 0.3 + i * 0.15, ease: [0.16, 1, 0.3, 1] }}
        />
      ))}
    </svg>
  )
}

export function Devices() {
  return (
    <Section tone="forest" className="overflow-hidden">
      <Container size="wide">
        <SectionIntro
          kicker="Cross-device sync"
          body="The plan is one session across every screen you own: start it anywhere and everything else goes quiet in the same instant. Most focus tools we tried made you pick a device. This is the part we care most about getting right."
        >
          <span>One session. </span>
          <span className="text-gradient-lime italic">Every device.</span>
          <br />
          <span>Zero noise.</span>
        </SectionIntro>

        {/* sync diagram */}
        <div className="relative mx-auto mt-20 max-w-2xl">
          <div className="relative h-64 sm:h-72">
            <SyncArcs />

            <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 place-items-center">
              <DeviceNode icon={Laptop} label="Mac" className="col-start-1 row-start-2" delay={0.2} />
              <DeviceNode icon={Monitor} label="Windows" className="col-start-3 row-start-1" delay={0.32} />
              <DeviceNode icon={Smartphone} label="iPhone" className="col-start-3 row-start-3" delay={0.44} />
              <DeviceNode icon={Tablet} label="Android" className="col-start-1 row-start-1" delay={0.56} />
            </div>

            {/* hub in the middle */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            >
              <div className="relative grid size-20 place-items-center rounded-3xl bg-lime shadow-[0_0_60px_-8px] shadow-lime/80">
                <span className="absolute inset-0 animate-pulse-ring rounded-3xl bg-lime/50" />
                <svg
                  viewBox="0 0 32 32"
                  className="relative size-9 text-deep"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.6"
                  strokeLinecap="round"
                >
                  <path d="M9 13v6" />
                  <path d="M16 8v16" />
                  <path d="M23 11.5v9" />
                </svg>
              </div>
            </motion.div>
          </div>
        </div>

        {/* platform pills */}
        <div className="mt-16 flex flex-wrap items-center justify-center gap-2.5">
          {platforms.map((p, i) => {
            const Icon = icons[p.abbr] ?? Laptop
            return (
              <motion.span
                key={p.name}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.06 }}
                className="flex items-center gap-2.5 rounded-2xl bg-cream/6 px-4 py-3 ring-1 ring-cream/10"
              >
                <Icon className="size-4.5 text-cream/40" />
                <span className="text-[0.88rem] font-medium text-cream/60">
                  {p.name}
                </span>
              </motion.span>
            )
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mt-12 flex flex-col items-center gap-3"
        >
          <Button href="#waitlist" size="lg">
            Join the waitlist
          </Button>
          <span className="font-mono text-eyebrow text-cream/30">
            macOS and Windows first
          </span>
        </motion.div>
      </Container>
    </Section>
  )
}
