import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Merge Tailwind classes, resolving conflicts.
 * cn('p-2', condition && 'p-4') -> 'p-4'
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs))
}
