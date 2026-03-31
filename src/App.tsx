import { useEffect } from 'react'
import Hero from './components/Hero'
import About from './components/About'
import NextSection from './components/NextSection'
import Footer from './components/Footer'
import StarsBackground from './components/StarsBackground'
import Lenis from '@studio-freight/lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './App.css'

gsap.registerPlugin(ScrollTrigger);

function App() {
  // Global Smooth Scroll Physics Engine
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.4, // Luxuriously slow cinematic drag
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), 
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      touchMultiplier: 2,
    })

    // Tie Lenis scroll engine securely to GSAP ScrollTrigger computations
    lenis.on('scroll', ScrollTrigger.update)

    const gsTick = (time: number) => {
      lenis.raf(time * 1000)
    };

    gsap.ticker.add(gsTick)

    // Eliminates micro-stutters during heavy computational frames
    gsap.ticker.lagSmoothing(0)

    return () => {
      lenis.destroy()
      gsap.ticker.remove(gsTick)
    }
  }, [])

  return (
    <main className="relative w-full min-h-screen bg-black text-white w-screen overflow-x-hidden">
      {/* Global Background Ambience & Moving Stars */}
      <StarsBackground />

      <div className="relative z-10 flex flex-col w-full h-full">
        <Hero />
        <About />
        <NextSection />
        <Footer />
      </div>
    </main>
  )
}

export default App
