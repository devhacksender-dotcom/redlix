import React from "react";
import Link from "next/link";

export default function HeroSection() {
    return (
        <section
            className="hero-section w-full bg-white bg-[length:100%_auto] bg-no-repeat font-sans pt-20 pb-4 lg:pt-26 lg:pb-6 bg-[center_-3rem] sm:bg-[center_-4rem] lg:bg-[center_-5rem]"
            style={{ backgroundImage: "url('/cloud-bg.png')" }}
        >
            <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-12">
                <div className="flex flex-col-reverse lg:flex-row items-center justify-between gap-12 lg:gap-8 min-h-[360px]">
                    <div className="w-full lg:w-[45%] flex flex-col justify-center text-center lg:text-left">
                        {/* Interactive Badge Pill */}
                        <div className="flex justify-center lg:justify-start mb-4">
                            <Link
                                href="/portfolio"
                                className="inline-flex items-center gap-2 px-4 py-1.5 bg-white hover:bg-zinc-50 border border-zinc-200/80 rounded-full text-zinc-800 text-[13px] font-medium transition-all duration-300 shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.06)] hover:-translate-y-0.5 group"
                            >
                                <svg
                                    className="w-4 h-4 text-zinc-500 group-hover:text-amber-500 transition-colors"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.907c.961 0 1.36 1.246.588 1.81l-3.97 2.883a1 1 0 00-.364 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.971-2.883a1 1 0 00-1.18 0l-3.97 2.883c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.364-1.118l-3.97-2.883c-.773-.564-.373-1.81.588-1.81h4.906a1 1 0 00.951-.69l1.519-4.674z" />
                                </svg>
                                <span className="tracking-wide text-zinc-700">Redlix Studio: 50+ projects launched</span>
                                <svg
                                    className="w-3.5 h-3.5 text-zinc-400 group-hover:text-zinc-800 transition-colors transform group-hover:translate-x-0.5"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={2.5}
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                </svg>
                            </Link>
                        </div>
                        <h1 className="text-[36px] sm:text-[44px] lg:text-[52px] leading-[1.15] font-medium text-[#1E2022] tracking-tight mb-4">
                            Sleek IT solutions <br className="hidden lg:block" />
                            for growing brands.
                        </h1>
                        <p className="text-[15px] lg:text-[16px] text-[#5f6368] leading-relaxed mb-6 max-w-md mx-auto lg:mx-0 font-normal font-sans">
                            We design, build, and scale high-performance digital products and custom software.
                        </p>
                        <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
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

                    <div className="w-full lg:w-[55%] flex justify-center lg:justify-end">
                        <img
                            src="https://ik.imagekit.io/dypkhqxip/Static%20assets-cuate%20(1).svg"
                            alt="IT Services Illustration"
                            className="w-full max-w-[540px] lg:max-w-[620px] lg:-my-10 h-auto object-contain drop-shadow-sm"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
