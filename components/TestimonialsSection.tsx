"use client";

import React from "react";
import { StaggerTestimonials } from "@/components/ui/stagger-testimonials";

export default function TestimonialsSection() {
    return (
        <section className="w-full bg-[#fafafa] font-sans py-10 lg:py-14 text-black relative overflow-hidden border-t border-zinc-100">
            <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 mb-4 lg:mb-6 text-center">
                {/* Centered Badge */}
                <div className="flex justify-center mb-3">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-zinc-200/80 rounded-full text-[12px] font-medium text-zinc-700 shadow-[0_2px_8px_rgba(0,0,0,0.02)] select-none">
                        <svg className="w-3.5 h-3.5 text-zinc-800" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm9 7h-6v13h-2v-6h-2v6H9V9H3V7h18v2z" />
                        </svg>
                        Testimonials
                    </span>
                </div>

                {/* Header title */}
                <h2 className="text-[26px] sm:text-[32px] lg:text-[36px] font-bold text-[#202124] tracking-tight leading-tight max-w-xl mx-auto">
                    What tech companies say about working with us
                </h2>
                <p className="mt-2 text-zinc-600 text-xs sm:text-sm max-w-md mx-auto">
                    Click the navigation buttons or individual cards below to explore our clients' direct experiences.
                </p>
            </div>

            {/* Staggered Testimonials Port */}
            <div className="relative w-full z-10">
                <StaggerTestimonials />
            </div>
        </section>
    );
}
