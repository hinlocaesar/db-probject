/**
 * Pre-launch waitlist page — the "As seen in" press marquee and star
 * ratings are deliberately omitted. Nothing here is a real institution,
 * a real user, or a real number. Every claim is about intent, not proof.
 */

/** The product promise, in one line. Replaces the press marquee. */
export const tagline = {
  subhead:
    'Hush is a cross-device blocker that silences distracting apps, sites and feeds on every screen you own — all from one session.',
}

/** Why join the list. Three items, no numeric claims. */
export const waitlistPerks = [
  {
    title: 'Day-one access',
    body: 'You get the launch link before the public announcement, and before the App Store and Play Store approval queues.',
    tone: 'lime',
  },
  {
    title: 'Founder pricing',
    body: 'Everyone on the list locks in a discounted first year, with a free Pro upgrade included.',
    tone: 'sky',
  },
  {
    title: 'Shape the roadmap',
    body: 'Early users get a direct line to the people building it. Tell us what to build and we will tell you what shipped.',
    tone: 'coral',
  },
]

/** What is genuinely true about a product that does not exist yet. */
export const realityCheck = {
  title: 'No numbers yet. Here is the honest version.',
  points: [
    {
      q: 'Is Hush available?',
      a: 'No. Hush is in development. Nothing here is available to download today, and the screens on this page are previews of the app we are building.',
    },
    {
      q: 'Why are you building it?',
      a: 'Every focus tool we tried either managed one screen or became another thing to check. We wanted one that covers everything and then gets out of the way.',
    },
    {
      q: 'What happens to my email?',
      a: 'One email when we launch, and nothing else. No drip campaign, no sharing, no selling. One unsubscribe link that works immediately.',
    },
  ],
}

/** Availability of each platform at launch. */
export const launchPlatforms = [
  { name: 'macOS', status: 'Public beta', timing: 'First wave' },
  { name: 'Windows', status: 'Public beta', timing: 'First wave' },
  { name: 'iOS & iPadOS', status: 'In review', timing: 'Store approval' },
  { name: 'Android', status: 'In development', timing: 'Shortly after' },
  { name: 'Chrome & Edge', status: 'In development', timing: 'Shortly after' },
  { name: 'Linux', status: 'Planned', timing: 'If demand holds' },
]
