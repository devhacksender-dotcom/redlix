"use client";

import React, { useRef, useEffect } from "react";

const testimonials = [
    {
        quote: "Working with Redlix was a total game-changer. They built us a custom client management system that streamlined our operations and saved us hours of manual effort.",
        author: "Dhanush Reddy",
        role: "Founder, Dhasha Media",
        avatar: "https://res.cloudinary.com/dsqqrpzfl/image/upload/v1770931011/Screenshot_2026-02-13_at_02.45.59_kw8pih.png",
    },
    {
        quote: "Redlix has been an exceptional partner. They took the time to understand our goals and delivered a solution that exceeded our expectations in every way.",
        author: "Harshith Sai Tunguntla",
        role: "CEO, SAS",
        avatar: "https://res.cloudinary.com/dsqqrpzfl/image/upload/v1771184658/Screenshot_2026-02-16_at_01.14.02_btxipo.png",
    },
    {
        quote: "Redlix delivered a modern, fast, and accessible digital platform for our state initiatives. Their attention to detail, accessibility, and performance was truly exceptional.",
        author: "HSGA Telangana",
        role: "Government Infrastructure",
        avatar: "https://res.cloudinary.com/dq2suftps/image/upload/v1722516854/logo_bivaq2.jpg",
    },
    {
        quote: "An incredible collaboration that delivered beyond expectations. Redlix was professional, highly responsive, and transformed our vision into a beautiful, functional platform.",
        author: "NSS CMRIT",
        role: "Student Chapter",
        avatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSiY63DjvYa-bL8ci8s5_KTiLm_9Mw_Wy0Xdw&s",
    },
    {
        quote: "Our user engagement doubled since launch. The clean design, fast loading times, and intuitive experience Redlix created transformed how members interact with our platform.",
        author: "Jaswanth Sonti",
        role: "Founder, Student Forge",
        avatar: "https://res.cloudinary.com/dsqqrpzfl/image/upload/v1771184951/Screenshot_2026-02-16_at_01.18.59_yodn7t.png",
    },
    {
        quote: "The precision engineering and attention to detail in our platform is remarkable. It handles complex student management and coordination seamlessly.",
        author: "HSGA CMRIT",
        role: "HSGA Chapter",
        avatar: "https://res.cloudinary.com/dq2suftps/image/upload/v1722516854/logo_bivaq2.jpg",
    },
];

const extendedTestimonials = [...testimonials, ...testimonials, ...testimonials, ...testimonials];

export default function TestimonialsSection() {
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const container = scrollContainerRef.current;
        if (!container) return;

        let animationFrameId: number;
        let isHovered = false;
        let scrollPos = container.scrollLeft;
        let lastTime = performance.now();

        const handleMouseEnter = () => {
            isHovered = true;
        };
        const handleMouseLeave = () => {
            isHovered = false;
            // Sync when leaving hover
            scrollPos = container.scrollLeft;
        };

        container.addEventListener('mouseenter', handleMouseEnter);
        container.addEventListener('mouseleave', handleMouseLeave);

        const scrollStep = (timestamp: number) => {
            if (container) {
                if (!isHovered) {
                    const elapsed = timestamp - lastTime;
                    
                    // Move at a constant velocity of 50px/sec (0.05px/ms)
                    scrollPos += 0.05 * elapsed;
                    
                    // Wrap back if reached end
                    if (scrollPos >= container.scrollWidth - container.clientWidth - 10) {
                        scrollPos = 0;
                    }
                    
                    container.scrollLeft = Math.round(scrollPos);
                } else {
                    // Sync scroll position continuously during hover
                    scrollPos = container.scrollLeft;
                }
            }
            lastTime = timestamp;
            animationFrameId = requestAnimationFrame(scrollStep);
        };

        animationFrameId = requestAnimationFrame(scrollStep);

        return () => {
            cancelAnimationFrame(animationFrameId);
            container.removeEventListener('mouseenter', handleMouseEnter);
            container.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, []);

    return (
        <section className="w-full bg-[#fafafa] font-sans py-12 lg:py-16 text-black relative overflow-hidden border-t border-zinc-100">
            
            <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 mb-8 lg:mb-12 text-center">
                
                {/* Centered Badge */}
                <div className="flex justify-center mb-4">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-zinc-200/80 rounded-full text-[12px] font-medium text-zinc-700 shadow-[0_2px_8px_rgba(0,0,0,0.02)] select-none">
                        <svg className="w-3.5 h-3.5 text-zinc-800" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm9 7h-6v13h-2v-6h-2v6H9V9H3V7h18v2z" />
                        </svg>
                        Testimonials
                    </span>
                </div>

                {/* Header title */}
                <h2 className="text-[26px] sm:text-[30px] lg:text-[34px] font-semibold text-[#202124] tracking-tight leading-tight max-w-xl mx-auto">
                    What tech companies say about working with us
                </h2>
            </div>

            {/* Scrolling Cards Port */}
            <div className="relative w-full z-10">
                <div
                    ref={scrollContainerRef}
                    className="flex overflow-x-auto gap-5 px-4 sm:px-6 lg:px-8 pb-5"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    <style dangerouslySetInnerHTML={{
                        __html: `
                        div::-webkit-scrollbar {
                            display: none;
                        }
                    `}} />

                    {extendedTestimonials.map((testimonial, index) => (
                        <div
                            key={index}
                            className="flex-none w-[320px] sm:w-[440px] lg:w-[480px] bg-white p-7 sm:p-8 border border-zinc-200/60 rounded-[24px] flex flex-col justify-between relative group hover:border-zinc-300 hover:bg-[#fcfcfc] transition-all duration-300 shadow-[0_4px_24px_rgba(0,0,0,0.02)]"
                        >
                            <div>
                                <p className="text-[14px] sm:text-[15px] lg:text-[16px] text-zinc-700 leading-relaxed font-normal mb-6 select-none">
                                    &ldquo;{testimonial.quote}&rdquo;
                                </p>
                            </div>

                            <div className="flex items-center gap-3.5 mt-auto">
                                <img
                                    src={testimonial.avatar}
                                    alt={testimonial.author}
                                    className="w-11 h-11 object-cover rounded-xl border border-zinc-200/50 pointer-events-none"
                                />
                                <div className="select-none text-left">
                                    <h4 className="text-[13.5px] font-semibold text-zinc-950 mb-0.5 pointer-events-none">
                                        {testimonial.author}
                                    </h4>
                                    <span className="text-[12px] text-zinc-500 font-normal pointer-events-none">
                                        {testimonial.role}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

        </section>
    );
}
