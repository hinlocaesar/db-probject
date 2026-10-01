import { ArrowRight } from 'lucide-react'
import { cn } from '../../lib/utils'

const variants = {
  /* Bright lime pill with a dark arrow that slides across on hover */
  primary:
    'bg-lime text-deep hover:bg-lime-bright shadow-[0_10px_40px_-12px] shadow-lime/60',
  /* Dark pill with a lime arrow — used on light sections */
  dark: 'bg-deep text-cream hover:bg-forest shadow-[0_10px_40px_-14px] shadow-black/60',
  /* Glass pill for nav and hero */
  glass:
    'glass text-cream hover:bg-cream/12 shadow-[0_10px_40px_-18px] shadow-black/70',
  /* Quiet text link with an underline that grows */
  ghost: 'text-cream/80 hover:text-cream',
}

const sizes = {
  /* h-11 is the 44px comfortable-target floor, not a style choice. */
  sm: 'h-11 px-4 text-sm gap-2',
  md: 'h-12 px-6 text-[0.95rem] gap-2.5',
  lg: 'h-14 px-8 text-base gap-3',
}

export function Button({
  as: Tag = 'a',
  variant = 'primary',
  size = 'md',
  withArrow = true,
  className,
  children,
  ...props
}) {
  const arrowless = !withArrow || variant === 'ghost'

  return (
    <Tag
      className={cn(
        'group relative inline-flex items-center justify-center rounded-full font-semibold tracking-[-0.01em] whitespace-nowrap',
        'transition-all duration-300 ease-[var(--ease-out-expo)]',
        'hover:-translate-y-0.5 active:translate-y-0',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      <span className="relative z-10">{children}</span>

      {!arrowless && (
        <span
          className={cn(
            'relative z-10 grid size-7 place-items-center overflow-hidden rounded-full',
            'transition-all duration-500 ease-[var(--ease-out-expo)]',
            'group-hover:translate-x-1',
            variant === 'primary'
              ? 'bg-deep/10 text-deep group-hover:bg-deep'
              : 'bg-deep text-lime group-hover:bg-lime'
          )}
        >
          <ArrowRight className="size-4 transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:translate-x-8" />
        </span>
      )}
    </Tag>
  )
}
