export const platforms = [
  { name: 'macOS', abbr: 'Mac' },
  { name: 'Windows', abbr: 'Win' },
  { name: 'iOS & iPadOS', abbr: 'iOS' },
  { name: 'Android', abbr: 'And' },
  { name: 'Chrome & Edge', abbr: 'Web' },
  { name: 'Linux', abbr: 'Lx' },
]

/**
 * Footer link columns. These describe what exists today — a waitlist, a
 * FAQ and an email address. Nothing points at a store listing, a login
 * or a purchase flow, because none of those exist yet.
 */
export const footerColumns = [
  {
    title: 'Waitlist',
    links: [
      { label: 'Join the list', href: '#waitlist' },
      { label: 'What you get', href: '#why' },
      { label: 'Founding pricing', href: '#pricing' },
      { label: 'Launch timeline', href: '#launch' },
    ],
  },
  {
    title: 'The product',
    links: [
      { label: 'Why we are building it', href: '#about' },
      { label: 'Platforms', href: '#platforms' },
      { label: 'How it works', href: '#how' },
      { label: 'Planned features', href: '#features' },
    ],
  },
  {
    title: 'Questions',
    links: [
      { label: 'Is it available?', href: '#faq' },
      { label: 'What happens to my email?', href: '#faq' },
      { label: 'Will it cost anything?', href: '#faq' },
      { label: 'Do you track browsing?', href: '#faq' },
    ],
  },
  {
    title: 'Contact',
    links: [
      { label: 'hello@hush.app', href: 'mailto:hello@hush.app' },
      { label: 'Privacy promise', href: '#why' },
      { label: 'Press enquiries', href: 'mailto:press@hush.app' },
      { label: 'Report a bug later', href: '#faq' },
    ],
  },
]

export const socials = ['X', 'Instagram', 'YouTube', 'LinkedIn', 'Threads']

/** The three "how it works" steps. `visual` selects a rendered illustration. */
/**
 * The three "how it works" steps. Written as future-tense design intent,
 * not as instructions for software you can download today.
 */
export const steps = [
  {
    n: '01',
    title: 'Pick your devices',
    body: 'Phone, tablet, laptop, or all of them. Link every screen you own once, and Hush treats them as one surface to protect.',
    visual: 'devices',
  },
  {
    n: '02',
    title: 'Choose what to silence',
    body: 'Specific apps, specific sites, or the entire internet — with exceptions for the things you still need. Build lists for work, evenings and weekends.',
    visual: 'blocklist',
  },
  {
    n: '03',
    title: 'Set it and go',
    body: 'Choose a length and a schedule. Hush starts itself, holds the line, and hands you back your evening without you having to remember any of it.',
    visual: 'timer',
  },
]

/**
 * Removed with the rest of the launch-CTA fiction: footer links to store
 * listings, a login, a gift purchase, an affiliate programme, a merch
 * store and a support knowledge base. None of those exist yet, so every
 * link either went nowhere or pointed at a page that was never going to
 * be built. The columns above replace them with links to real sections
 * on this page and a mailto address.
 */
