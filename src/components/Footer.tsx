import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpCircle } from 'lucide-react';

// --- CUSTOM BRAND SVGS ---
const TwitterIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932 6.064-6.932zm-1.292 19.49h2.039L6.486 3.24H4.298l13.311 17.403z" />
  </svg>
);

const DiscordIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.666 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028c.462-.63.862-1.295 1.202-1.996a.076.076 0 0 0-.041-.105a13.11 13.11 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.419-2.157 2.419zm7.974 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.419-2.157 2.419z" />
  </svg>
);

const GithubIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M12 0C5.373 0 0 5.373 0 12c0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577V20.82c-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22v3.293c0 .319.23.694.825.576C20.565 21.796 24 17.298 24 12c0-6.627-5.373-12-12-12z" />
  </svg>
);

import layer1 from '../assets/footer/layer1.png';
import layer2 from '../assets/footer/layer2.png';
import layer3 from '../assets/footer/layer3.png';
import layer4 from '../assets/footer/layer4.png';

gsap.registerPlugin(ScrollTrigger);

const FOOTER_MANIFESTO = `THE MISSION IS CLEAR. WE ARE THE HARVESTERS OF FRAGMENTED TIME. EVERY SECOND SPENT BUILDING THE HACKASTRAL IS A SECOND RECLAIMED FROM THE VOID. JOIN US AS WE NAVIGATE THE FINAL FRONTIER OF CODED REALITY.`;

