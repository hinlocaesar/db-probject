# Hush — pre-launch waitlist page

A marketing landing page for **Hush**, a cross-device focus app that blocks
apps, sites and the whole internet on every screen at once. Built from scratch
with Vite, React, Tailwind v4 and Framer Motion, modelled on the structure and
calm green/lime feel of [freedom.to](https://freedom.to/).

**The product does not exist yet.** The goal of the site is a single action:
collect email addresses so the people who sign up hear about it the day it
launches. So the page makes no claims it cannot support. There are no star
ratings, no user counts, no press logos, no invented research citations and no
"download now" buttons, because an unreleased product cannot honestly have any
of those. Every word of copy, the brand, the logo and the app screens are
original work — nothing is lifted from the reference site.

---

## Libraries

Everything is in `package.json` — this is the full dependency list.

| Package | Version | What it does here |
| --- | --- | --- |
| `react` / `react-dom` | 18.3 | UI runtime |
| `vite` | 6.x | Dev server + build |
| `@vitejs/plugin-react` | 4.x | Fast Refresh, JSX transform |
| `tailwindcss` | 4.x | Utility CSS, configured in `src/index.css` |
| `@tailwindcss/vite` | 4.x | Tailwind v4 plugin — no `tailwind.config.js` needed |
| `framer-motion` | 11.x | Scroll reveals, springs, layout animations, accordions |
| `lenis` | 1.x | Momentum smooth scrolling (and anchor navigation) |
| `lucide-react` | 0.469 | Icon set |
| `clsx` | 2.x | Conditional class names (in `cn()`) |
| `tailwind-merge` | 2.x | Conflict-free Tailwind class merging (in `cn()`) |
| `@playwright/test` | 1.x | Content, accessibility and layout tests + screenshots |

Fonts come from Google Fonts via `<link>` in `index.html`: **Young Serif**
(display), **Gabarito** (UI), **JetBrains Mono** (labels).

---

## Commands

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # -> dist/
npm run preview   # serve the production build
npm test          # Playwright: content + a11y, desktop and mobile
npm run audit     # measured layout report at six widths
npm run shots     # write screenshots to shots/
```

`npm test` starts the dev server itself, so it needs the port free (or set
`BASE_URL` to point it at a running instance).

---

## Connecting a real email service

The form has no backend yet, on purpose — there is nothing to post to until you
have somewhere to post to. `ui/EmailForm.jsx` validates the address, shows an
animated success state, and logs the signup to the console so you can confirm it
fires.

To wire it up, replace the marked block inside `handleSubmit`:

```js
// src/components/ui/EmailForm.jsx
const res = await fetch('https://your-endpoint.example/subscribe', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: value }),
})
if (!res.ok) throw new Error('subscribe failed')
```

Keep the same outcome shape: resolve normally for success, throw or return a
failure for the error state. Works with Buttondown, Mailchimp, ConvertKit, a
Google Apps Script, or your own API. The form is used in six places (hero-adjacent
band, "why we're building", "why Hush", pricing, closing CTA, footer) — all of
them share the one component, so there is a single place to change.

Three things worth adding when you do:

- Server-side validation. The regex in the component is a shape check, not a
  guarantee.
- A real unsubscribe path, since the page promises one.
- Duplicate handling — same address twice should be a no-op, not an error.

---

## Project structure

```
src/
├── main.jsx                 entry point
├── App.jsx                  section order
├── index.css                design tokens + custom utilities + keyframes
│
├── data/                    ← all copy lives here, no JSX text to hunt down
│   ├── waitlist.js          promise, perks, honest-status Q&A, platform status
│   ├── launch.js            build phases + closing CTA line
│   ├── manifesto.js         brand statement section
│   ├── positioning.js       use cases + trust note
│   ├── features.js          5 feature rows (drives the phone screens)
│   ├── faq.js               accordion Q&A
│   └── platforms.js         3 steps, device list, footer links, socials
│
├── hooks/
│   ├── useSmoothScroll.js   Lenis setup + anchor handling
│   ├── useModalFocus.js     focus trap / inert / Escape for the mobile menu
│   ├── useCountUp.js        rAF count-up — unused until there are real numbers
│   │
│   └── useScrolled.js       nav "has scrolled" state
│
├── lib/
│   └── utils.js             cn() class merger
│
└── components/
    ├── Nav.jsx              floating pill nav + mobile sheet
    ├── Hero.jsx
    ├── Waitlist.jsx         the first capture point, right under the hero
    ├── Manifesto.jsx        animated waveform graphic
    ├── WhyUs.jsx            design commitments + second capture point
    ├── WhyHush.jsx          perks, use cases, honest-status block
    ├── Platforms.jsx        build order + per-platform availability
    ├── Pricing.jsx          founding-member framing
    ├── Devices.jsx          SVG sync diagram
    ├── HowItWorks.jsx       scroll-driven progress line
    ├── Features.jsx
    ├── Faq.jsx
    ├── FinalCta.jsx         closing capture + launch timeline
    ├── Footer.jsx
    └── ui/
        ├── Button.jsx       variants + sliding-arrow hover
        ├── EmailForm.jsx    the capture component, used six times
        ├── Section.jsx      Section / Container / SectionIntro
        ├── Aurora.jsx       animated gradient blooms + grid
        ├── Logo.jsx         logomark + lockup
        └── PhoneMock.jsx    5 fake app screens, all CSS/SVG

