import { useId, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, Check, Loader2, MailWarning } from 'lucide-react'
import { cn } from '../../lib/utils'

/**
 * Waitlist signup. This is the only interactive thing on the page, and it
 * appears six times, so the input id is generated per instance rather than
 * hardcoded — otherwise every label would point at the first form.
 *
 * No backend yet: it validates the address, shows a success state, and logs
 * to the console so you can confirm it fires.
 *
 * To connect a real service, replace the marked block in `handleSubmit` with
 * a request to your endpoint (Buttondown, Mailchimp, ConvertKit, a Google
 * Apps Script, or your own API) and throw on failure:
 *
 *   const res = await fetch('https://your-endpoint/subscribe', {
 *     method: 'POST',
 *     headers: { 'Content-Type': 'application/json' },
 *     body: JSON.stringify({ email: value }),
 *   })
 *   if (!res.ok) throw new Error('subscribe failed')
 *
 * Two things that have to happen server-side, not here: real validation,
 * and handling the same address twice as a no-op rather than an error.
 *
 * `tone` only affects the text that sits *outside* the white input box: the
 * privacy line, the error, and the success state. The box itself is white in
 * both tones. Every section that hosts a form is dark, so `dark` is the
 * default and no call site has to pass it — set `tone="light"` if you ever
 * put one on `mist` or `cream`.
 */
export function EmailForm({
  className,
  buttonLabel = 'Join the waitlist',
  onSuccess,
  tone = 'dark',
}) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle') // idle | loading | done | error
  const [message, setMessage] = useState('')

  const inputId = useId()
  const errorId = `${inputId}-error`

  /* Colour sets for the copy that lives outside the white box. */
  const outside = {
    dark: {
      done: 'bg-lime/10 ring-lime/25',
      tick: 'bg-lime text-deep',
      doneTitle: 'text-cream',
      doneBody: 'text-cream/60',
      error: 'text-coral',
      note: 'text-cream/60',
    },
    light: {
      done: 'bg-moss/10 ring-moss/25',
      tick: 'bg-moss text-cream',
      doneTitle: 'text-deep',
      doneBody: 'text-deep/60',
      error: 'text-coral',
      note: 'text-deep/55',
    },
  }[tone]

  async function handleSubmit(e) {
    e.preventDefault()
    const value = email.trim()

    // Shape check only. This is the pre-submit convenience layer, not
    // the validation that decides what actually gets stored.
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) {
      setStatus('error')
      setMessage('That does not look like an email address.')
      return
    }

    setStatus('loading')

    try {
      // --- replace this block with your real submission ---------------
      await new Promise((r) => setTimeout(r, 700))
      console.log('[waitlist signup]', value)
      // ----------------------------------------------------------------

      setStatus('done')
      onSuccess?.(value)
    } catch (err) {
      setStatus('error')
      setMessage('Something went wrong on our end. Try again in a moment.')
    }
  }

  /* ------------------------------ success ------------------------------ */
  if (status === 'done') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        className={cn(
          'flex items-center gap-3.5 rounded-2xl p-4 ring-1',
          outside.done,
          className
        )}
        role="status"
        aria-live="polite"
      >
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1, type: 'spring', stiffness: 420, damping: 18 }}
          className={cn(
            'grid size-9 shrink-0 place-items-center rounded-full',
            outside.tick
          )}
        >
          <Check className="size-4" />
        </motion.span>

        <span>
          <span
            className={cn(
              'block text-[0.95rem] font-semibold',
              outside.doneTitle
            )}
          >
            You are on the list
          </span>
          <span
            className={cn('mt-0.5 block text-[0.85rem]', outside.doneBody)}
          >
            We will email {email.trim()} once, when Hush launches.
          </span>
        </span>
      </motion.div>
    )
  }

  /* ------------------------------- form ------------------------------- */
  return (
    <div className={className}>
      <form onSubmit={handleSubmit} noValidate>
        <div
          className={cn(
            'flex flex-col gap-2 rounded-2xl bg-white p-2 ring-1 ring-deep/12 transition-all duration-300 focus-within:ring-moss/45 sm:flex-row sm:items-center',
            status === 'error' && 'ring-coral/60'
          )}
        >
          <label htmlFor={inputId} className="sr-only">
            Email address
          </label>
          <input
            id={inputId}
            type="email"
            inputMode="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              if (status === 'error') {
                setStatus('idle')
                setMessage('')
              }
            }}
            placeholder="you@email.com"
            aria-invalid={status === 'error'}
            aria-describedby={status === 'error' ? errorId : undefined}
            /*
             * The field sits inside a white pill, so it must not rely on
             * the page-level lime focus ring — that is invisible here.
             * An inset ring on the field itself is what a keyboard user
             * actually sees, and it does not move the layout.
             */
            className="min-w-0 flex-1 rounded-lg bg-transparent px-3.5 py-3 text-[0.95rem] text-deep placeholder:text-deep/55 focus-visible:ring-2 focus-visible:ring-moss focus-visible:ring-inset focus-visible:outline-none"
          />

          <button
            type="submit"
            disabled={status === 'loading'}
            className="group/btn flex shrink-0 items-center justify-center gap-2.5 rounded-xl bg-deep px-5 py-3 text-[0.92rem] font-bold text-cream transition-all duration-300 ease-[var(--ease-out-expo)] hover:bg-forest disabled:cursor-wait"
          >
            {status === 'loading' ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                <span>Joining</span>
              </>
            ) : (
              <>
                <span>{buttonLabel}</span>
                <ArrowRight className="size-4 transition-transform duration-300 ease-[var(--ease-out-expo)] group-hover/btn:translate-x-1" />
              </>
            )}
          </button>
        </div>

        <AnimatePresence>
          {status === 'error' && (
            <motion.p
              id={errorId}
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className={cn(
                'mt-2.5 flex items-center gap-1.5 text-[0.82rem] font-medium',
                outside.error
              )}
              role="alert"
            >
              <MailWarning className="size-3.5 shrink-0" />
              {message}
            </motion.p>
          )}
        </AnimatePresence>
      </form>

      <p className={cn('mt-3 text-[0.82rem] leading-relaxed', outside.note)}>
        One email at launch. No drip campaign, no sharing. Unsubscribe
        instantly.
      </p>
    </div>
  )
}