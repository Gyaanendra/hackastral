import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const TIMELINE_EVENTS = [
    { id: '01', phase: 'SIGNAL CAPTURE', date: 'OCT 01, 2026', label: 'Registration Opens' },
    { id: '02', phase: 'SYSTEM INITIALIZATION', date: 'OCT 20, 2026', label: 'Team Formation' },
    { id: '03', phase: 'THE LAUNCH', date: 'OCT 24, 2026', label: 'Opening Ceremony' },
    { id: '04', phase: 'DEEP SPACE HACK', date: 'OCT 25, 2026', label: 'Coding Marathon' },
    { id: '05', phase: 'ORBITAL ARRIVAL', date: 'OCT 26, 2026', label: 'Submission' },
    { id: '06', phase: 'COSMOS REWARD', date: 'NOV 01, 2026', label: 'Finale' },
];

const MissionLog: React.FC = () => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLDivElement>(null);
    const pathRef = useRef<SVGPathElement>(null);
    const rocketRef = useRef<SVGGElement>(null);
    const nodesRef = useRef<HTMLDivElement[]>([]);

    useEffect(() => {
        // Deterministic scroll bounds
        const totalVw = 300; // Complete width of the timeline container
        const scrollVw = totalVw - 100; // 200vw of scroll distance
        
        const scrubTween = gsap.to(sectionRef.current, {
            x: `-${scrollVw}vw`,
            ease: "none",
            scrollTrigger: {
                trigger: triggerRef.current,
                start: "top top",
                end: "bottom bottom", // Scrubs exactly over the wrapper's physical height
                scrub: 1,
                invalidateOnRefresh: true,
            }
        });

        // Path drawing animation
        if (pathRef.current && rocketRef.current) {
            const length = pathRef.current.getTotalLength();
            gsap.set(pathRef.current, { strokeDasharray: length, strokeDashoffset: length });
            
            // Draw line
            gsap.to(pathRef.current, {
                strokeDashoffset: 0,
                ease: "none",
                scrollTrigger: {
                    trigger: triggerRef.current,
                    start: "top top",
                    end: "bottom bottom",
                    scrub: 1,
                }
            });

            // Move Rocket
            gsap.fromTo(rocketRef.current, {
                x: 0,
            }, {
                x: 6000, // Match the exact coordinate length of the SVG path
                ease: "none",
                scrollTrigger: {
                    trigger: triggerRef.current,
                    start: "top top",
                    end: "bottom bottom",
                    scrub: 1,
                }
            });
        }

        // Node pop-in
        nodesRef.current.forEach((node) => {
            if (!node) return;
            gsap.fromTo(node.querySelector('.node-ring'), 
                { scale: 0, opacity: 0 },
                { 
                    scale: 1, 
                    opacity: 1, 
                    duration: 0.5,
                    scrollTrigger: {
                        trigger: node,
                        containerAnimation: scrubTween,
                        start: "left 80%",
                        toggleActions: "play none none reverse"
                    }
                }
            );
        });

        return () => {
            scrubTween.kill();
            ScrollTrigger.getAll().forEach(t => {
                if(t.vars.trigger === triggerRef.current) t.kill();
            });
        };
    }, []);

    return (
        <section id="mission-log-section" ref={triggerRef} className="relative w-full" style={{ height: 'calc(100vh + 200vw)' }}>
            <div className="sticky top-0 left-0 w-full h-[100vh] overflow-hidden bg-transparent border-y border-white/5">
                {/* Background Cluster Ambience & Hyperspace Streaks */}
                <div className="absolute inset-0 z-0 opacity-30 pointer-events-none overflow-hidden">
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-600/10 rounded-full blur-[120px] animate-pulse" />
                    <div className="absolute bottom-1/4 right-1/3 w-64 h-64 bg-orange-500/5 rounded-full blur-[100px]" />
                    
                    {/* High-velocity horizontal hyperspace streaks */}
                    {Array.from({ length: 40 }).map((_, i) => (
                        <div
                            key={i}
                            className="absolute h-[1px] bg-gradient-to-r from-transparent via-red-500/50 to-transparent animate-hyperspace"
                            style={{
                                top: `${Math.random() * 100}%`,
                                width: `${Math.random() * 300 + 100}px`,
                                opacity: Math.random() * 0.7 + 0.3,
                                animationDuration: `${Math.random() * 1.5 + 0.5}s`,
                                animationDelay: `-${Math.random() * 2}s`
                            }}
                        />
                    ))}
                    
                    {Array.from({ length: 20 }).map((_, i) => (
                        <div
                            key={`white-${i}`}
                            className="absolute h-[2px] bg-gradient-to-r from-transparent via-white/80 to-transparent animate-hyperspace"
                            style={{
                                top: `${Math.random() * 100}%`,
                                width: `${Math.random() * 400 + 150}px`,
                                animationDuration: `${Math.random() * 1 + 0.3}s`,
                                animationDelay: `-${Math.random() * 2}s`
                            }}
                        />
                    ))}
                </div>

                <div ref={sectionRef} className="relative h-[100vh] flex flex-nowrap items-center z-10" style={{ width: '300vw' }}>
                    <div className="absolute left-[10vw] top-[20%]">
                        <h2 className="text-4xl md:text-5xl font-black tracking-[0.3em] text-white opacity-20 pointer-events-none select-none">
                            MISSION LOG
                        </h2>
                    </div>

                    {/* SVG Flight Path Container */}
                    <svg className="absolute left-[20vw] top-1/2 -translate-y-1/2 h-32 pointer-events-none overflow-visible z-10" style={{ width: '250vw' }}>
                        {/* Red Dotted Flight Path */}
                        <path
                            ref={pathRef}
                            d={`M 0 64 L 6000 64`}
                            fill="none"
                            stroke="#dc2626"
                            strokeWidth="3"
                            strokeDasharray="8 12"
                            className="opacity-40 shadow-[0_0_10px_rgba(220,38,38,0.8)]"
                        />
                        
                        {/* Rocket Ship */}
                        <g transform="translate(0, 64)">
                            <g ref={rocketRef}>
                                {/* Rotated 45 degrees so it points perfectly horizontal (Right) */}
                                <g transform="rotate(45) translate(-12, -12)">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="#dc2626" stroke="#ffffff" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="drop-shadow-[0_0_15px_rgba(220,38,38,1)]">
                                        <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/>
                                        <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/>
                                        <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/>
                                        <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/>
                                    </svg>
                                </g>
                                {/* Rocket Thruster Engine Glow */}
                                <circle cx="-20" cy="0" r="10" fill="#facc15" className="animate-ping opacity-60" />
                                <circle cx="-20" cy="0" r="4" fill="#ffffff" className="animate-pulse" />
                            </g>
                        </g>
                    </svg>

                    {/* Milestones evenly distributed across the 300vw container */}
                    <div className="flex w-full px-[30vw] justify-between items-center">
                        {TIMELINE_EVENTS.map((event, i) => (
                            <div 
                                key={event.id}
                                ref={el => { if (el) nodesRef.current[i] = el; }}
                                className="relative flex flex-col items-center justify-center group"
                            >
                                {/* Phase Name - Above */}
                                <div className="absolute bottom-12 w-64 text-center transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                                    <span className="text-white text-lg font-black tracking-widest uppercase drop-shadow-[0_0_15px_rgba(255,255,255,0.5)] whitespace-nowrap">
                                        {event.phase}
                                    </span>
                                </div>
                                <div className="absolute bottom-12 w-64 text-center pointer-events-none">
                                    <span className="text-white opacity-30 text-lg font-black tracking-widest uppercase whitespace-nowrap">
                                        {event.phase}
                                    </span>
                                </div>

                                {/* Glowing Node - Center */}
                                <div className="node-ring relative w-6 h-6 rounded-full bg-red-600 shadow-[0_0_20px_rgba(220,38,38,0.8)] z-20 transition-transform duration-500 group-hover:scale-125">
                                    <div className="absolute inset-0 bg-white rounded-full scale-0 group-hover:scale-50 transition-transform duration-300" />
                                </div>

                                {/* Date - Below */}
                                <div className="absolute top-10 w-48 text-center">
                                    <span className="text-[#a1a1aa] font-mono text-sm tracking-widest">
                                        {event.date}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default MissionLog;