const Footer: React.FC = () => {
  const containerRef = useRef<HTMLElement>(null);
  const layer1Ref = useRef<HTMLDivElement>(null);
  const layer2Ref = useRef<HTMLDivElement>(null);
  const layer3Ref = useRef<HTMLDivElement>(null);
  const layer4Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let handleMouseMove: (e: MouseEvent) => void;

    const ctx = gsap.context(() => {
      const xTo1 = gsap.quickTo(layer1Ref.current, "x", { duration: 1.2, ease: "power3" });
      const yTo1 = gsap.quickTo(layer1Ref.current, "y", { duration: 1.2, ease: "power3" });
      const xTo2 = gsap.quickTo(layer2Ref.current, "x", { duration: 1.0, ease: "power3" });
      const yTo2 = gsap.quickTo(layer2Ref.current, "y", { duration: 1.0, ease: "power3" });
      const xTo3 = gsap.quickTo(layer3Ref.current, "x", { duration: 0.8, ease: "power3" });
      const yTo3 = gsap.quickTo(layer3Ref.current, "y", { duration: 0.8, ease: "power3" });
      const xTo4 = gsap.quickTo(layer4Ref.current, "x", { duration: 0.6, ease: "power3" });
      const yTo4 = gsap.quickTo(layer4Ref.current, "y", { duration: 0.6, ease: "power3" });

      handleMouseMove = (e: MouseEvent) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;

        xTo1(x * 15); yTo1(y * 15);
        xTo2(x * 30); yTo2(y * 30);
        xTo3(x * 50); yTo3(y * 50);
        xTo4(x * 80); yTo4(y * 80);
      };

      containerRef.current?.addEventListener('mousemove', handleMouseMove);

      const mm = gsap.matchMedia();
      mm.add("(min-width: 768px)", () => {
        gsap.from([layer1Ref.current, layer2Ref.current, layer3Ref.current, layer4Ref.current], {
          y: (i) => (i + 1) * 80,
          opacity: 0,
          stagger: 0.05,
          ease: "power2.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top bottom",
            end: "bottom bottom",
            scrub: true,
          }
        });
      });

    }, containerRef);

    return () => {
      ctx.revert();
      if (handleMouseMove) containerRef.current?.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer
      ref={containerRef}
      className="relative w-full h-[700px] md:h-[800px] bg-transparent overflow-hidden select-none"
    >
      <div className="absolute inset-0 z-0 pointer-events-none" style={{ maskImage: 'linear-gradient(to bottom, transparent, black 15%, black)', WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 25%, black)' }}>
        <div ref={layer1Ref} className="absolute inset-0 opacity-40">
          <img src={layer1} alt="B1" className="w-full h-full object-cover" />
        </div>
        <div ref={layer2Ref} className="absolute inset-0 opacity-60">
          <img src={layer2} alt="B2" className="w-full h-full object-cover" />
        </div>
        <div ref={layer3Ref} className="absolute inset-0 opacity-80">
          <img src={layer3} alt="B3" className="w-full h-full object-cover" />
        </div>
        <div ref={layer4Ref} className="absolute inset-0 opacity-100">
          <img src={layer4} alt="B4" className="w-full h-full object-cover" />
        </div>
      </div>

      {/* Dark gradient veil — top to bottom for depth */}
      <div className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-b from-black via-black/70 to-black/50 opacity-75" />
      {/* Readability overlay — darkens background layers */}
      <div className="absolute inset-0 z-[11] pointer-events-none backdrop-blur-[3px] bg-black/50" />

      <div className="relative z-[25] w-full h-full flex flex-col items-center justify-between py-16 md:py-20 px-6 md:px-20">
        <div className="w-full max-w-7xl flex flex-col md:flex-row items-center md:items-start justify-between gap-12 md:gap-0">
          <div className="flex flex-col items-center md:items-start group">
            <div className="h-1 w-12 md:w-16 bg-red-600 mb-6 md:mb-8 group-hover:w-24 md:group-hover:w-32 transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(220,38,38,0.5)]" />
            <h2 className="text-5xl md:text-8xl lg:text-9xl font-black tracking-tighter leading-none select-none text-white transition-all duration-500 hover:text-red-600 hover:scale-[1.02]"
              style={{ fontFamily: '"Bebas Neue", sans-serif' }}>
              HACKASTRAL
            </h2>
            <div className="flex flex-col md:flex-row items-center gap-2 md:gap-5 mt-4">
              <span className="text-[10px] md:text-sm tracking-[0.5em] uppercase font-bold text-red-600">MISSION AD 2026</span>
              <div className="hidden md:block h-[1px] w-12 bg-white/20" />
              <p className="text-gray-500 text-[10px] md:text-xs uppercase tracking-widest font-black">Celestial Bound</p>
            </div>

            {/* Normal Manifesto Text */}
            <p className="mt-12 text-gray-400 text-sm md:text-base font-mono max-w-md leading-relaxed opacity-60">
              {FOOTER_MANIFESTO}
            </p>
          </div>

          <div className="flex items-center gap-4 md:gap-8 mt-8 md:translate-y-4 pointer-events-auto">
            <a href="#" className="p-4 md:p-6 bg-white/[0.03] hover:bg-red-600/10 rounded-full border border-white/5 hover:border-red-600/40 backdrop-blur-3xl transition-all duration-500 group shadow-[0_20px_50px_rgba(0,0,0,0.5)] active:scale-95">
              <TwitterIcon className="w-5 h-5 md:w-7 md:h-7 text-gray-500 group-hover:text-red-500 transition-colors" />
            </a>
            <a href="#" className="p-4 md:p-6 bg-white/[0.03] hover:bg-red-600/10 rounded-full border border-white/5 hover:border-red-600/40 backdrop-blur-3xl transition-all duration-500 group shadow-[0_20px_50px_rgba(0,0,0,0.5)] active:scale-95">
              <DiscordIcon className="w-5 h-5 md:w-7 md:h-7 text-gray-500 group-hover:text-red-500 transition-colors" />
            </a>
            <a href="#" className="p-4 md:p-6 bg-white/[0.03] hover:bg-red-600/10 rounded-full border border-white/5 hover:border-red-600/40 backdrop-blur-3xl transition-all duration-500 group shadow-[0_20px_50px_rgba(0,0,0,0.5)] active:scale-95">
              <GithubIcon className="w-5 h-5 md:w-7 md:h-7 text-gray-500 group-hover:text-red-500 transition-colors" />
            </a>
          </div>
        </div>

        <div className="w-full max-w-7xl flex flex-col md:flex-row items-center justify-between gap-12 md:gap-16 border-t border-white/5 pt-12 md:pt-16 mt-auto pointer-events-auto">
          <div
            onClick={() => window.open('https://gyanendra.vihar.in', '_blank')}
            className="flex flex-col items-center md:items-start gap-2 cursor-pointer group relative min-w-[200px] md:min-w-[250px]"
          >
            <div className="relative overflow-hidden h-6 w-full flex items-center justify-center md:justify-start">
              <p className="text-gray-500 group-hover:-translate-y-full group-hover:opacity-0 transition-all duration-700 ease-in-out text-xs md:text-sm uppercase tracking-[0.2em] font-bold whitespace-nowrap">
                Developed by <span className="text-white">Gyanendra Prakash</span>
              </p>
              <p className="absolute top-0 left-0 text-red-600 translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-700 ease-in-out text-xs md:text-base font-black tracking-widest uppercase flex items-center justify-center md:justify-start w-full">
                gyanendra.vihar.in
              </p>
            </div>
            <div className="h-[2px] w-0 bg-red-600 group-hover:w-full transition-all duration-1000 ease-in-out shadow-[0_0_10px_rgba(220,38,38,0.8)]" />
          </div>

          <div className="flex flex-col items-center gap-6 order-last md:order-none scale-90 md:scale-100">
            <button
              onClick={scrollToTop}
              className="flex flex-col items-center gap-4 text-gray-500 hover:text-red-600 transition-all duration-500 group"
            >
              <ArrowUpCircle className="w-8 h-8 md:w-10 md:h-10 group-hover:-translate-y-3 transition-transform duration-700 ease-out text-red-600/30 group-hover:text-red-600" />
              <span className="text-[10px] uppercase tracking-[0.4em] font-black group-hover:tracking-[0.6em] transition-all duration-700">Top</span>
            </button>
          </div>

          <div className="text-center md:text-right space-y-2 mb-4 md:mb-0">
            <p className="text-gray-500 text-[10px] md:text-[11px] tracking-[0.3em] uppercase font-black">
              © 2026 AIS X ASTRONOMY
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
