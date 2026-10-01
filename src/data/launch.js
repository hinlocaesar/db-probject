/**
 * Launch sequencing. Replaces the "millions of users" CTA band and the
 * trust note that used to lean on adoption numbers.
 */

/** Build phases, shown as a timeline. */
export const launchPhases = [
  {
    label: 'Now',
    title: 'Building it',
    body: 'Core blocking engine in development. macOS and Windows first, because they are the hardest to do well.',
    state: 'active',
  },
  {
    label: 'Next',
    title: 'Private beta',
    body: 'A small group gets early builds so we can find the bugs that matter before anyone else does.',
    state: 'upcoming',
  },
  {
    label: 'Then',
    title: 'Public launch',
    body: 'First release goes out to the waitlist, then the stores. This page turns into the real product site.',
    state: 'upcoming',
  },
  {
    label: 'After',
    title: 'Everywhere else',
    body: 'Android, the browser extension, then Linux if there is genuine demand for it.',
    state: 'upcoming',
  },
]

/** Short line for the closing CTA band. */
export const closingLine = {
  title: 'It is not ready yet.',
  accent: 'You can still get in early.',
  body: 'Everyone on the list gets the launch link first, a discounted first year, and a free Pro upgrade. One email when it ships, and nothing else.',
}
