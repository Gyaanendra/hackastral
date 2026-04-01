import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import astronautImg from '../assets/astronaught.png';
import astronautFlippedImg from '../assets/astronaught_fliped.png';

gsap.registerPlugin(ScrollTrigger);

const ScrollAstronaut: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const parallaxRef = useRef<HTMLDivElement>(null);
  const floatRef = useRef<HTMLDivElement>(null);
  const normalRef = useRef<HTMLImageElement>(null);
  const flippedRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const parallaxEl = parallaxRef.current;
    const floatEl = floatRef.current;
    const normalEl = normalRef.current;
    const flippedEl = flippedRef.current;
    if (!container || !parallaxEl || !floatEl || !normalEl || !flippedEl) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add({
        isDesktop: "(min-width: 768px)",
        isMobile: "(max-width: 767px)"
      }, (context) => {
        const { isDesktop } = context.conditions as { isDesktop: boolean };

        // --- INITIAL STATE (ALWAYS SOLID) ---
        gsap.set(container, {
          x: isDesktop ? '8vw' : '-5vw',
          y: isDesktop ? '10vh' : '25vh',
          scale: 1,
          rotation: -15.75,
          opacity: 0, // Starts invisible for cinematic entrance
          visibility: 'visible',
          transformOrigin: 'center center',
          force3D: true,
        });

        // --- ENTRANCE FADE-IN ---
        gsap.to(container, {
          opacity: 1,
          duration: 1.5,
          delay: 0.5,
          ease: 'power2.out',
          overwrite: 'auto'
        });

        gsap.set(normalEl, { opacity: 1 });
        gsap.set(flippedEl, { opacity: 0 });

        // --- FLOATING IDLE ANIMATION ---
        const floatAnim = gsap.to(floatEl, {
          y: 20,
          x: 10,
          rotation: 2,
          duration: 4,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        });

        // Manage Mouse Parallax Baseline
        const pX = gsap.quickTo(parallaxEl, "x", { duration: 0.8, ease: "power3" });
        const pY = gsap.quickTo(parallaxEl, "y", { duration: 0.8, ease: "power3" });

        const handleMouseMove = (e: MouseEvent) => {
          const xNorm = (e.clientX / window.innerWidth - 0.5) * 2;
          const yNorm = (e.clientY / window.innerHeight - 0.5) * 2;
          pX(xNorm * 40);
          pY(yNorm * 40);
        };
        window.addEventListener('mousemove', handleMouseMove);

        // =============================================================
        // PHASE 1: Hero scroll → astronaut "falls"
        // =============================================================
        gsap.fromTo(container,
          {
            x: isDesktop ? '8vw' : '-5vw',
            y: isDesktop ? '10vh' : '25vh',
            scale: 1,
            rotation: -15.75,
          },
          {
            y: isDesktop ? '26vh' : '22vh',
            rotation: -16.75,
            scale: isDesktop ? 1 : 0.6,
            ease: 'none',
            overwrite: 'auto',
            immediateRender: true,
            scrollTrigger: {
              trigger: '#hero-section',
              start: 'top top',
              end: 'bottom top',
              scrub: 1, // Smoothing adds a buffer for hard stops
              fastScrollEnd: true,
              invalidateOnRefresh: true,
              onRefresh: (self) => {
                if (self.progress === 0 && !gsap.isTweening(container)) {
                  gsap.set(container, { visibility: 'visible' });
                }
              }
            },
          }
        );

        // --- VISIBILITY STATE GUARD ---
        ScrollTrigger.create({
          trigger: '#hero-section',
          start: 'top top',
          end: '5% top',
          onEnterBack: () => {
            gsap.set(container, { visibility: 'visible' });
            floatAnim.play();
          },
          onLeave: () => {
            floatAnim.pause();
            gsap.to(floatEl, { y: 0, x: 0, rotation: 0, duration: 0.5 });
          },
          onLeaveBack: () => {
            gsap.set(container, {
              visibility: 'visible',
              x: isDesktop ? '8vw' : '-5vw',
              y: isDesktop ? '10vh' : '25vh',
              scale: 1,
              rotation: -15.75
            });
            floatAnim.play();
          }
        });

        // =============================================================
        // PHASE 2: Landing in About (Direct transition)
        // =============================================================
        gsap.to(container, {
          x: isDesktop ? '5vw' : '0vw', // Safe on-screen position with gutter spacing
          y: isDesktop ? '28vh' : '24vh',
          scale: isDesktop ? 1 : 0.5,
          visibility: 'visible',
          rotation: -16.75,
          ease: 'power1.inOut',
          scrollTrigger: {
            trigger: '#about-section',
            start: 'top 90%',
            end: 'top 10%',
            scrub: 1,
            fastScrollEnd: true,
            invalidateOnRefresh: true,
          },
        });

        // =============================================================
        // PHASE 3: About → Tracks: sweep right + flip
        // =============================================================
        const phase3 = gsap.timeline({
          scrollTrigger: {
            trigger: '#about-section',
            start: 'top top',
            end: 'bottom top',
            scrub: 1, // Standardized scrub
            invalidateOnRefresh: true,
          },
        });

        phase3.to(container, {
          x: isDesktop ? '52vw' : '45vw',
          y: isDesktop ? '25vh' : '20vh',
          scale: isDesktop ? 1 : 0.5, // Explicit scale to prevent drift
          rotation: 16.75,
          duration: 1,
          ease: 'power2.inOut',
        }, 0);

        // Flip logic
        phase3.to(floatEl, {
          scaleX: 0,
          duration: 0.15,
          ease: 'power1.in',
        }, 0.35);

        phase3.set(normalEl, { opacity: 0 }, 0.5);
        phase3.set(flippedEl, { opacity: 1 }, 0.5);

        phase3.to(floatEl, {
          scaleX: 1,
          duration: 0.15,
          ease: 'power1.out',
        }, 0.5);

        // =============================================================
        // PHASE 4: Extract Astronaut (Disappears with Tracks section)
        // =============================================================
        gsap.to(container, {
          y: '-100vh',
          ease: 'none',
          scrollTrigger: {
            trigger: '#next-section',
            start: 'top top',
            end: 'bottom top',
            scrub: 1,
            invalidateOnRefresh: true,
          },
        });

        return () => window.removeEventListener('mousemove', handleMouseMove);
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed top-0 left-0 pointer-events-none"
      style={{
        width: 'clamp(280px, 35vw, 800px)', // Slightly tighter width
        aspectRatio: '0.8 / 1.1', // Tighter vertical focus
        zIndex: 30,
        willChange: 'transform',
        opacity: 0, 
        visibility: 'visible',
      }}
    >
      <div
        id="global-astronaut"
        className="relative w-full h-full"
      >
        <div ref={parallaxRef} className="relative w-full h-full transform scale-110 translate-y-[5%]">
          <div ref={floatRef} className="relative w-full h-auto">
            <img
              ref={normalRef}
              src={astronautImg}
              alt="Astronaut"
              className="w-full h-auto block drop-shadow-[10px_10px_30px_rgba(0,0,0,0.6)]"
            />
            <img
              ref={flippedRef}
              src={astronautFlippedImg}
              alt="Astronaut Flipped"
              className="absolute top-0 left-0 w-full h-full object-cover opacity-0 drop-shadow-[10px_10px_30px_rgba(0,0,0,0.6)]"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScrollAstronaut;
