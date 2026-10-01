import { forwardRef } from 'react'
import { motion } from 'framer-motion'
import { cn } from '../../lib/utils'

/**
 * Section wrapper. Handles the light/dark alternation that gives the page
 * its rhythm, plus the `grain` texture that keeps flat colour from banding.
 */
export function Section({
  children,
  className,
  tone = 'dark',
  id,
  bleed = true,
}) {
  const tones = {
    dark: 'bg-deep text-cream',
    forest: 'bg-forest text-cream',
    mist: 'bg-mist text-deep',
    cream: 'bg-cream text-deep',
    transparent: 'bg-transparent text-cream',
  }

  return (
    <section
      id={id}
      className={cn(
        'relative isolate',
        tones[tone],
        bleed && 'py-24 sm:py-28 lg:py-36',
        className
      )}
    >
      {children}
    </section>
  )
}

/** Centred max-width container with fluid padding. */
export const Container = forwardRef(function Container(
  { children, className, size = 'default' },
  ref
) {
  const sizes = {
    default: 'max-w-6xl',
    wide: 'max-w-7xl',
    narrow: 'max-w-3xl',
    reading: 'max-w-2xl',
  }
  return (
    <div ref={ref} className={cn('container-x', sizes[size], className)}>
      {children}
    </div>
  )
})

/**
 * The kicker + big serif heading + optional body that opens most sections.
 * Pass the heading content as `children` so each section keeps full control
 * of where the italic accent sits.
 */
export function SectionIntro({
  kicker,
  children,
  body,
  className,
  width = 'max-w-2xl',
  titleClass,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24, filter: 'blur(6px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      className={cn('mx-auto text-center', width, className)}
    >
      {kicker && (
        <div className="font-mono text-eyebrow tracking-[0.28em] uppercase text-lime/70">
          {kicker}
        </div>
      )}

      <h2
        className={cn(
          'mt-5 font-serif text-[clamp(2.1rem,5.2vw,3.9rem)] leading-[1.03] text-cream',
          titleClass
        )}
      >
        {children}
      </h2>

      {body && (
        <p className="mt-6 text-[1.06rem] leading-relaxed text-cream/60">
          {body}
        </p>
      )}
    </motion.div>
  )
}
