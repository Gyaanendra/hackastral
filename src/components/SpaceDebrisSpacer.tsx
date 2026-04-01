import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import satellite from '../assets/satalite1.png';
import planet from '../assets/planent1.png';

gsap.registerPlugin(ScrollTrigger);

const SpaceDebrisSpacer: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const satelliteRef = useRef<HTMLImageElement>(null);
  const planetRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Powerful parallax translation to make it feel like you are plummeting
      gsap.to(satelliteRef.current, {
        y: -400,
        rotation: -45, /* Tumbling in space */
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        }
      });

      gsap.to(planetRef.current, {
        y: -150,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1, /* Slower scrub for deeper background objects */
        }
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="relative w-full h-[60vh] md:h-[100vh] overflow-hidden pointer-events-none z-10">
      {/* Deep Space Background Planet */}
      <img
        ref={planetRef}
        src={planet}
        alt="Distant Planet"
        className="absolute bottom-[-10%] left-[-15%] w-[80vw] md:w-[60vw] max-w-[800px] opacity-10 blur-sm mix-blend-screen"
      />
      
      {/* Floating Foreground Satellite */}
      <img
        ref={satelliteRef}
        src={satellite}
        alt="Tumbling Satellite"
        className="absolute top-[30%] right-[5%] md:right-[15%] w-[180px] md:w-[350px] opacity-60 drop-shadow-[5px_5px_30px_rgba(255,255,255,0.05)] animate-float"
        style={{ animationDuration: '8s' }}
      />
    </div>
  );
};

export default SpaceDebrisSpacer;
