import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { MotionConfig } from 'framer-motion'
import App from './App.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/*
      reducedMotion="user" makes every reveal on the page honour the OS
      setting in one place: transforms, scaling and layout animation are
      dropped, opacity is kept. Without it, visitors who ask their system to
      reduce motion still get every section sliding in from 40px off to the
      side, because `whileInView` sets the initial transform regardless of
      what the media query in index.css does to the transition.

      Setting it per-component would mean touching all 57 call sites and
      staying correct as sections get added.
    */}
    <MotionConfig reducedMotion="user">
      <App />
    </MotionConfig>
  </StrictMode>
)
