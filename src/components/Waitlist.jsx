import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import { Container } from './ui/Section'
import { EmailForm } from './ui/EmailForm'
import { tagline } from '../data/waitlist'

/**
 * This slot used to be the "As seen in" press-logo marquee. Those logos
 * were invented, and an unreleased product has not been written about,
 * so the band is now the page's primary email capture: the promise on the
 * left, the waitlist form on the right, directly beneath the hero.
 */
export function Waitlist() {
  return (
    <section
      id="waitlist"
      className="relative scroll-mt-24 overflow-hidden border-y border-cream/8 bg-forest py-16 sm:py-20"
    >
      {/* soft lime wash so the band reads as part of the hero */}
      <div
        aria-hidden
        className="bloom bg-lime/10 size-[32rem] -top-40 left-1/2 -translate-x-1/2"
      />

      <Container size="wide" className="relative">
        <div className="grid items-center gap-10 lg:grid-cols-[1.15fr_1fr] lg:gap-16">
          {/* promise */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex items-center gap-2 font-mono text-eyebrow tracking-[0.24em] uppercase text-lime/70">
              <Sparkles className="size-3" />
              In development
            </div>
            <p className="mt-4 font-serif text-[clamp(1.5rem,3.4vw,2.2rem)] leading-[1.12] text-cream">
              {tagline.subhead}
            </p>
          </motion.div>

          {/* capture */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            <EmailForm />
          </motion.div>
        </div>
      </Container>
    </section>
  )
}