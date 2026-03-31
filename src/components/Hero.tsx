import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Importing assets
import planet1 from '../assets/planent1.png';
import satellite1 from '../assets/satalite1.png';
import astronaut from '../assets/astronaught.png';
import astronaught_fliped from '../assets/astronaught_fliped.png';
import asteroid from '../assets/asteroid.png';

const Hero: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const planetRef = useRef<HTMLImageElement>(null);
  const satelliteRef = useRef<HTMLImageElement>(null);
  const astronautScrollRef = useRef<HTMLDivElement>(null);
  const astronautSecondaryScrollRef = useRef<HTMLDivElement>(null);
  const astronautEntranceRef = useRef<HTMLDivElement>(null);
  const astronautFloatRef = useRef<HTMLDivElement>(null);
  const astronautRef = useRef<HTMLImageElement>(null);
  const astronautFlippedRef = useRef<HTMLImageElement>(null);
  const asteroidRef = useRef<HTMLImageElement>(null);
  const textBgRef = useRef<HTMLHeadingElement>(null);
  const textFrontRef = useRef<HTMLHeadingElement>(null);
  const presentsRef = useRef<HTMLDivElement>(null);

  // 3D Parallax Wrappers
  const parallaxAstronautRef = useRef<HTMLDivElement>(null);
  const parallaxPlanetRef = useRef<HTMLDivElement>(null);
  const parallaxSatelliteRef = useRef<HTMLDivElement>(null);
  const parallaxAsteroidRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let handleMouseMove: (e: MouseEvent) => void;

    const ctx = gsap.context(() => {
      // --- ENTRANCE ANIMATIONS ---
      const tl = gsap.timeline({ delay: 0.2 });

      tl.from(planetRef.current, {
        opacity: 0,
        scale: 0.5,
        y: -100,
        duration: 2.5,
        ease: "power4.out"
      })
        .from(textBgRef.current, {
          opacity: 0,
          y: 100,
          duration: 2,
          ease: "power3.out"
        }, "-=1.5")
        .from(textFrontRef.current, {
          opacity: 0,
          y: 100,
          duration: 2,
          ease: "power3.out"
        }, "-=2")
        .from(astronautEntranceRef.current, {
          opacity: 0,
          scale: 0.8,
          x: -50,
          y: 50,
          duration: 2.5,
          ease: "power4.out"
        }, "-=1.8")
        .from(asteroidRef.current, {
          x: 100,
          y: -50,
          opacity: 0,
          duration: 2,
          ease: "power3.out"
        }, "-=2")
        .from(satelliteRef.current, {
          x: -50,
          y: -50,
          opacity: 0,
          duration: 2,
          ease: "power3.out"
        }, "-=2")
        .from(presentsRef.current, {
          y: -30,
          opacity: 0,
          duration: 2,
          ease: "power3.out"
        }, "-=2");

      // --- FLOATING / IDLE ANIMATIONS ---
      gsap.to(astronautFloatRef.current, {
        y: "+=20",
        x: "+=15",
        rotation: 3,
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });

      gsap.to(planetRef.current, {
        y: "+=15",
        duration: 8,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });

      gsap.to(satelliteRef.current, {
        y: "-=15",
        x: "+=10",
        rotation: "+=5",
        duration: 6,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });

      gsap.to(asteroidRef.current, {
        y: "-=30",
        rotation: -5,
        duration: 10,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });

      // --- SCROLLTRIGGER: Astronaut Parallax (PHASE 1) ---
      // Hero -> About
      gsap.to(astronautScrollRef.current, {
        y: "100vh",
        rotation: -15.75,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 0.5,
        }
      });

      // --- SCROLLTRIGGER: Astronaut Parallax (PHASE 2) ---
      // About -> NextSection (cross-screen movement & image flip)
      const phase2Start = "bottom top"; // Fires exactly when Hero clears screen (entering About)
      const phase2End = "+=80%";        // Ends earlier so it's fully finished before NextSection is blindly locked

      const phase2Tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: phase2Start, 
          end: phase2End,
          scrub: 1,
        }
      });

      // 1. X Movement: Eases out, so it rushes horizontally to the right edge first
      phase2Tl.to(astronautSecondaryScrollRef.current, {
        x: "15vw",  // Considerably reduced from 30vw to keep him entirely inside screen bounds
        rotation: 15.75, // Explicitly keeping exactly 15.75 as you requested natively!
        duration: 1,
        ease: "power2.out"
      }, 0);

      // 2. Y Movement: Eases in, so it drops aggressively downward ONLY at the end (when on the edge)
      phase2Tl.to(astronautSecondaryScrollRef.current, {
        y: "100vh", // Exactly 1 logical viewport height down ensures perfect top matching across sections
        duration: 1,
        ease: "power2.in"
      }, 0);

      // 3. The 3D Flip Swap (ScaleX Illusion)
      // Flatten the wrapper to 0 width over the first half of the scroll
      phase2Tl.to(astronautEntranceRef.current, {
        scaleX: 0,
        duration: 0.5,
        ease: "power1.in"
      }, 0);

      // At exactly 50% scroll (midpoint), the wrapper is paper-thin (invisible).
      // Instantly swap the opacities! This entirely eliminates 'ghosting'.
      phase2Tl.set(astronautRef.current, { opacity: 0 }, 0.5);
      phase2Tl.set(astronautFlippedRef.current, { opacity: 1 }, 0.5);

      // Expand the wrapper back to full width over the second half to reveal the flipped image natively!
      phase2Tl.to(astronautEntranceRef.current, {
        scaleX: 1,
        duration: 0.5,
        ease: "power1.out"
      }, 0.5);

      // --- 3D MOUSE PARALLAX TRACKING (Awwwards 3D effect) ---
      // Utilizing GSAP quickTo for highly efficient decoupled positional translation
      const pAstroX = gsap.quickTo(parallaxAstronautRef.current, "x", { duration: 0.8, ease: "power3" });
      const pAstroY = gsap.quickTo(parallaxAstronautRef.current, "y", { duration: 0.8, ease: "power3" });
      
      const pPlanetX = gsap.quickTo(parallaxPlanetRef.current, "x", { duration: 1.5, ease: "power2" });
      const pPlanetY = gsap.quickTo(parallaxPlanetRef.current, "y", { duration: 1.5, ease: "power2" });
      
      const pSatX = gsap.quickTo(parallaxSatelliteRef.current, "x", { duration: 1.2, ease: "power2" });
      const pSatY = gsap.quickTo(parallaxSatelliteRef.current, "y", { duration: 1.2, ease: "power2" });

      const pAsteroidX = gsap.quickTo(parallaxAsteroidRef.current, "x", { duration: 0.6, ease: "power2" });
      const pAsteroidY = gsap.quickTo(parallaxAsteroidRef.current, "y", { duration: 0.6, ease: "power2" });

      handleMouseMove = (e: MouseEvent) => {
        // Normalize screen coordinates into a -1 to 1 graph mathematically
        const xNorm = (e.clientX / window.innerWidth - 0.5) * 2; 
        const yNorm = (e.clientY / window.innerHeight - 0.5) * 2; 

        // Astronaut (Foreground) shifts aggressively WITH mouse
        pAstroX(xNorm * 50);
        pAstroY(yNorm * 50);

        // Planet (Far Background) shifts slowly AGAINST mouse
        pPlanetX(xNorm * -40);
        pPlanetY(yNorm * -40);

        // Satellite (Mid Background) shifts mildly AGAINST mouse
        pSatX(xNorm * -20);
        pSatY(yNorm * -20);

        // Asteroid (Near Foreground) shifts rapidly WITH mouse
        pAsteroidX(xNorm * 30);
        pAsteroidY(yNorm * 30);
      };

      window.addEventListener('mousemove', handleMouseMove);

    }, containerRef);

    return () => {
      ctx.revert();
      if (handleMouseMove) window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative w-full h-screen bg-transparent flex items-center justify-center select-none"
    >
      {/* Top Center Branding - z-10 */}
      <div
        ref={presentsRef}
        className="absolute top-[18vh] md:top-[20vh] left-1/2 -translate-x-1/2 flex flex-col items-center justify-center z-10 w-full px-4 text-center pointer-events-none"
      >
        <p className="font-semibold text-sm md:text-base lg:text-lg tracking-[0.2em] md:tracking-[0.3em] text-white uppercase mb-2" style={{ fontFamily: '"SF Pro Rounded", ui-rounded, system-ui, sans-serif' }}>
          AIS X Astronomy
        </p>
        <p className="font-light text-xs md:text-sm tracking-[0.4em] md:tracking-[0.6em] text-white/50 uppercase" style={{ fontFamily: '"SF Pro Rounded", ui-rounded, system-ui, sans-serif' }}>
          presents
        </p>
      </div>

      {/* Planet 1 - Top Left - z-10 */}
      <div 
        ref={parallaxPlanetRef}
        className="absolute top-[-5vh] md:top-[-10vh] left-[-15vw] md:left-[-10vw] w-[50vw] md:w-[35vw] lg:w-[30vw] max-w-[600px] z-10 pointer-events-none"
      >
        <img
          ref={planetRef}
          src={planet1}
          alt="Planet"
          className="w-full h-full block drop-shadow-[0_0_50px_rgba(255,100,0,0.2)]"
        />
      </div>

      {/* Satellite - Top Right - z-10 */}
      <div
        ref={parallaxSatelliteRef}
        className="absolute top-[5vh] md:top-[10vh] right-[2vw] md:right-[5vw] w-[40vw] md:w-[26vw] lg:w-[22vw] max-w-[350px] z-10 pointer-events-none"
      >
        <img
          ref={satelliteRef}
          src={satellite1}
          alt="Satellite"
          className="w-full h-full block rotate-[-25deg] drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]"
        />
      </div>

      {/* --- LAYER 1: SOLID TEXT (z-20) --- */}
      <h1
        ref={textBgRef}
        className="absolute top-[50vh] md:top-[60vh] left-1/2 -translate-x-1/2 -translate-y-1/2 w-full font-black text-[clamp(2.5rem,10vw,10rem)] tracking-widest text-white leading-none text-center z-20 pointer-events-none"
        style={{
          fontFamily: '"SF Pro Rounded", ui-rounded, system-ui, sans-serif',
          textShadow: '0 5px 15px rgba(0,0,0,0.8)'
        }}
      >
        HACKASTRAL
      </h1>

      {/* --- LAYER 2: OBJECTS (z-30) --- */}
      {/* Astronaut: Nested wrappers to isolate GSAP timeline conflicts across 3 layout phases */}
      <div
        ref={astronautScrollRef}
        className="absolute top-[5vh] md:top-[8vh] lg:top-[10vh] left-[-10vw] md:left-[2vw] lg:left-[5vw] xl:left-[8vw] w-[95vw] md:w-[65vw] lg:w-[55vw] xl:w-[48vw] max-w-[1000px] z-30 pointer-events-none filter drop-shadow-[10px_10px_30px_rgba(0,0,0,0.6)]"
      >
        <div ref={parallaxAstronautRef} className="relative w-full h-full">
          <div ref={astronautSecondaryScrollRef} className="relative w-full h-full">
            <div ref={astronautEntranceRef} className="relative w-full h-auto">
              <div ref={astronautFloatRef} className="relative w-full h-auto">
                <img
                  ref={astronautRef}
                  src={astronaut}
                  alt="Astronaut"
                  className="w-full h-auto block"
                />
                <img
                  ref={astronautFlippedRef}
                  src={astronaught_fliped}
                  alt="Astronaut Flipped"
                  className="absolute top-0 left-0 w-full h-full object-cover opacity-0"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Asteroid: Positioned using simple, fixed px and vw without any translate math */}
      <div 
        ref={parallaxAsteroidRef}
        className="absolute bottom-[10vh] md:bottom-[15vh] lg:bottom-[18vh] right-[2vw] md:right-[5vw] lg:right-[8vw] xl:right-[10vw] w-[45vw] md:w-[32vw] lg:w-[25vw] xl:w-[22vw] max-w-[450px] z-30 pointer-events-none"
      >
        <img
          ref={asteroidRef}
          src={asteroid}
          alt="Asteroid"
          className="w-full h-full block drop-shadow-[0_0_30px_rgba(255,255,255,0.05)]"
        />
      </div>

      {/* --- LAYER 3: STROKE TEXT / MASK (z-40) --- */}
      {/* This perfectly overlays LAYER 1 and masks everything in LAYER 2! */}
      <h1
        ref={textFrontRef}
        className="absolute top-[50vh] md:top-[60vh] left-1/2 -translate-x-1/2 -translate-y-1/2 w-full font-black text-[clamp(2.5rem,10vw,10rem)] tracking-widest text-transparent leading-none text-center z-40 pointer-events-none"
        style={{
          fontFamily: '"SF Pro Rounded", ui-rounded, system-ui, sans-serif',
          WebkitTextStroke: '2px white'
        }}
      >
        HACKASTRAL
      </h1>

    </section>
  );
};

export default Hero;
