import { cn } from '../../lib/utils'

/**
 * Layered coloured blooms that sit behind a section. This is the single
 * biggest visual upgrade over a flat background — it gives the dark canvas
 * depth without any image weight.
 */
export function Aurora({
  className,
  variant = 'hero',
  opacity = 1,
}) {
  const variants = {
    hero: [
      { c: 'bg-lime/25', s: 'size-[42rem]', x: '-18%', y: '-28%' },
      { c: 'bg-moss/45', s: 'size-[38rem]', x: '52%', y: '-14%' },
      { c: 'bg-sky/18', s: 'size-[30rem]', x: '18%', y: '38%' },
    ],
    calm: [
      { c: 'bg-moss/35', s: 'size-[34rem]', x: '-14%', y: '-24%' },
      { c: 'bg-fern/25', s: 'size-[26rem]', x: '58%', y: '10%' },
    ],
    warm: [
      { c: 'bg-coral/22', s: 'size-[32rem]', x: '60%', y: '-22%' },
      { c: 'bg-amber/18', s: 'size-[26rem]', x: '-12%', y: '18%' },
      { c: 'bg-lilac/20', s: 'size-[24rem]', x: '30%', y: '46%' },
    ],
  }

  return (
    <div
      aria-hidden
      className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)}
      style={{ opacity }}
    >
      {variants[variant].map((b, i) => (
        <div
          key={i}
          className={cn('bloom animate-drift', b.c, b.s)}
          style={{
            left: b.x,
            top: b.y,
            animationDelay: `${i * -6}s`,
            animationDuration: `${20 + i * 5}s`,
          }}
        />
      ))}

      {/* Faint grid — reads as "engineered" and hides gradient banding */}
      <div className="grid-fade absolute inset-0" />
    </div>
  )
}
