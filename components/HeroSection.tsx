import React from "react";
import Link from "next/link";

export default function HeroSection() {
    return (
        <section
            className="hero-section w-full bg-white bg-cover bg-top sm:bg-[length:100%_auto] bg-no-repeat font-sans pt-20 pb-4 lg:pt-26 lg:pb-6 sm:bg-[center_-4rem] lg:bg-[center_-5rem]"
            style={{ backgroundImage: "url('/cloud-bg.png')" }}
        >
            <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-12">
                <div className="flex flex-col items-center justify-center gap-12 min-h-[360px]">
                    <div className="w-full flex flex-col justify-center items-center text-center">
                        {/* Interactive Badge Pill */}
                        <div className="flex justify-center mb-4">
                            <Link
                                href="/portfolio"
                                className="inline-flex items-center gap-2.5 p-1 pr-3.5 bg-zinc-100/90 hover:bg-zinc-200/60 border border-zinc-200/60 rounded-full text-zinc-700 text-[12px] sm:text-[13px] font-medium transition-all duration-300 shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:-translate-y-0.5 group"
                            >
                                <span className="flex items-center justify-center px-2 py-0.5 bg-white border border-zinc-200/60 rounded-full shadow-[0_1px_2px_rgba(0,0,0,0.03)] shrink-0">
                                    <img
                                        src="https://ik.imagekit.io/dypkhqxip/logo__1_?updatedAt=1781048454786"
                                        alt="Redlix Logo"
                                        className="h-[17px] w-auto object-contain"
                                    />
                                </span>
                                <span className="tracking-wide text-zinc-600 font-medium">50+ projects successfully launched</span>
                            </Link>
                        </div>
                        <h1 className="text-[36px] sm:text-[44px] lg:text-[52px] leading-[1.15] font-medium text-[#1E2022] tracking-tight mb-4">
                            Sleek IT solutions for growing brands.
                        </h1>
                        <p className="text-[15px] lg:text-[16px] text-[#5f6368] leading-relaxed mb-6 max-w-md mx-auto font-normal font-sans">
                            We design, build, and scale high-performance digital products and custom software.
                        </p>
                        <div className="flex flex-wrap items-center justify-center gap-4">
                            <a
                                href="https://cal.com/redlix.co.in"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center px-6 py-3 bg-[#1E2022] hover:bg-[#2C3036] text-white rounded-xl text-[14px] font-medium transition-all duration-300 shadow-[0_4px_12px_rgba(0,0,0,0.1)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.15)] hover:-translate-y-0.5"
                            >
                                <img
                                    src="https://www.gstatic.com/images/branding/productlogos/meet_2026/v2/web-96dp/logo_meet_2026_color_2x_web_96dp.png"
                                    alt="Google Meet Logo"
                                    className="w-[20px] h-[20px] mr-2.5 flex-shrink-0"
                                />
                                Book a Call
                            </a>
                            <Link
                                href="/portfolio"
                                className="flex items-center justify-center px-6 py-3 bg-white hover:bg-zinc-50 border border-zinc-200/80 text-[#1E2022] rounded-xl text-[14px] font-medium transition-all duration-300 hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)] hover:-translate-y-0.5"
                            >
                                View Work
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
