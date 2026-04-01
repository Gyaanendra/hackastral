import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

import planet1 from '../assets/planent1.png';
import frag1 from '../assets/rockets_satalites/Damaged rocket engine fragment.png';
import asteroid from '../assets/asteroid.png';

const Hero: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const planetRef = useRef<HTMLImageElement>(null);
  const satelliteRef = useRef<HTMLImageElement>(null);
  const asteroidRef = useRef<HTMLImageElement>(null);
  const textBgRef = useRef<HTMLHeadingElement>(null);
  const textFrontRef = useRef<HTMLHeadingElement>(null);
  const presentsRef = useRef<HTMLDivElement>(null);

  // Parallax Wrappers
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

      // --- SCROLL-DRIVEN PARALLAX ---
      gsap.to(parallaxPlanetRef.current, {
        y: 150,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1
        }
      });

      gsap.to(parallaxSatelliteRef.current, {
        y: 250,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1
        }
      });

      // Asteroid parallax disabled per user request
      /*
      gsap.to(parallaxAsteroidRef.current, {
        y: 450,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1
        }
      });
      */

      gsap.to([textBgRef.current, textFrontRef.current], {
        y: 200,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1
        }
      });

      gsap.to(presentsRef.current, {
        y: 120,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1
        }
      });

      // --- MOUSE PARALLAX ---
      const pPlanetX = gsap.quickTo(parallaxPlanetRef.current, "x", { duration: 1.5, ease: "power2" });
      const pPlanetY = gsap.quickTo(parallaxPlanetRef.current, "y", { duration: 1.5, ease: "power2" });
      const pSatX = gsap.quickTo(parallaxSatelliteRef.current, "x", { duration: 1.2, ease: "power2" });
      const pSatY = gsap.quickTo(parallaxSatelliteRef.current, "y", { duration: 1.2, ease: "power2" });
      const pAsteroidX = gsap.quickTo(parallaxAsteroidRef.current, "x", { duration: 0.6, ease: "power2" });
      const pAsteroidY = gsap.quickTo(parallaxAsteroidRef.current, "y", { duration: 0.6, ease: "power2" });

      handleMouseMove = (e: MouseEvent) => {
        const xNorm = (e.clientX / window.innerWidth - 0.5) * 2;
        const yNorm = (e.clientY / window.innerHeight - 0.5) * 2;

        pPlanetX(xNorm * -40);
        pPlanetY(yNorm * -40);
        pSatX(xNorm * -20);
        pSatY(yNorm * -20);
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
      id="hero-section"
      ref={containerRef}
      className="relative w-full h-screen bg-transparent flex items-center justify-center select-none"
    >
      {/* Top Center Branding */}
      <div
        ref={presentsRef}
        className="absolute top-[18vh] md:top-[20vh] left-1/2 -translate-x-1/2 flex flex-col items-center justify-center z-10 w-full px-4 text-center pointer-events-none"
      >
        <p className="font-semibold text-xs md:text-base lg:text-lg tracking-[0.2em] md:tracking-[0.3em] text-white uppercase mb-1 md:mb-2" style={{ fontFamily: '"SF Pro Rounded", ui-rounded, system-ui, sans-serif' }}>
          AIS X Astronomy
        </p>
        <p className="font-light text-[10px] md:text-sm tracking-[0.3em] md:tracking-[0.6em] text-white/50 uppercase" style={{ fontFamily: '"SF Pro Rounded", ui-rounded, system-ui, sans-serif' }}>
          presents
        </p>
      </div>

      {/* Planet 1 - Top Left */}
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

      {/* Drifting Rocket Engine - Replacing old satellite */}
      <div
        ref={parallaxSatelliteRef}
        className="absolute top-[5vh] md:top-[10vh] right-[2vw] md:right-[5vw] w-[40vw] md:w-[26vw] lg:w-[22vw] max-w-[350px] z-10 pointer-events-none"
      >
        <img
          ref={satelliteRef}
          src={frag1}
          alt="Space Debris"
          className="w-full h-full block rotate-[-25deg] drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]"
        />
      </div>

      {/* SOLID TEXT (z-20) */}
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

      {/* Asteroid */}
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

      {/* STROKE TEXT OVERLAY (z-40) */}
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
