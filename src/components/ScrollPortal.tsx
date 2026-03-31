import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function ScrollPortal() {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef      = useRef<SVGSVGElement>(null);
  const subtitleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !svgRef.current) return;

    // Subtitle entrance
    gsap.fromTo(
      subtitleRef.current,
      { opacity: 0, y: -12 },
      { opacity: 1, y: 0, duration: 1.8, ease: 'power2.out', delay: 0.4 }
    );

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top top',
        end: '+=3000',
        scrub: 1.2,
        pin: true,
        anticipatePin: 1,
      },
    });

    tl.to(svgRef.current, { scale: 130, ease: 'power3.in' });
    tl.to(svgRef.current, { opacity: 0, duration: 0.1 }, '>-0.1');

    return () => ScrollTrigger.getAll().forEach(t => t.kill());
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        backgroundColor: 'transparent',
        overflow: 'hidden',
      }}
    >
      {/* ── Tagline ── */}
      <div
        ref={subtitleRef}
        style={{
          position: 'absolute',
          top: '14%',
          left: '50%',
          transform: 'translateX(-50%)',
          textAlign: 'center',
          color: 'rgba(200, 230, 255, 0.65)',
          fontSize: 'clamp(0.65rem, 1.2vw, 0.88rem)',
          fontFamily: "'Space Grotesk', sans-serif",
          fontWeight: 300,
          letterSpacing: '0.14em',
          lineHeight: 1.9,
          zIndex: 20,
          whiteSpace: 'nowrap',
        }}
      >
        The highest benchmark<br />for AI industry standards
      </div>

      {/* ── Main SVG ── */}
      <svg
        ref={svgRef}
        viewBox="0 0 1000 1000"
        preserveAspectRatio="xMidYMid slice"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 10,
          transformOrigin: '50% 52%',
          willChange: 'transform',
          transform: 'translateZ(0)',
        }}
      >
        <defs>
          {/* ── Letter shape ── */}
          <text
            id="portal-text"
            x="50%"
            y="52%"
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="290"
            fontFamily="'Space Grotesk', sans-serif"
            fontWeight="900"
            letterSpacing="0.01em"
          >
            AIS
          </text>

          {/* Cutout mask — the Three.js canvas shows through the letter holes */}
          <mask id="textCutout">
            <rect width="100%" height="100%" fill="white" />
            <use href="#portal-text" fill="black" />
          </mask>

          {/* Room wall gradient — dark navy, not pure black (matches reference) */}
          <radialGradient id="roomGrad" cx="50%" cy="35%" r="65%">
            <stop offset="0%"   stopColor="#0C1828" />
            <stop offset="55%"  stopColor="#080E1A" />
            <stop offset="100%" stopColor="#04040E" />
          </radialGradient>

          {/* Top atmospheric haze — subtle blue-gray like in the reference */}
          <radialGradient id="topHaze" cx="50%" cy="0%" r="60%">
            <stop offset="0%"   stopColor="#112244" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#04040E" stopOpacity="0"   />
          </radialGradient>

          {/* Floor beam gradient (narrow, tall) */}
          <linearGradient id="floorBeam" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%"   stopColor="#00B4FF" stopOpacity="0.9" />
            <stop offset="50%"  stopColor="#0066AA" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#04040E" stopOpacity="0"   />
          </linearGradient>

          {/* LED strip: only slightly blurred — crisp bottom-edge glow */}
          {/* stdDeviation=2 keeps edges sharp, just adds a thin 1-2px glow */}
          <filter id="ledGlow" x="-10%" y="-10%" width="120%" height="120%">
            <feGaussianBlur stdDeviation="2" />
          </filter>

          {/* Floor pool: wide soft blur for the reflected light puddle below */}
          <filter id="floorPool" x="-60%" y="-20%" width="220%" height="200%">
            <feGaussianBlur stdDeviation="20" />
          </filter>
        </defs>

        {/* ── LAYER 1: Room wall with cutout holes (space shows through) ── */}
        <rect width="100%" height="100%" fill="url(#roomGrad)" mask="url(#textCutout)" />

        {/* ── LAYER 2: Top atmospheric haze (above the letters, like reference) ── */}
        <rect width="100%" height="50%"
          fill="url(#topHaze)"
          mask="url(#textCutout)"
        />

        {/* ── LAYER 3: Thin cyan LED strip — ONLY at the very bottom of each letter ── */}
        {/* We clip the stroke to a horizontal band at y=62%-68% (bottom of text) */}
        {/* clipPath trick: show only the bottom 8% of the text height */}
        <clipPath id="bottomSlice">
          <rect x="0%" y="60%" width="100%" height="8%" />
        </clipPath>
        <use
          href="#portal-text"
          fill="none"
          stroke="#00CCFF"
          strokeWidth="3"
          opacity="0.95"
          filter="url(#ledGlow)"
          clipPath="url(#bottomSlice)"
        />

        {/* ── LAYER 4: Floor narrow light beams reflecting below the letters ── */}
        {/* Three narrow vertical strips roughly under A, I, S */}
        <rect x="18%" y="63%" width="18%" height="35%"
          fill="url(#floorBeam)"
          filter="url(#floorPool)"
          style={{ mixBlendMode: 'screen', opacity: 0.65 }}
        />
        <rect x="42%" y="63%" width="14%" height="35%"
          fill="url(#floorBeam)"
          filter="url(#floorPool)"
          style={{ mixBlendMode: 'screen', opacity: 0.6 }}
        />
        <rect x="62%" y="63%" width="18%" height="35%"
          fill="url(#floorBeam)"
          filter="url(#floorPool)"
          style={{ mixBlendMode: 'screen', opacity: 0.6 }}
        />

        {/* ── LAYER 5: Wide ambient room glow from below (very subtle) ── */}
        <ellipse
          cx="50%" cy="75%" rx="38%" ry="15%"
          fill="#003366"
          filter="url(#floorPool)"
          style={{ mixBlendMode: 'screen', opacity: 0.35 }}
        />
      </svg>
    </div>
  );
}
