import { motion } from 'framer-motion'
import { Check, Sparkles, Hourglass } from 'lucide-react'
import { Container, Section, SectionIntro } from './ui/Section'
import { Aurora } from './ui/Aurora'
import { EmailForm } from './ui/EmailForm'
import { cn } from '../lib/utils'

/**
 * Pricing for an unreleased product.
 *
 * Nothing here is purchasable, so the cards describe the *intended*
 * model and every CTA joins the waitlist instead. Final numbers get
 * confirmed before launch — announcing a price for software that does
 * not exist yet only creates a promise you have to keep.
 */
const plans = [
  {
    name: 'Free',
    price: 'Free',
    cadence: 'always',
    blurb: 'Enough to find out whether this works for you.',
    features: [
      '1 active session at a time',
      'Block up to 10 apps & sites',
      'Mac, Windows, iOS, Android, browser',
      'Basic daily scheduling',
    ],
    featured: false,
  },
  {
    name: 'Pro',
    price: 'Founding price',
    cadence: 'for waitlist members',
    blurb: 'Locked in for everyone who joins the list before launch. Final price confirmed at release.',
    features: [
      'Unlimited sessions & blocklists',
      'Locked mode — no early exits',
      'Unlimited cross-device sync',
      'Full focus sound library',
      'Website exception lists',
      'Focus history and reports',
    ],
    featured: true,
  },
]

/** No perpetual tier. Selling a lifetime licence for an app with no
 *  release history is how you end up refunding a year from now. */
const postLaunch = [
  {
    q: 'Why no lifetime licence?',
    a: 'The original plan had a one-time "Forever" tier. We dropped it: for software with no release history yet, we would rather earn the right to charge annually than lock people into a price now and change it later.',
  },
  {
    q: 'When will pricing be final?',
    a: 'Before launch, not after. Everyone on the list gets the founding rate regardless of what the eventual price turns out to be.',
  },
  {
    q: 'Do I pay anything now?',
    a: 'No. Joining the list is free and there is nothing to pay. We only ask for money once the product is real and you have used it.',
  },
]

function Plan({ plan, index }) {
  const f = plan.featured

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.8, delay: index * 0.12, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        'relative flex flex-col rounded-[2rem] p-7 ring-1 transition-shadow duration-500 sm:p-9',
        f
          ? 'ring-conic bg-linear-to-b from-lime/12 to-cream/4 shadow-[0_40px_90px_-40px] shadow-lime/50'
          : 'bg-cream/4 ring-cream/10'
      )}
    >
      {f && (
        <span className="absolute -top-3 left-1/2 flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-lime px-3.5 py-1.5 text-eyebrow font-bold tracking-[0.1em] text-deep uppercase shadow-[0_8px_24px_-6px] shadow-lime/70">
          <Sparkles className="size-3" /> Waitlist only
        </span>
      )}

      <div className="relative">
        <h3 className="font-serif text-[1.5rem] text-cream">{plan.name}</h3>
        <p className="mt-2 min-h-[3.4rem] text-[0.9rem] leading-snug text-cream/50">
          {plan.blurb}
        </p>

        <div className="mt-7 flex items-baseline gap-2">
          <span
            className={cn(
              'font-serif text-[clamp(2rem,4.4vw,2.9rem)] leading-none',
              f ? 'text-lime' : 'text-cream'
            )}
          >
            {plan.price}
          </span>
        </div>
        <div className="mt-1.5 text-[0.85rem] text-cream/40">{plan.cadence}</div>
      </div>

      <ul className="relative mt-8 flex-1 space-y-3">
        {plan.features.map((x) => (
          <li
            key={x}
            className="flex items-start gap-2.5 text-[0.9rem] text-cream/70"
          >
            <span
              className={cn(
                'mt-0.5 grid size-4.5 shrink-0 place-items-center rounded-full',
                f ? 'bg-lime/20' : 'bg-cream/10'
              )}
            >
              <Check
                className={cn('size-2.5', f ? 'text-lime' : 'text-cream/60')}
              />
            </span>
            {x}
          </li>
        ))}
      </ul>
    </motion.div>
  )
}

export function Pricing() {
  return (
    <Section id="pricing" tone="dark" className="overflow-hidden">
      <Aurora variant="calm" opacity={0.55} />

      <Container size="wide" className="relative">
        <SectionIntro kicker="Pricing">
          <span>Nothing to pay. </span>
          <span className="text-gradient-lime italic">Not yet, anyway.</span>
        </SectionIntro>

        <motion.p
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="mx-auto mt-6 max-w-2xl text-center text-[1.06rem] leading-relaxed text-cream/60"
        >
          Hush has not launched, so there is nothing to buy. Here is the
          model we intend to ship — and joining the list locks in founding
          pricing before we finalise it.
        </motion.p>

        <div className="mt-16 grid items-stretch gap-5 lg:grid-cols-2">
          {plans.map((p, i) => (
            <Plan key={p.name} plan={p} index={i} />
          ))}
        </div>

        {/* single shared capture */}
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mx-auto mt-12 max-w-xl"
        >
          <EmailForm buttonLabel="Lock in founding pricing" />
        </motion.div>

        {/* pricing FAQs */}
        <div className="mx-auto mt-20 max-w-3xl space-y-3">
          <div className="mb-6 flex items-center gap-2 font-mono text-eyebrow tracking-[0.24em] uppercase text-cream/40">
            <Hourglass className="size-3.5" />
            On pricing
          </div>
          {postLaunch.map((item, i) => (
            <motion.div
              key={item.q}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.7, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="rounded-3xl bg-cream/4 p-6 ring-1 ring-cream/10"
            >
              <h3 className="text-[1rem] font-semibold text-lime">{item.q}</h3>
              <p className="mt-2.5 text-[0.94rem] leading-relaxed text-cream/60">
                {item.a}
              </p>
            </motion.div>
          ))}
        </div>
      </Container>
    </Section>
  )
}
