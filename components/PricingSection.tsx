"use client";

import React from "react";
import { motion } from "framer-motion";

function CheckIcon({ className }: { className?: string }) {
    return (
        <svg className={className} width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M13.33 4L6 11.33 2.67 8" />
        </svg>
    );
}

function GreenCheckIcon({ className }: { className?: string }) {
    return (
        <span className={`inline-flex items-center justify-center bg-[#10B981] rounded-full p-[2.5px] shrink-0 ${className}`}>
            <svg width="9" height="9" viewBox="0 0 16 16" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M13.33 4L6 11.33 2.67 8" />
            </svg>
        </span>
    );
}

function MeetIcon() {
    return (
        <img
            src="https://www.gstatic.com/images/branding/productlogos/meet_2026/v2/web-96dp/logo_meet_2026_color_2x_web_96dp.png"
            alt=""
            className="w-[18px] h-[18px] shrink-0 transition-transform duration-300 group-hover:scale-110"
        />
    );
}

export default function PricingSection() {
    const [monthsInfo, setMonthsInfo] = React.useState({
        current: "MAY",
        currentYearShort: "26",
        next: "JUNE"
    });

    React.useEffect(() => {
        const now = new Date();
        const currentStr = now.toLocaleString("en-US", { month: "long" }).toUpperCase();
        const currentYrShort = String(now.getFullYear()).slice(2);
        
        const nextDate = new Date();
        nextDate.setMonth(now.getMonth() + 1);
        const nextStr = nextDate.toLocaleString("en-US", { month: "long" }).toUpperCase();

        setMonthsInfo({
            current: currentStr,
            currentYearShort: currentYrShort,
            next: nextStr
        });
    }, []);

    return (
        <section className="w-full bg-[#fafafa] font-sans py-8 sm:py-10 lg:py-12 border-t border-zinc-200/80 relative overflow-hidden">
            
            {/* Dots Background Pattern */}
            <div 
                className="absolute inset-0 pointer-events-none opacity-[0.35]" 
                style={{
                    backgroundImage: "radial-gradient(#c5c5c5 1px, transparent 1px)",
                    backgroundSize: "24px 24px"
                }}
            />

            <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                
                {/* Header Section */}
                <div className="flex flex-col items-center text-center mb-6 sm:mb-8">
                    <span className="inline-flex items-center gap-2 px-4 py-1.5 mb-5 bg-white border border-zinc-200/80 rounded-full text-[13px] font-semibold text-zinc-700 shadow-[0_2px_8px_rgba(0,0,0,0.03)] select-none">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#E61E32" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-500">
                            <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
                            <line x1="7" y1="7" x2="7.01" y2="7" />
                        </svg>
                        Pricing & Plans
                    </span>
                    <h2 className="text-[26px] sm:text-[30px] lg:text-[34px] font-semibold text-[#1E2022] tracking-tight leading-none max-w-3xl mb-4">
                        Predictable engineering pricing, built to scale.
                    </h2>
                    <p className="text-[14px] sm:text-[15px] text-zinc-500 max-w-xl font-normal leading-relaxed">
                        Skip recruitment delays and hidden overheads. Access a senior engineering team ready to build your product.
                    </p>
                </div>

                {/* Cards Container */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch max-w-[1020px] mx-auto">
                    
                    {/* Retainer Card (Dark & Premium - Squishy Animation) */}
                    <motion.div
                        whileHover="hover"
                        transition={{
                            duration: 1,
                            ease: "backInOut",
                        }}
                        variants={{
                            hover: {
                                scale: 1.03,
                            },
                        }}
                        className="bg-[#121314] border border-zinc-800 rounded-[20px] p-5 sm:p-6 flex flex-col justify-between shadow-[0_20px_40px_rgba(0,0,0,0.45)] relative overflow-hidden group hover:border-zinc-700 transition-all duration-300 cursor-pointer"
                    >
                        {/* Ambient Glow */}
                        <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-gradient-to-bl from-[#E61E32]/10 to-transparent rounded-full blur-3xl pointer-events-none z-0" />
                        
                        {/* Squishy SVG Background */}
                        <motion.svg
                            viewBox="0 0 320 384"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="absolute inset-0 z-0 w-full h-full opacity-60 pointer-events-none"
                            variants={{
                                hover: {
                                    scale: 1.25,
                                },
                            }}
                            transition={{
                                duration: 1,
                                ease: "backInOut",
                            }}
                        >
                            <motion.circle
                                variants={{
                                    hover: {
                                        scaleY: 0.6,
                                        y: -15,
                                    },
                                }}
                                transition={{
                                    duration: 1,
                                    ease: "backInOut",
                                    delay: 0.1,
                                }}
                                cx="160.5"
                                cy="114.5"
                                r="101.5"
                                fill="#1c1e20"
                            />
                            <motion.ellipse
                                variants={{
                                    hover: {
                                        scaleY: 1.8,
                                        y: -15,
                                    },
                                }}
                                transition={{
                                    duration: 1,
                                    ease: "backInOut",
                                    delay: 0.1,
                                }}
                                cx="160.5"
                                cy="265.5"
                                rx="101.5"
                                ry="43.5"
                                fill="#1c1e20"
                            />
                        </motion.svg>

                        {/* Interactive Content */}
                        <div className="relative z-10 flex flex-col justify-between h-full flex-grow">
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <span className="bg-[#E61E32]/10 border border-[#E61E32]/30 text-[#E61E32] text-[10.5px] font-bold tracking-wider uppercase px-3 py-1 rounded-full w-fit">
                                        Continuous Delivery
                                    </span>
                                    <span className="text-[11px] text-zinc-500 font-medium">Auto-renewing monthly</span>
                                </div>
                                
                                <h3 className="text-white text-[18px] sm:text-[20px] font-semibold tracking-tight">Dedicated Dev Partner</h3>
                                <p className="text-zinc-400 text-[14px] leading-relaxed mt-2.5">
                                    A full-stack engineering team integrated into your workflows. Perfect for ongoing product development, scaling features, and server maintenance.
                                </p>
                                
                                <motion.div 
                                    initial={{ scale: 0.92 }}
                                    variants={{
                                        hover: {
                                            scale: 1,
                                        },
                                    }}
                                    transition={{
                                        duration: 1,
                                        ease: "backInOut",
                                    }}
                                    className="text-white text-[38px] sm:text-[44px] font-extrabold mt-4 tracking-tight flex items-baseline origin-left"
                                >
                                    ₹99,000<span className="text-[14px] text-zinc-500 font-normal ml-2">/month</span>
                                </motion.div>
                                
                                <div className="border-t border-zinc-800/80 my-4" />
                                
                                {/* Checklist */}
                                <ul className="flex flex-col gap-2.5 text-zinc-300 text-[13.5px] leading-snug">
                                    <li className="flex items-start gap-3">
                                        <CheckIcon className="text-[#E61E32] shrink-0 mt-0.5" />
                                        <span>Full-stack web, mobile & cloud engineering</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <CheckIcon className="text-[#E61E32] shrink-0 mt-0.5" />
                                        <span>Dedicated senior engineers & tech architect</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <CheckIcon className="text-[#E61E32] shrink-0 mt-0.5" />
                                        <span>Next.js, React, Node.js, Python, PostgreSQL & AWS</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <CheckIcon className="text-[#E61E32] shrink-0 mt-0.5" />
                                        <span>Daily updates & async alignment in Slack</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <CheckIcon className="text-[#E61E32] shrink-0 mt-0.5" />
                                        <span>Weekly milestone meetings & status reviews</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <CheckIcon className="text-[#E61E32] shrink-0 mt-0.5" />
                                        <span>Shared Jira/Notion project board with clean backlogs</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <GreenCheckIcon className="mt-0.5" />
                                        <span className="text-white font-medium">Risk-free 7-day trial</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <GreenCheckIcon className="mt-0.5" />
                                        <span className="text-white font-medium">Pause or cancel subscription at any time</span>
                                    </li>
                                </ul>
                            </div>
                            
                            <div className="mt-5 relative z-10">
                                <a
                                    href="https://cal.com/redlix.co.in"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full bg-white hover:bg-zinc-100 text-zinc-900 font-bold text-[14px] py-3 rounded-xl flex items-center justify-center gap-2.5 transition-all duration-200 shadow-[0_4px_20px_rgba(255,255,255,0.05)] hover:scale-[1.01]"
                                >
                                    <MeetIcon />
                                    Join the Waitlist
                                </a>
                                <p className="text-center text-zinc-400 text-[10.5px] font-bold mt-4 tracking-wider uppercase select-none flex items-center justify-center gap-1.5">
                                    <span className="inline-block w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                                    FULLY BOOKED FOR {monthsInfo.current} &apos;{monthsInfo.currentYearShort} — 3 SLOTS FREE FOR {monthsInfo.next}
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Fixed Scope Card (Light & Modern - Squishy Animation) */}
                    <motion.div
                        whileHover="hover"
                        transition={{
                            duration: 1,
                            ease: "backInOut",
                        }}
                        variants={{
                            hover: {
                                scale: 1.03,
                            },
                        }}
                        className="bg-white border border-zinc-200/90 rounded-[20px] p-5 sm:p-6 flex flex-col justify-between shadow-[0_15px_30px_rgba(0,0,0,0.02)] relative overflow-hidden group hover:border-zinc-300 transition-all duration-300 cursor-pointer"
                    >
                        {/* Ambient Glow */}
                        <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-gradient-to-bl from-zinc-100/60 to-transparent rounded-full blur-3xl pointer-events-none z-0" />
                        
                        {/* Squishy SVG Background */}
                        <motion.svg
                            viewBox="0 0 320 384"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="absolute inset-0 z-0 w-full h-full opacity-[0.45] pointer-events-none"
                            variants={{
                                hover: {
                                    scale: 1.25,
                                },
                            }}
                            transition={{
                                duration: 1,
                                ease: "backInOut",
                            }}
                        >
                            <motion.circle
                                variants={{
                                    hover: {
                                        scaleY: 0.6,
                                        y: -15,
                                    },
                                }}
                                transition={{
                                    duration: 1,
                                    ease: "backInOut",
                                    delay: 0.1,
                                }}
                                cx="160.5"
                                cy="114.5"
                                r="101.5"
                                fill="#f4f4f6"
                            />
                            <motion.ellipse
                                variants={{
                                    hover: {
                                        scaleY: 1.8,
                                        y: -15,
                                    },
                                }}
                                transition={{
                                    duration: 1,
                                    ease: "backInOut",
                                    delay: 0.1,
                                }}
                                cx="160.5"
                                cy="265.5"
                                rx="101.5"
                                ry="43.5"
                                fill="#f4f4f6"
                            />
                        </motion.svg>

                        {/* Interactive Content */}
                        <div className="relative z-10 flex flex-col justify-between h-full flex-grow">
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <span className="bg-zinc-100 border border-zinc-200 text-zinc-600 text-[10.5px] font-bold tracking-wider uppercase px-3 py-1 rounded-full w-fit">
                                        Single Deliverable
                                    </span>
                                    <span className="text-[11px] text-zinc-500 font-medium">Milestone-based payment</span>
                                </div>
                                
                                <h3 className="text-zinc-900 text-[18px] sm:text-[20px] font-semibold tracking-tight">Custom Product Build</h3>
                                <p className="text-zinc-500 text-[14px] leading-relaxed mt-2.5">
                                    Best for shipping MVPs, complete web apps, complex API endpoints, or database structures from scratch with clear timelines.
                                </p>
                                
                                <motion.div 
                                    initial={{ scale: 0.92 }}
                                    variants={{
                                        hover: {
                                            scale: 1,
                                        },
                                    }}
                                    transition={{
                                        duration: 1,
                                        ease: "backInOut",
                                    }}
                                    className="text-zinc-900 text-[38px] sm:text-[44px] font-extrabold mt-4 tracking-tight flex items-baseline origin-left"
                                >
                                    ₹69,000<span className="text-[14px] text-zinc-500 font-normal ml-2"> onwards</span>
                                </motion.div>
                                
                                <div className="border-t border-zinc-200 my-4" />

                                {/* Dynamic Work Pipeline Graphic */}
                                <div className="bg-zinc-50 border border-zinc-200/50 rounded-xl p-3 mb-4 flex items-center justify-between text-center select-none shadow-[inset_0_1px_2px_rgba(0,0,0,0.01)]">
                                    <div className="flex flex-col items-center flex-1">
                                        <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider">Phase 01</span>
                                        <span className="text-[11.5px] font-semibold text-zinc-700 mt-0.5">Scope</span>
                                    </div>
                                    <div className="h-[1px] w-5 sm:w-8 bg-zinc-200 flex-shrink-0" />
                                    <div className="flex flex-col items-center flex-1">
                                        <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider">Phase 02</span>
                                        <span className="text-[11.5px] font-semibold text-zinc-700 mt-0.5">Sprint</span>
                                    </div>
                                    <div className="h-[1px] w-5 sm:w-8 bg-zinc-200 flex-shrink-0" />
                                    <div className="flex flex-col items-center flex-1">
                                        <span className="text-[9px] font-bold text-[#E61E32]/70 uppercase tracking-wider">Phase 03</span>
                                        <span className="text-[11.5px] font-bold text-[#E61E32] mt-0.5">Ship</span>
                                    </div>
                                </div>
                                
                                {/* Checklist */}
                                <ul className="flex flex-col gap-2.5 text-zinc-600 text-[13.5px] leading-snug">
                                    <li className="flex items-start gap-3">
                                        <CheckIcon className="text-zinc-400 shrink-0 mt-0.5" />
                                        <span>Detailed product specification & database architecture</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <CheckIcon className="text-zinc-400 shrink-0 mt-0.5" />
                                        <span>High-fidelity frontend UI implementation</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <CheckIcon className="text-zinc-400 shrink-0 mt-0.5" />
                                        <span>Custom API development & backend integrations</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <CheckIcon className="text-zinc-400 shrink-0 mt-0.5" />
                                        <span>Explicit milestones with weekly delivery timelines</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <CheckIcon className="text-zinc-400 shrink-0 mt-0.5" />
                                        <span>Direct communication in Slack & WhatsApp</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <GreenCheckIcon className="mt-0.5" />
                                        <span className="text-zinc-900 font-medium">30 days of comprehensive support post-launch</span>
                                    </li>
                                </ul>
                            </div>
                            
                            <div className="mt-5 relative z-10">
                                <a
                                    href="https://cal.com/redlix.co.in"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full bg-[#1E2022] hover:bg-[#2C3036] text-white font-bold text-[14px] py-3 rounded-xl flex items-center justify-center gap-2.5 transition-all duration-200 shadow-[0_4px_12px_rgba(30,32,34,0.15)] hover:scale-[1.01]"
                                >
                                    <MeetIcon />
                                    Schedule Strategy Call
                                </a>
                                <p className="text-center text-zinc-400 text-[10.5px] font-bold mt-4 tracking-wider uppercase select-none">
                                    SPLIT PAYMENT — 50% NOW, 50% UPON COMPLETION
                                </p>
                            </div>
                        </div>
                    </motion.div>

                </div>

            </div>
        </section>
    );
}
