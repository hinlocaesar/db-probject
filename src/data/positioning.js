/**
 * The original numeric stats (4.2M users, +2.5hrs, 96%, 80%) are gone.
 * None of them could be true of a product that has never shipped, and a
 * counter that counts up to a fabricated number is not a design flourish,
 * it is a lie with a transition on it.
 *
 * When Hush has real users, put the `stats` array back here — the animated
 * counters they drove are still built and waiting in
 * `src/hooks/useCountUp.js`.
 *
 * The `useCases` and `trustNote` exports below are positioning statements
 * rather than claims, which is why they stayed.
 */

/** The three "perfect for" lines. Framing, not a claim. */
export const useCases = [
  'sailing through a deadline',
  'finally building a habit',
  'being present with people',
]

/** One-line position on the product's design philosophy. */
export const trustNote =
  'No streaks. No points. No leaderboard. No engagement loop. Hush is built to be closed, not reopened — which is the entire point.'
