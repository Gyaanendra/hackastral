import { useEffect, useState } from 'react';

// Stars generated once at module level
const STARS = Array.from({ length: 140 }, () => ({
  cx: Math.random() * 500,
  cy: Math.random() * 900,
  r: Math.random() * 1.0 + 0.3,
  op: Math.random() * 0.55 + 0.25,
  dur: (2 + Math.random() * 3).toFixed(1),
}));

export default function HeroSVGMask() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 300);
    document.fonts.ready.then(() => { clearTimeout(t); setReady(true); });
    return () => clearTimeout(t);
  }, []);

  // Layout constants
  const VW = 500, VH = 900;
  const CX = 250, CY = 560, FS = 188;
  const TOP = CY - FS * 0.73;  // approximate cap-height top

  return (
    <div style={{
      position: 'relative', width: '100%', height: '100%',
      background: '#010510', overflow: 'hidden',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <style>{`
        @keyframes ais-sweep {
          0%   { transform: translateX(-520px); }
          100% { transform: translateX(1100px); }
        }
        @keyframes ais-halo {
          0%, 100% { opacity: 0.32; }
          50%       { opacity: 0.52; }
        }
      `}</style>

      <svg
        viewBox={`0 0 ${VW} ${VH}`}
        width="100%" height="100%"
        preserveAspectRatio="xMidYMid meet"
        style={{ opacity: ready ? 1 : 0, transition: 'opacity 0.5s ease', overflow: 'visible' }}
        aria-label="AIS"
      >
        <defs>
          {/* ── Text clip ── */}
          <clipPath id="ais-clip">
            <text x={CX} y={CY} textAnchor="middle"
              fontFamily="'Inter','Arial Black',Arial,sans-serif"
              fontWeight="900" fontSize={FS} letterSpacing="-4">AIS</text>
          </clipPath>

          {/* Interior space: deep blue radial */}
          <radialGradient id="g-space" cx={CX} cy={CY - FS * 0.4} r={FS * 2.2}
            gradientUnits="userSpaceOnUse">
            <stop offset="0%"   stopColor="#2870D8"/>
            <stop offset="30%"  stopColor="#0E1E72"/>
            <stop offset="70%"  stopColor="#050C32"/>
            <stop offset="100%" stopColor="#020818"/>
          </radialGradient>

          {/* Purple accent — right side (S) */}
          <radialGradient id="g-purple" cx={VW * 0.82} cy={CY - FS * 0.35} r={FS * 1.3}
            gradientUnits="userSpaceOnUse">
            <stop offset="0%"   stopColor="#6020C0" stopOpacity="0.9"/>
            <stop offset="100%" stopColor="#6020C0" stopOpacity="0"/>
          </radialGradient>

          {/* Top bevel: white → blue band at cap-height */}
          <linearGradient id="g-bevel-top" x1={CX} y1={TOP} x2={CX} y2={TOP + FS * 0.24}
            gradientUnits="userSpaceOnUse">
            <stop offset="0%"   stopColor="#D0E8FF" stopOpacity="1"/>
            <stop offset="12%"  stopColor="#88AAFF" stopOpacity="0.8"/>
            <stop offset="45%"  stopColor="#3055CC" stopOpacity="0.2"/>
            <stop offset="100%" stopColor="#020818" stopOpacity="0"/>
          </linearGradient>

          {/* Bottom bevel: dim blue at baseline */}
          <linearGradient id="g-bevel-bot" x1={CX} y1={CY} x2={CX} y2={CY - FS * 0.18}
            gradientUnits="userSpaceOnUse">
            <stop offset="0%"   stopColor="#3366BB" stopOpacity="0.65"/>
            <stop offset="100%" stopColor="#020818" stopOpacity="0"/>
          </linearGradient>

          {/* Shimmer: thin white vertical band (swept by CSS anim) */}
          <linearGradient id="g-shimmer" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor="white" stopOpacity="0"/>
            <stop offset="44%"  stopColor="white" stopOpacity="0"/>
            <stop offset="48%"  stopColor="white" stopOpacity="0.3"/>
            <stop offset="50%"  stopColor="white" stopOpacity="0.92"/>
            <stop offset="52%"  stopColor="white" stopOpacity="0.3"/>
            <stop offset="56%"  stopColor="white" stopOpacity="0"/>
            <stop offset="100%" stopColor="white" stopOpacity="0"/>
          </linearGradient>

          {/* Edge stroke gradient — cyan → blue → violet */}
          <linearGradient id="g-edge" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%"   stopColor="#AADDFF"/>
            <stop offset="30%"  stopColor="#44AAFF"/>
            <stop offset="65%"  stopColor="#8833EE"/>
            <stop offset="100%" stopColor="#CCEEFF"/>
          </linearGradient>

          {/* Blur filters */}
          <filter id="f-halo"  x="-25%" y="-25%" width="150%" height="150%">
            <feGaussianBlur stdDeviation="14"/>
          </filter>
          <filter id="f-edge"  x="-6%"  y="-6%"  width="112%" height="112%">
            <feGaussianBlur stdDeviation="3"/>
          </filter>
        </defs>

        {/* ── Stars ── */}
        {STARS.map((s, i) => (
          <circle key={i} cx={s.cx} cy={s.cy} r={s.r} fill="#C4D8FF" opacity={s.op}>
            <animate attributeName="opacity"
              values={`${s.op};${Math.min(1, s.op + 0.4)};${s.op}`}
              dur={`${s.dur}s`} repeatCount="indefinite"/>
          </circle>
        ))}

        {/* ── Layer 1: Outer halo glow ── */}
        <text x={CX} y={CY} textAnchor="middle"
          fontFamily="'Inter','Arial Black',Arial,sans-serif"
          fontWeight="900" fontSize={FS} letterSpacing="-4"
          fill="#2255EE" filter="url(#f-halo)"
          style={{ animation: 'ais-halo 2.8s ease-in-out infinite' }}>AIS</text>

        {/* ── Layer 2: Clipped interior (the "portal" space) ── */}
        <g clipPath="url(#ais-clip)">
          <rect x="0" y="0" width={VW} height={VH} fill="url(#g-space)"/>
          <rect x="0" y="0" width={VW} height={VH} fill="url(#g-purple)"/>
          <rect x="0" y="0" width={VW} height={VH} fill="url(#g-bevel-top)"/>
          <rect x="0" y="0" width={VH} height={VH} fill="url(#g-bevel-bot)"/>
          {/* Animated shimmer sweep */}
          <rect x="0" y="0" width={VW} height={VH} fill="url(#g-shimmer)"
            style={{ animation: 'ais-sweep 4s linear infinite' }}/>
        </g>

        {/* ── Layer 3: Soft glow stroke ── */}
        <text x={CX} y={CY} textAnchor="middle"
          fontFamily="'Inter','Arial Black',Arial,sans-serif"
          fontWeight="900" fontSize={FS} letterSpacing="-4"
          fill="none" stroke="#3366FF" strokeWidth="5"
          opacity="0.65" filter="url(#f-edge)">AIS</text>

        {/* ── Layer 4: Sharp metallic edge stroke ── */}
        <text x={CX} y={CY} textAnchor="middle"
          fontFamily="'Inter','Arial Black',Arial,sans-serif"
          fontWeight="900" fontSize={FS} letterSpacing="-4"
          fill="none" stroke="url(#g-edge)" strokeWidth="1.5"
          opacity="0.95">AIS</text>
      </svg>
    </div>
  );
}