tests/
├── scroll.mjs               shared "fire every reveal" helper
├── content.spec.js          honest-copy, anchors, forms, overflow
├── a11y.spec.js             keyboard, focus, reduced motion, 320px
├── audit.mjs                measured layout report (contrast, targets, padding)
├── overflow.mjs             ancestor-chain dump for any overflow finding
└── screenshots.mjs          full-page + per-section captures
```

---

## Design tokens

Defined once in `src/index.css` under `@theme`, which is what makes
`bg-lime`, `text-cream`, `font-serif` etc. available everywhere.

```
Greens    ink #071610 · deep #0b2018 · forest #143c2b · moss #1f5c40
          fern #2e7d57 · sage #7fae8f · lime #dfff80 · lime-bright #eaffa3
Neutrals  mist #f7faf0 · cream #fffdf5
Accents   coral #ff7a59 · sky #5ac5fa · amber #f8ad17 · lilac #b79bff
```

Custom utilities worth knowing:

- `container-x` — fluid padding, no config
- `text-gradient-lime` — gradient text
- `glass` — frosted panel
- `bloom` — absolutely-positioned blurred circle
- `lit-top` — hairline highlight along a card's top edge
- `ring-conic` — animated rotating gradient border
- `marquee-mask` — fades content at both edges
- `dash-flow` — marching-ants stroke
- `grid-fade` / `grain` — subtle texture layers
- `text-eyebrow` — 11.2px, the floor for uppercase mono labels

`text-eyebrow` replaced a spread of `text-[0.58rem]` through `text-[0.7rem]`
sizes used for the same role. Everything below ~0.65rem was unreadable on a
phone, which is where most visits come from; one token means one size. Sizes
inside `PhoneMock` are deliberately left alone, since that is app UI rendered at
a reduced scale rather than page copy.

---

## How the tricky bits work

**Phone screens** (`ui/PhoneMock.jsx`) are real DOM and SVG, not images. Each
feature selects a screen via `feature.screen`, and inner elements animate in on
scroll — so the mockups feel alive and the page ships with no image requests
beyond the favicon. Both the hero and the Features section label them as
previews, since they show an app that has not shipped.

**Smooth scroll** (`useSmoothScroll.js`) runs a Lenis rAF loop and intercepts
in-page `href="#..."` clicks so anchors ease down the page instead of jumping.
It is removed for anyone with `prefers-reduced-motion`.

**Section rhythm** — `Section` handles the dark/forest/mist/cream alternation
that gives the page its pacing, and `SectionIntro` collects the kicker + serif
heading + body block that opens most sections, so the accent position stays a
per-section decision rather than a repeated chunk of markup.

**Accessibility** — one `<h1>`, ordered headings, a skip link to `#main`,
`aria-expanded` / `aria-controls` on the FAQ buttons, `role="status"` and
`aria-live` on the form success state, `aria-invalid` + `aria-describedby` on
the error state, `aria-label`s on icon-only links, and visible `:focus-visible`
rings on every control including the email field, which carries its own inset
ring because the page-level lime ring is invisible on a white input.

The mobile menu is a real modal: `useModalFocus` moves focus into it, wraps Tab
at both ends, closes on Escape, restores focus to the toggle, and marks
everything outside it `inert` while open. Without the `inert` marking, Tab
walked straight out of the sheet into the page behind it.

**Reduced motion** is handled in three places, because each covers something
the others miss. `MotionConfig reducedMotion="user"` in `main.jsx` makes Framer
drop the x/y/scale parts of all 57 `whileInView` reveals — a media query alone
cannot, since `whileInView` sets the initial transform directly. The
`prefers-reduced-motion` block in `index.css` turns off the idle loops
(`animate-float`, `animate-drift`, the conic ring) outright rather than
shortening them, because a shortened animation still snaps to its last
keyframe — which left three phone mockups permanently tilted 2°. And it
resets inline transforms outright so nothing is left mid-reveal.

**Contrast and layout are measured, not eyeballed** (`npm run audit`). Colours
are resolved by painting them into a canvas rather than parsing the computed
string, because Tailwind v4 emits `oklab(… / 0.7)` and splitting that on
digits gives garbage channels — every ratio came out wrong before that was
fixed. WCAG AA is enforced at 360/390/768/1024/1440/1920, with a separate
advisory pass for the 44px comfortable target size, which AA does not require.

**Structured data** — `index.html` ships FAQ JSON-LD matching the visible FAQ.
There is deliberately no `SoftwareApplication` block, no `aggregateRating` and no
`offers`: those are exactly the fields that would put invented numbers into a
search snippet.

---

## Content honesty

The original build of this page had a 4.8-star rating, 9,214 reviews, 4.2M
users, +2.5 hours a day, 96% felt more productive, eight universities' worth of
research, and a press marquee full of magazines. All of it was invented, and all
of it was removed when the site became a waitlist page.

What replaced it:

| Removed | Replaced with |
| --- | --- |
| Press marquee | The first waitlist capture, directly under the hero |
| 5-star rating pill | "In development · launching soon" status pill |
| 16 review cards | Design commitments: no dark patterns, no browsing data, no subscription guilt |
| 4 animated counters | Waitlist perks, use cases, and an honest-status Q&A block |
| Research grid | Per-platform availability and the build order |
| Store badges | Availability chips with no download links |
| "Start free" / "Log in" | "Join the waitlist" everywhere |
| $34.99/yr and $149 lifetime | Founding-member framing, no final numbers published |

`useCountUp.js` is still in `hooks/` for when there are real post-launch metrics
to animate.

---

## Ideas for extending it

- Swap `data/` for real content — the components take no hardcoded text
- Add a confirmation page after signup, or a `/privacy` route
- A second capture variant for paid traffic once you have a landing-page test
- Replace `PhoneMock` with real app screenshots (it already takes a `screen` prop)