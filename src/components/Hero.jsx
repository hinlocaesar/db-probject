import { motion } from 'framer-motion'
import { Apple, Play, Chrome, WifiOff, Flame, Hourglass } from 'lucide-react'
import { Button } from './ui/Button'
import { Container } from './ui/Section'
import { Aurora } from './ui/Aurora'
import { PhoneMock } from './ui/PhoneMock'
import { platforms } from '../data/platforms'
import { cn } from '../lib/utils'

/** Headline that animates word by word on mount. */
const headline = [
  { text: 'Silence', accent: false },
  { text: 'the', accent: false },
  { text: 'noise.', accent: true },
  { text: 'Get', accent: false },
  { text: 'your', accent: false },
  { text: 'hours', accent: true },
  { text: 'back.', accent: false },
]

const platformIcons = {
  Mac: Apple,
  Win: Apple,
  iOS: Apple,
  And: Play,
  Web: Chrome,
  Lx: Chrome,
}

/**
 * Availability chips. Hush has no download links yet, so these are
 * informational only — they say where the app is going, not that it is
 * already there.
 */
function PlatformChip({ icon: Icon, name, delay }) {
  return (
    <motion.span
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
      className="flex items-center gap-2.5 rounded-2xl bg-cream/6 px-3.5 py-2.5 ring-1 ring-cream/12"
    >
      <Icon className="size-5 shrink-0 text-cream/45" />
      <span className="text-[0.82rem] font-medium text-cream/60">{name}</span>
    </motion.span>
  )
}

/** Small floating glass cards that orbit the phone. */
function FloatCard({ icon: Icon, label, value, className, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85, y: 14 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        'glass absolute flex items-center gap-2.5 rounded-2xl px-3.5 py-2.5 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.9)]',
        className
      )}
    >
      <span className="grid size-8 shrink-0 place-items-center rounded-xl bg-lime/15">
        <Icon className="size-4 text-lime" />
      </span>
      <span>
        <span className="block text-eyebrow tracking-[0.12em] uppercase text-cream/45">
          {label}
        </span>
        <span className="mt-0.5 block text-[0.8rem] font-semibold text-cream">
          {value}
        </span>
      </span>
    </motion.div>
  )
}

export function Hero() {
  return (
    <section id="top" className="relative isolate overflow-hidden pt-32 pb-20 sm:pt-40 lg:pt-44 lg:pb-32">
      <Aurora variant="hero" />

      <Container size="wide" className="relative">
        <div className="grid items-center gap-16 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10">
          {/* ---------------------------------------------------- copy */}
          <div className="relative text-center lg:text-left">
            {/* status pill — replaces the 5-star review badge */}
            <motion.a
              href="#waitlist"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="glass group -mx-1 inline-flex min-h-11 items-center gap-2.5 rounded-full py-2 pr-4 pl-3 transition-colors hover:bg-cream/10"
            >
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-lime opacity-70" />
                <span className="relative inline-flex size-2 rounded-full bg-lime" />
              </span>
              <span className="text-[0.8rem] text-cream/75">
                <span className="font-semibold text-cream">In development</span>
                <span className="text-cream/40"> · launching soon</span>
              </span>
            </motion.a>

            {/* headline */}
            <h1 className="mt-7 font-serif text-[clamp(2.7rem,7.2vw,5.1rem)] leading-[0.98]">
              {headline.map((w, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 26, filter: 'blur(10px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  transition={{
                    duration: 0.85,
                    delay: 0.12 + i * 0.07,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="mr-[0.28em] inline-block"
                >
                  {w.accent ? (
                    <span className="text-gradient-lime italic">{w.text}</span>
                  ) : (
                    <span className="text-cream">{w.text}</span>
                  )}
                </motion.span>
              ))}
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
              className="mx-auto mt-7 max-w-lg text-[1.1rem] leading-relaxed text-cream/65 lg:mx-0"
            >
              Hush is the cross-device blocker that silences distracting apps,
              sites and feeds on every screen you own — from one session. It is
              not finished yet. Join the list and you will get the launch link
              before anyone else.
            </motion.p>

            {/* CTAs — the primary action is the only thing you can do here */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.68, ease: [0.16, 1, 0.3, 1] }}
              className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start"
            >
              <Button href="#waitlist" size="lg">
                Join the waitlist
              </Button>
              <Button href="#how" size="lg" variant="glass">
                See how it will work
              </Button>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.8 }}
              className="mt-4 font-mono text-eyebrow tracking-wide text-cream/35"
            >
              Nothing to pay now · One email when it launches
            </motion.p>

            {/* platform availability */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.95 }}
              className="mt-10"
            >
              <div className="flex items-center gap-2 font-mono text-eyebrow tracking-[0.24em] uppercase text-cream/35">
                <Hourglass className="size-3" />
                Building for
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-2.5">
                {platforms.slice(0, 5).map((p, i) => (
                  <PlatformChip
                    key={p.name}
                    icon={platformIcons[p.abbr]}
                    name={p.name}
                    delay={1.0 + i * 0.08}
                  />
                ))}
              </div>
            </motion.div>
          </div>

          {/* ------------------------------------------------ phone + cards */}
          <div className="relative flex justify-center lg:justify-end">
            <div className="relative">
              {/* rotating dashed ring behind the phone */}
              <div
                aria-hidden
                className="absolute top-1/2 left-1/2 size-[26rem] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-30 sm:size-[30rem]"
                style={{
                  background:
                    'conic-gradient(from 0deg, transparent 0deg, var(--color-lime) 40deg, transparent 120deg, var(--color-sky) 200deg, transparent 300deg)',
                  maskImage: 'radial-gradient(circle, transparent 62%, #000 63%)',
                  WebkitMaskImage: 'radial-gradient(circle, transparent 62%, #000 63%)',
                  animation: 'spin 26s linear infinite',
                }}
              />

              <motion.div
                initial={{ opacity: 0, y: 40, rotate: -6 }}
                animate={{ opacity: 1, y: 0, rotate: -4 }}
                transition={{ duration: 1.2, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
              >
                <PhoneMock screen="locked" />
              </motion.div>

              <FloatCard
                icon={WifiOff}
                label="Blocked"
                value="14 apps · all sites"
                delay={1.3}
                className="-top-2 -left-4 sm:-left-16 lg:-left-24"
              />
              <FloatCard
                icon={Flame}
                label="Session length"
                value="2h 36m"
                delay={1.45}
                className="-bottom-4 -right-2 sm:-right-10 lg:-right-20"
              />

              {/* the screens are a preview, so say so */}
              <p className="absolute -bottom-7 left-1/2 w-full -translate-x-1/2 text-center font-mono text-eyebrow tracking-[0.18em] text-cream/25 uppercase">
                App preview
              </p>
            </div>
          </div>
        </div>
      </Container>

      {/* fade into the next section */}
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-40 bg-linear-to-b from-transparent to-deep"
      />
    </section>
  )
}
