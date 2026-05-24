import React from "react";

export default function FinalCTA() {
    return (
        <section className="w-full bg-[#fafafa] py-2 sm:py-3 lg:py-4 font-sans">
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* Red CTA Card with Rounded Corners */}
                <div className="w-full bg-[#E61E32] rounded-[24px] sm:rounded-[32px] px-6 py-6 sm:px-12 sm:py-8 lg:px-16 lg:py-10 text-center flex flex-col items-center justify-center relative overflow-hidden shadow-[0_12px_40px_rgba(230,30,50,0.12)]">
                    
                    {/* Background Subtle Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />

                    <div className="relative z-10 max-w-3xl">
                        <h2 className="text-[26px] sm:text-[32px] lg:text-[36px] font-bold text-white tracking-tight mb-2.5 leading-tight">
                            Build the future. <br className="sm:hidden" />
                            <span className="font-light text-white/90">Partner with Redlix.</span>
                        </h2>

                        <p className="text-[13.5px] sm:text-[15px] lg:text-[16px] text-white/95 leading-relaxed mb-6 font-light max-w-2xl mx-auto">
                            Join the ranks of leading enterprises transforming their operations with our high-performance systems and bespoke software architectures.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 w-full sm:w-auto">
                            <a
                                href="https://cal.com/redlix.co.in"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center bg-white hover:bg-zinc-100 text-[#E61E32] font-semibold text-[13.5px] px-6 py-3 transition-all duration-300 shadow-md hover:shadow-lg rounded-full w-full sm:w-auto hover:-translate-y-0.5"
                            >
                                Start Your Project
                            </a>
                            <a
                                href="https://cal.com/redlix.co.in"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center bg-transparent border-2 border-white text-white hover:bg-white/10 font-semibold text-[13.5px] px-6 py-3 transition-all duration-300 rounded-full w-full sm:w-auto hover:-translate-y-0.5"
                            >
                                Talk to Sales
                            </a>
                        </div>
                    </div>

                </div>
                
            </div>
        </section>
    );
}
