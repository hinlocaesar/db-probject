import { cn } from '../../lib/utils'

/**
 * Hush mark: a soundwave in a rounded square. The three bars get taller
 * then shorter, reading as "audio going quiet".
 */
export function Logomark({ className, animated = false }) {
  return (
    <span
      className={cn(
        'relative grid place-items-center overflow-hidden rounded-[30%] bg-lime',
        className
      )}
    >
      {animated && (
        <span className="absolute inset-0 animate-pulse-ring bg-lime/40" />
      )}
      <svg
        viewBox="0 0 32 32"
        className="relative size-[62%] text-deep"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinecap="round"
      >
        <path d="M9 13v6" />
        <path d="M16 8v16" />
        <path d="M23 11.5v9" />
      </svg>
    </span>
  )
}

/** Full lockup: mark + wordmark. */
export function Logo({ className, markClass, animated = false, compact = false }) {
  return (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      <Logomark
        animated={animated}
        className={cn('size-9', markClass)}
      />
      {!compact && (
        <span className="font-serif text-2xl leading-none tracking-[-0.02em] text-cream">
          Hush
        </span>
      )}
    </span>
  )
}
