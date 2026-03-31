import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import planet2 from '../assets/planent2.png';

gsap.registerPlugin(ScrollTrigger);

const About: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const textRefs = useRef<HTMLParagraphElement[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Create a timeline bound to the scroll position
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 60%", // Triggers when the top of the About section reaches 60% down the viewport
          end: "top 20%",
          toggleActions: "play none none reverse"
        }
      });

      // Side reveal for the Title
      tl.from(titleRef.current, {
        x: 100, // Slide in from the right
        opacity: 0,
        duration: 1,
        ease: "power3.out"
      });

      // Staggered reveal for the paragraphs
      if (textRefs.current.length > 0) {
        tl.from(textRefs.current, {
          x: 50,
          opacity: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: "power2.out"
        }, "-=0.6"); // Start slightly before the title finishes
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
      id="about-section"
      ref={containerRef}
      className="relative w-full min-h-screen bg-transparent flex items-center"
    >
      {/* Distant Planet 2 Background */}
      <img
        src={planet2}
        alt="Distant Planet"
        className="absolute top-1/2 right-[-10vw] md:right-[5vw] -translate-y-1/2 w-[90vw] md:w-[60vw] lg:w-[45vw] max-w-[800px] opacity-20 pointer-events-none z-0 filter blur-[1px] brightness-75 mix-blend-screen"
      />

      {/* Grid Layout: Left is explicitly empty for Astronaut catching. Right is Content. */}
      <div className="relative z-10 w-full max-w-[1400px] mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-2 gap-12 pointer-events-none">
        {/* Left Space - Reserved for floating Astronaut plunging from the Hero */}
        <div className="hidden md:block"></div>

        {/* Right Space - About Details */}
        <div className="flex flex-col justify-center max-w-2xl pointer-events-auto mt-32 md:mt-0">
          <h2 
            ref={titleRef}
            className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-8 tracking-wider"
            style={{ fontFamily: '"SF Pro Rounded", ui-rounded, system-ui, sans-serif' }}
          >
            ABOUT
          </h2>

          <div className="space-y-6 text-gray-300 text-lg md:text-xl font-light leading-relaxed">
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
        </div>
      </div>
    </section>
  );
};

export default About;
