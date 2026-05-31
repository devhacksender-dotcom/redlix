"use client";

import React from "react";
import { StaggerTestimonials } from "@/components/ui/stagger-testimonials";

export default function TestimonialsSection() {
    return (
        <section className="w-full bg-[#fafafa] py-10 lg:py-14 relative overflow-hidden border-t border-zinc-100">
            {/* Staggered Testimonials Port */}
            <div className="relative w-full z-10">
                <StaggerTestimonials />
            </div>
        </section>
    );
}
