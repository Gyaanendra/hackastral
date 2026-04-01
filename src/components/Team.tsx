import React from 'react';
import gyanendraImg from '../assets/teams/gyanendra.png';

// =========================================================================
// TEAM JSON DATA
// =========================================================================

const TEAM_MEMBERS = [
    {
        id: '1',
        name: 'RISHABH VERMA',
        role: 'MISSION COMMANDER',
        img: gyanendraImg
    },
    {
        id: '2',
        name: 'GYANENDRA',
        role: 'SYSTEMS ARCHITECT',
        img: gyanendraImg
    },
    {
        id: '3',
        name: 'CREW MEMBER 3',
        role: 'FLIGHT ENGINEER',
        img: gyanendraImg
    },
    {
        id: '4',
        name: 'CREW MEMBER 4',
        role: 'PAYLOAD SPECIALIST',
        img: gyanendraImg
    }
];

const Team: React.FC = () => {
    return (
        <section className="relative w-full min-h-screen bg-transparent py-24 px-6 md:px-12 lg:px-24 z-10 flex flex-col items-center">

            {/* Header */}
            <div className="w-full max-w-7xl mb-16 flex flex-col items-start pb-6 border-b border-white/10">
                <span className="text-red-600 font-share-tech tracking-[0.3em] text-sm md:text-md mb-2">FILE: HACKASTRAL_MANIFEST</span>
                <h2 className="text-4xl md:text-5xl lg:text-7xl font-orbitron font-black text-white uppercase tracking-widest drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                    MISSION CREW
                </h2>
            </div>

            {/* Simple Clean Image Grid */}
            <div className="w-full max-w-7xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
                {TEAM_MEMBERS.map((member) => (
                    <div
                        key={member.id}
                        className="group relative flex flex-col items-center"
                    >
                        {/* Just show the image raw without the complex card borders */}
                        <div className="w-full aspect-[4/5] mb-6 overflow-hidden rounded-lg bg-black/40 border border-white/10">
                            <img
                                src={member.img}
                                alt={member.name}
                                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                            />
                        </div>

                        {/* Clean minimal text layout directly below the image */}
                        <div className="w-full flex flex-col items-center text-center">
                            {/* <h3 className="font-orbitron font-bold text-2xl text-white tracking-widest mb-2">
                                {member.name}
                            </h3> */}
                            <span className="font-share-tech text-red-500 text-sm tracking-[0.2em] uppercase">
                                {member.role}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Team;
