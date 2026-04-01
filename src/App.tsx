import { useEffect } from 'react'
import Hero from './components/Hero'
import About from './components/About'
import Tracks from './components/Tracks'
import MissionLog from './components/MissionLog';
import Team from './components/Team';
import Footer from './components/Footer';
import SpaceDebrisSpacer from './components/SpaceDebrisSpacer'
import StarsBackground from './components/StarsBackground'
import ScrollAstronaut from './components/ScrollAstronaut'
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
    <main className="relative w-full min-h-screen bg-black text-white">
      {/* Global Background Ambience & Moving Stars */}
      <StarsBackground />

      {/* Fixed-position astronaut hoisted to DOM ROOT for absolute visibility */}
      <ScrollAstronaut />

      <div className="flex flex-col w-full">
        <Hero />
        <SpaceDebrisSpacer />
        <About />
        <Tracks />
        <MissionLog />
        <Team />
        <Footer />
      </div>
    </main>
  );
}

export default App
