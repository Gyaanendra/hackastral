import React, { useEffect, useMemo, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const generateStars = (count: number, color: string) => {
  // Generate random coordinates within a 2x viewport bounds to cover the complete scrolling delta safely without revealing emptiness.
  const vw = typeof window !== 'undefined' ? window.innerWidth : 2000;
  const vh = typeof window !== 'undefined' ? window.innerHeight * 2 : 3000;
  
  let val = `${Math.floor(Math.random() * vw)}px ${Math.floor(Math.random() * vh)}px ${color}`;
  for (let i = 1; i < count; i++) {
    val += `, ${Math.floor(Math.random() * vw)}px ${Math.floor(Math.random() * vh)}px ${color}`;
  }
  return val;
};

const StarsBackground: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const layer1Ref = useRef<HTMLDivElement>(null);
  const layer2Ref = useRef<HTMLDivElement>(null);
  const layer3Ref = useRef<HTMLDivElement>(null);

  // Memoizing heavy computationally random coordinate matrices so they do not rerender unless component dies
  const stars1 = useMemo(() => generateStars(700, '#FFFFFF'), []); // High density, Tiny, Fading
  const stars2 = useMemo(() => generateStars(200, '#FFFFFF'), []); // Medium density, Medium size
  const stars3 = useMemo(() => generateStars(50, '#FFFFFF'), []);  // Low density, Large, Bright

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 3D Depth scrub mapping: Backgrounds move slower than foregrounds.
      // Layer 1 (Deepest Space) - Barely moves, simulates infinity.
      gsap.to(layer1Ref.current, {
        y: '-10vh',
        ease: 'none',
        scrollTrigger: {
          trigger: document.body,
          start: 'top top',
          end: 'bottom bottom',
          scrub: true
        }
      });

      // Layer 2 (Mid Space) - Moves somewhat.
      gsap.to(layer2Ref.current, {
        y: '-25vh',
        ease: 'none',
        scrollTrigger: {
          trigger: document.body,
          start: 'top top',
          end: 'bottom bottom',
          scrub: true
        }
      });

      // Layer 3 (Near Space) - Moves drastically matching standard pseudo-scroll.
      gsap.to(layer3Ref.current, {
        y: '-50vh',
        ease: 'none',
        scrollTrigger: {
          trigger: document.body,
          start: 'top top',
          end: 'bottom bottom',
          scrub: true
        }
      });
      
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-black">
      {/* Base glow ambients behind the stars */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,80,0,0.1)_0%,transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(0,120,255,0.08)_0%,transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(255,80,0,0.05)_0%,transparent_50%)]" />
      
      {/* Cinematic Nebula Layer 1 */}
      <div className="absolute top-[-20%] left-[-10%] w-[120%] h-[120%] bg-[radial-gradient(circle_at_50%_50%,rgba(255,100,0,0.03)_0%,transparent_70%)] blur-[100px] animate-pulse duration-[10s]" />
      
      {/* Cinematic Nebula Layer 2 */}
      <div className="absolute top-[20%] right-[-10%] w-[100%] h-[100%] bg-[radial-gradient(circle_at_50%_50%,rgba(0,100,255,0.03)_0%,transparent_70%)] blur-[120px]" />

      {/* Layer 1 - Micro Stars */}
      <div 
        ref={layer1Ref} 
        className="absolute top-0 left-0 w-[1px] h-[1px] rounded-full opacity-30" 
        style={{ boxShadow: stars1 }}
      />
      
      {/* Layer 2 - Mid Stars */}
      <div 
        ref={layer2Ref} 
        className="absolute top-0 left-0 w-[2px] h-[2px] rounded-full opacity-60" 
        style={{ boxShadow: stars2 }}
      />
      
      {/* Layer 3 - Bright Mega Stars */}
      <div 
        ref={layer3Ref} 
        className="absolute top-0 left-0 w-[3px] h-[3px] rounded-full opacity-100 drop-shadow-[0_0_2px_rgba(255,255,255,0.8)]" 
        style={{ boxShadow: stars3 }}
      />
    </div>
  );
};

export default StarsBackground;
