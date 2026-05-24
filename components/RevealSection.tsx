"use client";

import React, { useRef, useState, useEffect } from "react";

export default function RevealSection() {
    const containerRef = useRef<HTMLDivElement>(null);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            if (!containerRef.current) return;
            const rect = containerRef.current.getBoundingClientRect();
            const viewportHeight = window.innerHeight;

            // Start reveal when the section top is 85% from viewport top
            // Complete reveal when the section top is 15% from viewport top
            const start = viewportHeight * 0.85;
            const end = viewportHeight * 0.15;
            const totalRange = start - end;
            const currentOffset = rect.top - end;

            let p = 1 - currentOffset / totalRange;
            p = Math.max(0, Math.min(1, p));
            setProgress(p);
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        window.addEventListener("resize", handleScroll);
        
        // Initial call
        handleScroll();

        return () => {
            window.removeEventListener("scroll", handleScroll);
            window.removeEventListener("resize", handleScroll);
        };
    }, []);

    const text =
        "With purposeful missions, strategic positioning, and human-centered design, we don't just create pretty visuals; we help your business convert visitors into users and users into super-fans.";

    const words = text.split(" ");

    return (
        <section
            ref={containerRef}
            className="w-full bg-[#EBFD75] py-24 sm:py-32 md:py-44 overflow-hidden relative border-b border-zinc-200/50"
        >
            {/* Background decorative flower outline */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
                <svg
                    className="absolute right-[-120px] md:right-[-60px] top-1/2 -translate-y-1/2 w-[550px] md:w-[750px] h-[550px] md:h-[750px] text-[#4c741a] opacity-[0.09]"
                    viewBox="0 0 200 200"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.2"
                >
                    <path d="M100,10 C105,60 145,60 190,100 C145,140 105,140 100,190 C95,140 55,140 10,100 C55,60 95,60 100,10 Z" />
                    <path d="M100,10 C118,65 175,82 190,100 C175,118 118,135 100,190 C82,135 25,118 10,100 C25,82 82,65 100,10 Z" />
                </svg>
            </div>

            <div className="max-w-[1200px] mx-auto px-6 sm:px-10 lg:px-16 relative z-10">
                <div className="max-w-[960px]">
                    <h3 className="text-[26px] sm:text-[30px] lg:text-[34px] font-semibold text-[#3b5e0f] tracking-tight leading-[1.25] sm:leading-[1.2]">
                        {words.map((word, i) => {
                            // Calculate opacity for each individual word based on total progress
                            const wordProgress = progress * words.length;
                            const active = Math.min(1, Math.max(0, wordProgress - i));
                            const opacity = 0.22 + active * 0.78;

                            return (
                                <span
                                    key={i}
                                    style={{ opacity }}
                                    className="inline-block mr-[0.22em] transition-opacity duration-150 ease-out"
                                >
                                    {word}
                                </span>
                            );
                        })}
                    </h3>
                </div>
            </div>
        </section>
    );
}
