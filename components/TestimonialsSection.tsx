"use client";

import React from "react";
import { StaggerTestimonials } from "@/components/ui/stagger-testimonials";

export default function TestimonialsSection() {
    return (
        <section className="w-full bg-[#fafafa] py-10 lg:py-14 relative overflow-hidden border-t border-zinc-100">
            {/* Centered Testimonials Pill Badge */}
            <div className="flex justify-center mb-6 lg:mb-8 relative z-10">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-zinc-200/80 rounded-full text-[12px] font-medium text-zinc-700 shadow-[0_2px_8px_rgba(0,0,0,0.02)] select-none">
                    <svg className="w-3.5 h-3.5 text-zinc-800" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm9 7h-6v13h-2v-6h-2v6H9V9H3V7h18v2z" />
                    </svg>
                    Testimonials
                </span>
            </div>

            {/* Staggered Testimonials Port */}
            <div className="relative w-full z-10">
                <StaggerTestimonials />
            </div>
        </section>
    );
}
