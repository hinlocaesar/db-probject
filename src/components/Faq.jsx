import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import { Container, Section, SectionIntro } from './ui/Section'
import { faqs } from '../data/faq'
import { cn } from '../lib/utils'

function Item({ item, index, open, onToggle }) {
  return (
    <div
      className={cn(
        'overflow-hidden rounded-3xl transition-colors duration-500',
        open ? 'bg-lime/8 ring-1 ring-lime/30' : 'bg-cream/4 ring-1 ring-cream/10 hover:bg-cream/7'
      )}
    >
      <h3>
        <button
          onClick={onToggle}
          aria-expanded={open}
          aria-controls={`faq-panel-${index}`}
          className="flex w-full items-center gap-5 px-6 py-6 text-left sm:px-8"
        >
          <span
            className={cn(
              'font-mono text-eyebrow transition-colors duration-300',
              open ? 'text-lime' : 'text-cream/30'
            )}
          >
            {String(index + 1).padStart(2, '0')}
          </span>

          <span
            className={cn(
              'flex-1 font-serif text-[1.15rem] leading-snug transition-colors duration-300 sm:text-[1.32rem]',
              open ? 'text-lime' : 'text-cream/85'
            )}
          >
            {item.q}
          </span>

          <motion.span
            animate={{ rotate: open ? 135 : 0 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className={cn(
              'grid size-9 shrink-0 place-items-center rounded-full transition-colors duration-300',
              open ? 'bg-lime text-deep' : 'bg-cream/8 text-cream/60'
            )}
          >
            <Plus className="size-4" />
          </motion.span>
        </button>
      </h3>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={`faq-panel-${index}`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-7 pl-14 sm:px-8 sm:pb-8 sm:pl-17">
              <p className="text-[1rem] leading-relaxed text-cream/65">
                {item.a}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export function Faq() {
  const [openIndex, setOpenIndex] = useState(0)

  return (
    <Section id="faq" tone="forest" className="overflow-hidden">
      <Container>
        <SectionIntro kicker="FAQ">
          <span>Questions, </span>
          <span className="text-gradient-lime italic">answered.</span>
        </SectionIntro>

        <div className="mt-14 space-y-3">
          {faqs.map((item, i) => (
            <motion.div
              key={item.q}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
            >
              <Item
                item={item}
                index={i}
                open={openIndex === i}
                onToggle={() => setOpenIndex(openIndex === i ? -1 : i)}
              />
            </motion.div>
          ))}
        </div>
      </Container>
    </Section>
  )
}
