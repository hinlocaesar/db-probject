import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { Container, Section } from './ui/Section'
import { Aurora } from './ui/Aurora'
import { Button } from './ui/Button'
import { manifesto, manifestoNote } from '../data/manifesto'
import { cn } from '../lib/utils'

/** Abstract "sound dissolving" graphic — pure SVG, no image weight. */
function WaveGraphic() {
  const rings = [0, 1, 2, 3]
  const bars = Array.from({ length: 26 })

  return (
    <div className="relative mx-auto aspect-square w-full max-w-[26rem]">
      {/* expanding rings */}
      {rings.map((r) => (
        <motion.span
          key={r}
          aria-hidden
          className="absolute top-1/2 left-1/2 rounded-full border border-lime/25"
          style={{
            width: `${38 + r * 20}%`,
            height: `${38 + r * 20}%`,
            marginLeft: `${-(19 + r * 10)}%`,
            marginTop: `${-(19 + r * 10)}%`,
          }}
          animate={{ scale: [0.92, 1.06, 0.92], opacity: [0.5, 0.15, 0.5] }}
          transition={{
            duration: 5 + r * 1.4,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: r * 0.5,
          }}
        />
      ))}

      {/* centre glow */}
      <div className="absolute top-1/2 left-1/2 size-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-lime/20 blur-3xl" />

      {/* waveform bars, mirrored around the centre */}
      <div className="absolute inset-0 grid place-items-center">
        <div className="flex h-40 items-center gap-[5px]">
          {bars.map((_, i) => {
            const dist = Math.abs(i - (bars.length - 1) / 2) / ((bars.length - 1) / 2)
            const h = 14 + (1 - dist) * 92
            return (
              <motion.span
                key={i}
                className={cn(
                  'w-[3px] rounded-full',
                  i % 2 === 0 ? 'bg-lime' : 'bg-sage'
                )}
                style={{ height: `${h}px`, opacity: 0.4 + (1 - dist) * 0.6 }}
                animate={{
                  scaleY: [0.55, 1, 0.55],
                  opacity: [0.35, 0.95, 0.35],
                }}
                transition={{
                  duration: 1.6 + (i % 5) * 0.22,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: i * 0.045,
                }}
              />
            )
          })}
        </div>
      </div>

      {/* orbiting label */}
      <motion.div
        className="glass absolute top-6 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full px-3.5 py-2 whitespace-nowrap"
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
      >
        <span className="size-1.5 rounded-full bg-lime" />
        <span className="text-eyebrow font-medium text-cream/75">
          noise cancelled
        </span>
      </motion.div>
    </div>
  )
}

export function Manifesto() {
  return (
    <Section tone="dark" className="overflow-hidden">
      <Aurora variant="calm" opacity={0.75} />

      <Container size="wide" className="relative">
        <div className="grid items-center gap-14 lg:grid-cols-[1fr_1fr] lg:gap-20">
          {/* graphic */}
          <motion.div
            initial={{ opacity: 0, scale: 0.86 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
            className="order-2 lg:order-1"
          >
            <WaveGraphic />
          </motion.div>

          {/* copy */}
          <div className="order-1 lg:order-2">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="text-[1.15rem] leading-relaxed text-cream/70"
            >
              {manifesto.kicker}
            </motion.p>

            <motion.h2
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="mt-5 font-serif text-[clamp(2.1rem,5vw,3.6rem)] leading-[1.04]"
            >
              <span className="block text-cream">{manifesto.headline[0]}</span>
              <span className="text-gradient-lime block italic">
                {manifesto.headline[1]}
              </span>
              <span className="block text-cream">{manifesto.headline[2]}</span>
            </motion.h2>

            {/* supporting line, no fabricated stat */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="mt-9 border-l-2 border-lime/50 pl-5 text-[1rem] leading-relaxed text-cream/60"
            >
              {manifestoNote}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="mt-9"
            >
              <Button href="#how" size="lg" variant="glass">
                How it will work
                <ArrowRight className="size-4" />
              </Button>
            </motion.div>
          </div>
        </div>
      </Container>
    </Section>
  )
}
