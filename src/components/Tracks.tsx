import React, { useEffect, useRef, useMemo } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { prepare } from '@chenglou/pretext';

import dish1 from '../assets/rockets_satalites/Damaged satellite drifting in space.png';

gsap.registerPlugin(ScrollTrigger);

const TRACKS_TEXT = `THE TRACKS: ARCHIVE OF THE HACKASTRAL. THIS IS WHERE THE FREQUENCIES OF THE VOID ARE DECODED INTO USABLE DATA. 01. SIGNAL — ARTIFICIAL INTELLIGENCE & MACHINE LEARNING. DECODE THE NOISE. BUILD INTELLIGENCE THAT NAVIGATES THE VOID THROUGH LLMS, COMPUTER VISION, AND AUTONOMOUS SYSTEMS. 02. ORBIT — WEB3 & DECENTRALIZED PROTOCOLS. CHART NEW COORDINATES. DEVELOP SMART CONTRACTS AND DAOS THAT REWRITE THE FABRIC OF REALITY. 03. NEBULA — SPACE TECH & HARDWARE. ENGINEER THE TANGIBLE COSMOS. BRIDGING THE PHYSICAL AND DIGITAL VOID THROUGH IOT AND EMBEDDED SYSTEMS. THE REMNANTS OF THE OLD WORLD DRIFT PAST, BUT THE DATA IS ETERNAL.`;

const Tracks: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const titleWrapRef = useRef<HTMLDivElement>(null);

    const artifact2Ref = useRef<HTMLDivElement>(null);

    const WORDS = useMemo(() => TRACKS_TEXT.split(' '), []);
    const rafRef = useRef<number>(0);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(titleRef.current, {
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top 60%",
                    toggleActions: "play none none reverse"
                },
                x: -100,
                opacity: 0,
                duration: 1,
                ease: "power3.out"
            });
        }, containerRef);

        const canvas = canvasRef.current;
        if (!canvas) return;
        const canvasCtx = canvas.getContext('2d');
        if (!canvasCtx) return;

        const font = '22px "Space Mono", monospace';
        prepare(TRACKS_TEXT, font);

        const render = () => {
            if (!canvas || !canvasCtx || !containerRef.current) return;

            if (canvas.width !== canvas.clientWidth || canvas.height !== canvas.clientHeight) {
                canvas.width = canvas.clientWidth;
                canvas.height = canvas.clientHeight;
            }

            canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
            canvasCtx.font = font;
            canvasCtx.fillStyle = 'rgba(255, 255, 255, 0.45)';
            canvasCtx.textBaseline = 'top';

            const padding = 60; // Premium padding
            const isMobile = window.innerWidth < 768;
            const containerWidth = Math.min(canvas.width, 1400);
            const containerOffset = (canvas.width - containerWidth) / 2;

            // Layout: Text block on left, slightly wider to allow words to flow gracefully around the dish
            const textMaxWidth = isMobile ? (containerWidth - padding * 2) : (containerWidth * 0.55);
            const startX = isMobile ? (containerOffset + padding) : (containerOffset + padding);

            // Dynamically calculate start Y based on title element height if available
            let startY = isMobile ? 440 : 480;
            if (titleWrapRef.current && containerRef.current) {
                const titleRect = titleWrapRef.current.getBoundingClientRect();
                const containerRect2 = containerRef.current.getBoundingClientRect();
                const titleBottom = titleRect.bottom - containerRect2.top;
                if (titleBottom > 0) {
                    startY = titleBottom + 40;
                }
            }
            const lineHeight = 38;

            // GET ACTUAL ARTIFACT POSITIONS FROM DOM — title is NOT an obstacle (text starts below it)
            const obstacles: { x: number, y: number, w: number, h: number }[] = [];
            const containerRect = containerRef.current.getBoundingClientRect();

            if (artifact2Ref.current) {
                const rect = artifact2Ref.current.getBoundingClientRect();
                obstacles.push({
                    x: rect.left - containerRect.left,
                    y: rect.top - containerRect.top,
                    w: rect.width,
                    h: rect.height
                });
            }

            let currentX = startX;
            let currentY = startY;

            WORDS.forEach((word) => {

                const metrics = canvasCtx.measureText(word + ' ');
                const wordWidth = metrics.width;

                let placed = false;
                while (!placed) {
                    if (currentX + wordWidth > startX + textMaxWidth) {
                        currentX = startX;
                        currentY += lineHeight;
                    }

                    let collision = false;
                    const buffer = 30; // Closer high-fidelity cinematic buffer

                    for (const obs of obstacles) {
                        if (
                            currentY + lineHeight > obs.y - buffer &&
                            currentY < obs.y + obs.h + buffer &&
                            currentX + wordWidth > obs.x - buffer &&
                            currentX < obs.x + obs.w + buffer
                        ) {
                            collision = true;
                            break;
                        }
                    }

                    if (!collision) {
                        canvasCtx.fillText(word + ' ', currentX, currentY);
                        currentX += wordWidth;
                        placed = true;
                    } else {
                        currentX += 10;
                    }
                }
            });

            rafRef.current = requestAnimationFrame(render);
        };

        rafRef.current = requestAnimationFrame(render);

        return () => {
            ctx.revert();
            cancelAnimationFrame(rafRef.current);
        };
    }, [WORDS]);

    return (
        <section
            id="next-section"
            ref={containerRef}
            className="relative w-full min-h-[180vh] bg-transparent flex items-start overflow-visible pt-20"
        >
            <canvas
                ref={canvasRef}
                className="absolute inset-0 pointer-events-none"
                style={{ width: '100%', height: '100%' }}
            />

            {/* Dish — Rotated and Enlarged for dynamic presence */}
            <div
                ref={artifact2Ref}
                className="absolute left-[8%] top-[420px] w-96 h-80 opacity-100 pointer-events-none z-0 rotate-[-12deg]"
            >
                <img src={dish1} alt="Debris" className="w-full h-full object-contain" />
            </div>

            {/* Heading — left column */}
            <div className="relative z-10 w-full max-w-[1400px] mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-12 h-full pt-24 pointer-events-none">
                <div ref={titleWrapRef} className="md:col-start-1 lg:col-span-6 flex flex-col justify-start pointer-events-auto">
                    <h2
                        ref={titleRef}
                        className="text-6xl md:text-8xl lg:text-9xl font-black mb-8 tracking-wider bg-gradient-to-br from-white via-white to-orange-500 bg-clip-text text-transparent inline-block text-left w-full"
                        style={{ fontFamily: '"SF Pro Rounded", ui-rounded, system-ui, sans-serif' }}
                    >
                        THE<br />TRACKS
                    </h2>
                </div>
            </div>
        </section>
    );
};

export default Tracks;
