import { motion } from 'framer-motion'
import { Lock, Play, Plus, Check, Moon, Coffee, Waves, Trees, Music } from 'lucide-react'
import { cn } from '../../lib/utils'

/* ------------------------------------------------------------------ *
 * Shared chrome: status bar + screen container
 * ------------------------------------------------------------------ */

function StatusBar({ time = '9:41' }) {
  return (
    <div className="flex items-center justify-between px-5 pt-3.5 pb-1 text-[0.6rem] font-semibold text-cream/55">
      <span>{time}</span>
      <span className="flex items-center gap-1">
        <svg viewBox="0 0 16 10" className="h-2 w-3 fill-current">
          <rect x="0" y="7" width="3" height="3" rx="1" />
          <rect x="4.3" y="5" width="3" height="5" rx="1" />
          <rect x="8.6" y="2.6" width="3" height="7.4" rx="1" />
          <rect x="12.9" y="0" width="3" height="10" rx="1" />
        </svg>
        <svg viewBox="0 0 24 10" className="h-2 w-4 fill-none stroke-current stroke-[1.4]">
          <rect x="0.6" y="0.6" width="19" height="8.8" rx="2.6" />
          <rect x="2.2" y="2.2" width="13" height="5.6" rx="1.4" fill="currentColor" stroke="none" />
          <path d="M21.5 3.4v3.2" strokeLinecap="round" />
        </svg>
      </span>
    </div>
  )
}

/* ------------------------------------------------------------------ *
 * 1. Block screen — app list with toggles
 * ------------------------------------------------------------------ */

const blockedApps = [
  { name: 'Instagram', c: 'from-pink-500 to-orange-400', on: true },
  { name: 'TikTok', c: 'from-cyan-400 to-fuchsia-500', on: true },
  { name: 'YouTube', c: 'from-red-500 to-red-700', on: true },
  { name: 'News', c: 'from-slate-400 to-slate-600', on: false },
]

