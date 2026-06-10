import React from "react";
import { Metadata } from "next";
import CorporateFooter from "@/components/CorporateFooter";
import BlogsSection from "@/components/BlogsSection";

export const metadata: Metadata = {
    title: "Resources",
    description: "Access a comprehensive library of enterprise insights, technical whitepapers, case studies, and open-source documentation from Redlix Studio.",
    keywords: ["IT Whitepapers", "Technical Documentation", "Case Studies Hyderabad", "Enterprise Tech Insights"],
};

export default function ResourcesPage() {
    return (
        <div className="flex flex-col min-h-screen bg-white font-sans">
            <main className="flex-grow">

                {/* Hero Header */}
                <section className="w-full bg-[#111] pt-8 pb-12 lg:pt-12 lg:pb-16">
                    <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-12">
                        <span className="text-[#E61E32] font-bold text-[13px] tracking-widest uppercase mb-4 block">
                            Knowledge Base
                        </span>
                        <h1 className="text-[32px] md:text-[42px] font-bold text-white leading-[1.1] tracking-tight mb-5">
                            Enterprise insights,<br />delivered.
                        </h1>
                        <p className="text-[14px] text-gray-400 leading-relaxed max-w-2xl border-l-[3px] border-[#E61E32] pl-6">
                            Explore our comprehensive library of whitepapers, case studies, open-source documentation, and <span className="bg-[#92E3A9] text-black px-1 font-medium">deep tech webinars</span> tailored for modern executives and lead engineers.
                        </p>
                    </div>
                </section>

                {/* Main Resource Grid */}
                <section className="w-full bg-[#fafafa] py-12 lg:py-16 border-b border-gray-200">
                    <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-12">

                        {/* Section Header */}
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-[24px] md:text-[28px] font-bold text-black tracking-tight">
                                Featured Whitepapers
                            </h2>
                            <div className="hidden md:flex gap-4">
                                <button className="bg-white border-2 border-black text-black px-6 py-2 text-[14px] font-bold hover:bg-black hover:text-white transition-colors">
                                    All Types
                                </button>
                                <button className="bg-transparent border-2 border-transparent text-[#5f6368] hover:text-black hover:border-black px-6 py-2 text-[14px] font-bold transition-all">
                                    Case Studies
                                </button>
                            </div>
                        </div>

                        {/* Resource Cards Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

                            {/* Card 1 */}
                            <div className="bg-white border border-gray-100 group cursor-pointer hover:shadow-2xl transition-all duration-300">
                                <div className="p-8 border-b border-gray-100 relative overflow-hidden bg-gray-50 h-[220px]">
                                    <div className="absolute top-0 right-0 p-4">
                                        <div className="bg-[#E61E32] text-white text-[10px] font-bold px-3 py-1 uppercase tracking-widest">
                                            PDF
                                        </div>
                                    </div>
                                    <h3 className="text-[24px] font-bold text-black leading-tight tracking-tight max-w-[80%] mt-8 group-hover:text-[#E61E32] transition-colors">
                                        The State of Multi-Cloud Architecture 2026.
                                    </h3>
                                </div>
                                <div className="p-8 pb-10 flex flex-col justify-between">
                                    <p className="text-[14px] text-[#5f6368] leading-relaxed mb-8 h-[60px] line-clamp-3">
                                        An exhaustive 45-page report on how Fortune 500 companies are mitigating vendor lock-in and distributing load globally.
                                    </p>
                                    <div className="flex items-center text-black font-semibold text-[13px] uppercase tracking-wider group-hover:text-[#E61E32] transition-colors">
                                        Download Now
                                        <svg className="w-4 h-4 ml-2 transform group-hover:translate-y-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            {/* Card 2 */}
                            <div className="bg-white border border-gray-100 group cursor-pointer hover:shadow-2xl transition-all duration-300">
                                <div className="p-8 border-b border-gray-100 relative overflow-hidden bg-gray-50 h-[220px]">
                                    <div className="absolute top-0 right-0 p-4">
                                        <div className="bg-black text-white text-[10px] font-bold px-3 py-1 uppercase tracking-widest">
                                            Video
                                        </div>
                                    </div>
                                    <h3 className="text-[24px] font-bold text-black leading-tight tracking-tight max-w-[80%] mt-8 group-hover:text-[#E61E32] transition-colors">
                                        Migrating Legacy CRMs: A Technical Deep Dive.
                                    </h3>
                                </div>
                                <div className="p-8 pb-10 flex flex-col justify-between">
                                    <p className="text-[14px] text-[#5f6368] leading-relaxed mb-8 h-[60px] line-clamp-3">
                                        Watch our lead architect dissect a successful 18-month migration of a monolithic 15-year old CRM ecosystem into microservices.
                                    </p>
                                    <div className="flex items-center text-black font-semibold text-[13px] uppercase tracking-wider group-hover:text-[#E61E32] transition-colors">
                                        Watch Recording
                                        <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            {/* Card 3 */}
                            <div className="bg-[#E61E32] text-white border border-[#E61E32] group cursor-pointer hover:shadow-2xl transition-all duration-300 relative overflow-hidden">
                                {/* Diagonal Lines Pattern Background */}
                                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #000 25%, transparent 25%, transparent 75%, #000 75%, #000), repeating-linear-gradient(45deg, #000 25%, transparent 25%, transparent 75%, #000 75%, #000)', backgroundPosition: '0 0, 10px 10px', backgroundSize: '20px 20px' }} />

                                <div className="p-8 border-b border-white/20 h-[220px] relative z-10">
                                    <h3 className="text-[28px] font-bold text-white leading-tight tracking-tight w-full mt-4">
                                        Looking for specific documentation?
                                    </h3>
                                </div>
                                <div className="p-8 pb-10 flex flex-col justify-between relative z-10">
                                    <p className="text-[14px] text-white/80 leading-relaxed mb-8 h-[60px]">
                                        Our engineering portal holds all technical specifications, API docs, and open-source contributions.
                                    </p>
                                    <div className="flex items-center text-white font-bold text-[13px] uppercase tracking-wider hover:text-black transition-colors">
                                        Developer Docs
                                        <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </section>

                {/* Import and reuse the BlogsSection component we made earlier! */}
                <div className="bg-white">
                    <BlogsSection />
                </div>

            </main>
            <CorporateFooter />
        </div>
    );
}
