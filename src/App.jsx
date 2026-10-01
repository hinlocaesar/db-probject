import { Nav } from './components/Nav'
import { Hero } from './components/Hero'
import { Waitlist } from './components/Waitlist'
import { Manifesto } from './components/Manifesto'
import { WhyUs } from './components/WhyUs'
import { WhyHush } from './components/WhyHush'
import { Platforms } from './components/Platforms'
import { Pricing } from './components/Pricing'
import { Devices } from './components/Devices'
import { HowItWorks } from './components/HowItWorks'
import { Features } from './components/Features'
import { Faq } from './components/Faq'
import { FinalCta } from './components/FinalCta'
import { Footer } from './components/Footer'
import { useSmoothScroll } from './hooks/useSmoothScroll'

export default function App() {
  useSmoothScroll()

  return (
    <>
      {/*
        Keyboard users land here on page load and should be able to reach the
        content without tabbing through every nav link. Hidden until focused,
        then it sits above the fixed header.
      */}
      <a
        href="#main"
        className="sr-only rounded-full bg-lime text-[0.9rem] font-bold text-deep focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-5 focus:py-3"
      >
        Skip to content
      </a>

      <Nav />
      <main id="main">
        <Hero />
        <Waitlist />
        <Manifesto />
        <WhyUs />
        <WhyHush />
        <Platforms />
        <Pricing />
        <Devices />
        <HowItWorks />
        <Features />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
    </>
  )
}