function ScreenBlock() {
  return (
    <div className="space-y-2.5 px-4 pb-5">
      <div className="flex items-center justify-between rounded-2xl bg-lime p-3.5 text-deep">
        <div>
          <div className="text-[0.6rem] font-semibold tracking-[0.16em] uppercase opacity-70">
            Session active
          </div>
          <div className="mt-0.5 text-[0.95rem] font-bold">1h 24m left</div>
        </div>
        <div className="grid size-9 place-items-center rounded-full bg-deep text-lime">
          <Lock className="size-4" />
        </div>
      </div>

      <div className="flex items-center justify-between px-1 pt-1">
        <span className="text-[0.6rem] font-semibold tracking-[0.16em] uppercase text-cream/40">
          Blocked apps
        </span>
        <span className="flex items-center gap-1 text-[0.6rem] font-semibold text-lime/70">
          <Plus className="size-2.5" /> add
        </span>
      </div>

      {blockedApps.map((a, i) => (
        <motion.div
          key={a.name}
          initial={{ opacity: 0, x: -14 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 + i * 0.08, duration: 0.5 }}
          className="flex items-center gap-3 rounded-2xl bg-cream/6 p-2.5 ring-1 ring-cream/8"
        >
          <span
            className={cn('grid size-8 shrink-0 place-items-center rounded-xl bg-linear-to-br text-[0.6rem] font-bold text-white', a.c)}
          >
            {a.name[0]}
          </span>
          <span className="flex-1 text-[0.78rem] font-medium text-cream/85">
            {a.name}
          </span>
          <span
            className={cn(
              'relative h-5 w-9 rounded-full transition-colors',
              a.on ? 'bg-lime' : 'bg-cream/15'
            )}
          >
            <motion.span
              layout
              transition={{ type: 'spring', stiffness: 500, damping: 34 }}
              className={cn(
                'absolute top-0.5 size-4 rounded-full bg-deep',
                a.on ? 'left-4.5' : 'left-0.5'
              )}
            />
          </span>
        </motion.div>
      ))}

      <div className="mt-1 flex items-center justify-between rounded-2xl bg-coral/15 p-3 ring-1 ring-coral/25">
        <span className="text-[0.75rem] font-semibold text-coral">
          Block everything
        </span>
        <span className="relative h-5 w-9 rounded-full bg-coral">
          <span className="absolute top-0.5 left-4.5 size-4 rounded-full bg-cream" />
        </span>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ *
 * 2. Schedule screen — weekly grid
 * ------------------------------------------------------------------ */

const week = [
  { d: 'M', from: 0, to: 3 },
  { d: 'T', from: 0, to: 2 },
  { d: 'W', from: 1, to: 4 },
  { d: 'T', from: 0, to: 3 },
  { d: 'F', from: 0, to: 2 },
  { d: 'S', from: 2, to: 3 },
  { d: 'S', from: 2, to: 4 },
]

function ScreenSchedule() {
  return (
    <div className="px-4 pb-5">
      <div className="rounded-2xl bg-cream/6 p-3.5 ring-1 ring-cream/8">
        <div className="text-[0.6rem] font-semibold tracking-[0.16em] uppercase text-cream/40">
          Deep work · recurring
        </div>
        <div className="mt-1 flex items-baseline gap-1.5">
          <span className="text-[1.1rem] font-bold text-cream">9:00</span>
          <span className="text-[0.7rem] text-cream/45">→</span>
          <span className="text-[1.1rem] font-bold text-lime">11:30</span>
          <span className="ml-auto text-[0.65rem] text-cream/40">weekdays</span>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-7 gap-1.5">
        {week.map((d, i) => (
          <div key={i} className="flex flex-col items-center gap-1.5">
            <span className="text-[0.6rem] font-medium text-cream/40">{d.d}</span>
            <div className="relative h-28 w-full overflow-hidden rounded-lg bg-cream/6 ring-1 ring-cream/8">
              {[0, 1, 2, 3].map((row) => (
                <div
                  key={row}
                  className="absolute inset-x-0 border-t border-cream/6"
                  style={{ top: `${(row / 4) * 100}%` }}
                />
              ))}
              <motion.div
                initial={{ scaleY: 0 }}
                whileInView={{ scaleY: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.15 + i * 0.06, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-x-0.5 origin-top rounded-[4px] bg-linear-to-b from-lime to-lime/55"
                style={{
                  top: `${(d.from / 4) * 100}%`,
                  height: `${((d.to - d.from) / 4) * 100}%`,
                }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-3 space-y-2">
        {[
          { t: 'Evening wind-down', v: '9:30 PM', on: true, c: 'bg-lilac' },
          { t: 'Sunday reset', v: '11:00 AM', on: false, c: 'bg-sky' },
        ].map((s, i) => (
          <motion.div
            key={s.t}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 + i * 0.1, duration: 0.5 }}
            className="flex items-center gap-2.5 rounded-2xl bg-cream/6 p-2.5 ring-1 ring-cream/8"
          >
            <span className={cn('size-1.5 shrink-0 rounded-full', s.c)} />
            <span className="flex-1 text-[0.75rem] font-medium text-cream/85">
              {s.t}
            </span>
            <span className="font-mono text-[0.62rem] text-cream/45">{s.v}</span>
            <span
              className={cn(
                'relative h-4 w-7 rounded-full',
                s.on ? 'bg-lime' : 'bg-cream/15'
              )}
            >
              <span
                className={cn(
                  'absolute top-0.5 size-3 rounded-full bg-deep',
                  s.on ? 'left-3.5' : 'left-0.5'
                )}
              />
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ *
 * 3. Locked mode — hero timer ring
 * ------------------------------------------------------------------ */

function ScreenLocked() {
  return (
    <div className="flex flex-col items-center px-4 pt-3 pb-5">
      <span className="flex items-center gap-1.5 rounded-full bg-coral/15 px-2.5 py-1 text-[0.58rem] font-bold tracking-[0.14em] uppercase text-coral ring-1 ring-coral/25">
        <Lock className="size-2.5" /> Locked mode on
      </span>

      <div className="relative my-5 grid size-40 place-items-center">
        {/* track + progress ring */}
        <svg viewBox="0 0 100 100" className="absolute inset-0 -rotate-90">
          <circle
            cx="50" cy="50" r="45"
            fill="none" stroke="currentColor"
            strokeWidth="4" className="text-cream/10"
          />
          <motion.circle
            cx="50" cy="50" r="45"
            fill="none" stroke="currentColor" strokeWidth="4"
            strokeLinecap="round" className="text-lime"
            strokeDasharray={2 * Math.PI * 45}
            initial={{ strokeDashoffset: 2 * Math.PI * 45 }}
            whileInView={{ strokeDashoffset: 2 * Math.PI * 45 * 0.62 }}
            viewport={{ once: true }}
            transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          />
        </svg>
        {/* soft glow behind the ring */}
        <div className="absolute inset-6 rounded-full bg-lime/12 blur-xl" />
        <div className="relative text-center">
          <div className="font-mono text-[2.1rem] leading-none font-medium text-cream tabular-nums">
            1:24
          </div>
          <div className="mt-1 text-[0.6rem] tracking-[0.16em] uppercase text-cream/40">
            remaining
          </div>
        </div>
      </div>

      <div className="w-full space-y-2">
        {[
          { label: 'End session early', hint: 'Locked until 11:30', disabled: true },
          { label: 'Edit blocklist', hint: 'Locked', disabled: true },
          { label: 'Take a 5 min break', hint: 'Once, 1 left', disabled: false },
        ].map((r, i) => (
          <motion.div
            key={r.label}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 + i * 0.1, duration: 0.5 }}
            className={cn(
              'flex items-center gap-2.5 rounded-2xl p-3 ring-1',
              r.disabled
                ? 'bg-cream/4 ring-cream/6 opacity-55'
                : 'bg-cream/8 ring-lime/25'
            )}
          >
            <span
              className={cn(
                'grid size-6 shrink-0 place-items-center rounded-full',
                r.disabled ? 'bg-cream/10' : 'bg-lime/20'
              )}
            >
              {r.disabled ? (
                <Lock className="size-2.5 text-cream/50" />
              ) : (
                <Check className="size-3 text-lime" />
              )}
            </span>
            <span className="flex-1 text-[0.75rem] font-medium text-cream/80">
              {r.label}
            </span>
            <span className="text-[0.6rem] text-cream/40">{r.hint}</span>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ *
 * 4. Blocklists
 * ------------------------------------------------------------------ */

const lists = [
  { name: 'Deep work', n: 24, c: 'bg-lime', active: true },
  { name: 'Evening', n: 11, c: 'bg-lilac', active: false },
  { name: 'Weekend', n: 6, c: 'bg-sky', active: false },
  { name: 'Read again', n: 9, c: 'bg-coral', active: false },
]

function ScreenLists() {
  return (
    <div className="px-4 pb-5">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-[0.6rem] font-semibold tracking-[0.16em] uppercase text-cream/40">
          Your blocklists
        </span>
        <span className="grid size-6 place-items-center rounded-full bg-lime text-deep">
          <Plus className="size-3" />
        </span>
      </div>

      <div className="space-y-2.5">
        {lists.map((l, i) => (
          <motion.div
            key={l.name}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 + i * 0.09, duration: 0.55 }}
            whileHover={{ x: 4 }}
            className={cn(
              'flex items-center gap-3 rounded-2xl p-3.5 ring-1 transition-colors',
              l.active
                ? 'bg-lime/12 ring-lime/35'
                : 'bg-cream/6 ring-cream/8'
            )}
          >
            <span className={cn('size-2.5 shrink-0 rounded-full', l.c)} />
            <span className="flex-1">
              <span className="block text-[0.82rem] font-semibold text-cream/90">
                {l.name}
              </span>
              <span className="mt-0.5 block text-[0.62rem] text-cream/40">
                {l.n} apps &amp; sites
              </span>
            </span>
            {l.active && (
              <span className="rounded-full bg-lime px-2 py-0.5 text-[0.55rem] font-bold tracking-wide text-deep uppercase">
                Active
              </span>
            )}
          </motion.div>
        ))}
      </div>

      <div className="mt-3 rounded-2xl bg-cream/6 p-3.5 ring-1 ring-cream/8">
        <div className="text-[0.6rem] font-semibold tracking-[0.16em] uppercase text-cream/40">
          Block everything except
        </div>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {['Docs', 'Gmail', 'MDN', 'Linear'].map((x) => (
            <span
              key={x}
              className="rounded-full bg-cream/8 px-2.5 py-1 text-[0.62rem] font-medium text-cream/70 ring-1 ring-cream/10"
            >
              {x}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ *
 * 5. Focus sound
 * ------------------------------------------------------------------ */

const sounds = [
  { name: 'Café', icon: Coffee, c: 'bg-amber' },
  { name: 'Rain', icon: Waves, c: 'bg-sky' },
  { name: 'Forest', icon: Trees, c: 'bg-fern' },
  { name: 'Brown noise', icon: Moon, c: 'bg-lilac' },
  { name: 'Deep focus', icon: Music, c: 'bg-lime' },
  { name: 'Library', icon: Check, c: 'bg-coral' },
]

const bars = [8, 16, 26, 14, 30, 20, 10, 24, 18, 28, 12, 22]

function ScreenSound() {
  return (
    <div className="px-4 pb-5">
      <div className="mb-3.5 flex items-end justify-between rounded-2xl bg-linear-to-b from-sky/25 to-sky/5 p-3.5 ring-1 ring-sky/20">
        <div>
          <div className="text-[0.58rem] font-semibold tracking-[0.16em] uppercase text-sky/70">
            Now playing
          </div>
          <div className="mt-0.5 text-[0.95rem] font-bold text-cream">
            Café, late afternoon
          </div>
        </div>
        <div className="grid size-9 place-items-center rounded-full bg-lime text-deep shadow-[0_0_20px_-4px] shadow-lime/70">
          <Play className="size-4 fill-current" />
        </div>
      </div>

      {/* live-looking waveform */}
      <div className="mb-4 flex h-11 items-end justify-between gap-[3px] px-1">
        {bars.map((h, i) => (
          <motion.span
            key={i}
            className="w-full rounded-full bg-linear-to-t from-sky/50 to-sky"
            initial={{ height: 3 }}
            whileInView={{ height: h }}
            viewport={{ once: true }}
            transition={{
              delay: 0.1 + i * 0.04,
              duration: 0.5,
              ease: [0.16, 1, 0.3, 1],
            }}
            style={{ opacity: 0.55 + (h / 30) * 0.45 }}
          />
        ))}
      </div>

      <div className="grid grid-cols-2 gap-2">
        {sounds.map((s, i) => (
          <motion.div
            key={s.name}
            initial={{ opacity: 0, scale: 0.94 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 + i * 0.05, duration: 0.45 }}
            whileHover={{ y: -3 }}
            className={cn(
              'flex items-center gap-2 rounded-xl p-2.5 ring-1',
              s.name === 'Café, late afternoon' || s.name === 'Café'
                ? 'bg-sky/15 ring-sky/30'
                : 'bg-cream/6 ring-cream/8'
            )}
          >
            <span
              className={cn(
                'grid size-6 shrink-0 place-items-center rounded-lg bg-deep/60'
              )}
            >
              <s.icon className={cn('size-3', s.c.replace('bg-', 'text-'))} />
            </span>
            <span className="truncate text-[0.68rem] font-medium text-cream/80">
              {s.name}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ *
 * Phone frame
 * ------------------------------------------------------------------ */

const screens = {
  block: ScreenBlock,
  schedule: ScreenSchedule,
  locked: ScreenLocked,
  lists: ScreenLists,
  sound: ScreenSound,
}

const screenTones = {
  block: 'from-ink to-forest',
  schedule: 'from-forest to-moss',
  locked: 'from-deep to-ink',
  lists: 'from-moss to-forest',
  sound: 'from-ink to-moss',
}

export function PhoneMock({
  screen = 'block',
  className,
  glow = true,
  float = true,
}) {
  const Screen = screens[screen] ?? screens.block

  return (
    // `data-mock` marks this subtree as a scaled rendering of app UI rather
    // than page copy. The audit script uses it to stop reporting the phone's
    // 8-10px labels as unreadable body text.
    <div
      data-mock="app-screen"
      aria-hidden="true"
      className={cn('relative', float && 'animate-float', className)}
    >
      {glow && (
        <>
          <div className="absolute -inset-8 rounded-[3rem] bg-lime/18 blur-3xl" />
          <div className="absolute -inset-2 rounded-[2.5rem] bg-lime/8 blur-xl" />
        </>
      )}

      <div className="relative w-[250px] rounded-[2.6rem] bg-gradient-to-b from-cream/22 to-cream/8 p-[3px] shadow-[0_40px_90px_-30px_rgba(0,0,0,0.9)] backdrop-blur-sm sm:w-[270px]">
        <div
          className={cn(
            'relative overflow-hidden rounded-[2.5rem] bg-linear-to-b',
            screenTones[screen]
          )}
        >
          {/* notch */}
          <div className="absolute top-2.5 left-1/2 z-10 h-5 w-20 -translate-x-1/2 rounded-full bg-ink/85" />

          <StatusBar />

          {/* screen title bar */}
          <div className="flex items-center justify-between px-4 py-2.5">
            <span className="font-serif text-[0.95rem] text-cream">Hush</span>
            <span className="flex items-center gap-1 rounded-full bg-lime/15 px-2 py-0.5 text-[0.55rem] font-bold text-lime ring-1 ring-lime/25">
              <span className="size-1 rounded-full bg-lime" />
              Live
            </span>
          </div>

          <Screen />
        </div>
      </div>
    </div>
  )
}
