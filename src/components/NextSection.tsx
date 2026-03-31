import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import planet1 from '../assets/planent1.png';

gsap.registerPlugin(ScrollTrigger);

const NextSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const textRefs = useRef<HTMLParagraphElement[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 60%", // Triggers when the top of the section reaches 60% down the viewport
          end: "top 20%",
          toggleActions: "play none none reverse"
        }
      });

      // Side reveal for the Title (From the Left this time)
      tl.from(titleRef.current, {
        x: -100, // Slide in from the left
        opacity: 0,
        duration: 1,
        ease: "power3.out"
      });

      // Staggered reveal for the paragraphs
      if (textRefs.current.length > 0) {
        tl.from(textRefs.current, {
          x: -50,
          opacity: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: "power2.out"
        }, "-=0.6");
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const addToRefs = (el: HTMLParagraphElement | null) => {
    if (el && !textRefs.current.includes(el)) {
      textRefs.current.push(el);
    }
  };

  return (
    <section 
      id="next-section"
      ref={containerRef}
      className="relative w-full min-h-screen bg-transparent flex items-center"
    >
      {/* Distant Planet Background mapped inversely */}
      <img
        src={planet1}
        alt="Distant Planet"
        className="absolute top-1/2 left-[-10vw] md:left-[5vw] -translate-y-1/2 w-[90vw] md:w-[60vw] lg:w-[45vw] max-w-[800px] opacity-[0.03] md:opacity-10 pointer-events-none z-0 filter blur-[2px] brightness-75 mix-blend-screen"
      />

      {/* Grid Layout: Right is empty for Astronaut. Left is Content. */}
      <div className="relative z-10 w-full max-w-[1400px] mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-2 gap-12 pointer-events-none">
        
        {/* Left Space - Content */}
        <div className="flex flex-col justify-center max-w-2xl pointer-events-auto mt-24 md:mt-0 py-20 md:py-0 order-2 md:order-1">
          {/* Glassmorphic Card for mobile readability */}
          <div className="relative p-8 md:p-0 rounded-3xl md:rounded-none bg-white/[0.03] md:bg-transparent backdrop-blur-md md:backdrop-blur-none border border-white/10 md:border-none shadow-2xl md:shadow-none overflow-hidden">
            <h2 
              ref={titleRef}
              className="text-5xl md:text-7xl lg:text-8xl font-black mb-8 tracking-wider text-left bg-gradient-to-br from-white via-white to-orange-500 bg-clip-text text-transparent inline-block"
              style={{ fontFamily: '"SF Pro Rounded", ui-rounded, system-ui, sans-serif' }}
            >
              THE TRACKS
            </h2>

            <div className="space-y-6 text-gray-300 text-base md:text-xl font-light leading-relaxed text-left">
              <p ref={addToRefs}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
              </p>
              <p ref={addToRefs}>
                Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
              </p>
              <p ref={addToRefs}>
                Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
              </p>
            </div>
            
            {/* Ambient Glow effect inside the card */}
            <div className="absolute -top-10 -left-10 w-32 h-32 bg-orange-500/10 blur-[80px] rounded-full pointer-events-none" />
          </div>
        </div>

        {/* Right Space - Reserved for Astronaut to flip and land into */}
        <div className="hidden md:block order-1 md:order-2"></div>
      </div>
    </section>
  );
};

export default NextSection;
