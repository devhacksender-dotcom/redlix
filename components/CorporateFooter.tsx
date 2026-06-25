"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export default function CorporateFooter() {
    const year = new Date().getFullYear();
    const [email, setEmail] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        alert(`Thank you for subscribing: ${email}`);
        setEmail("");
    };

    return (
        <footer className="w-full bg-[#1E2022]/95 backdrop-blur-md text-zinc-400 border-t border-white/10 font-sans py-16 relative overflow-hidden text-left">
            <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
                
                {/* Main Content Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-12 border-b border-white/5">
                    
                    {/* Logo & Tagline (Col span 3) */}
                    <div className="lg:col-span-3 flex flex-col items-start gap-4 text-left">
                        <Link href="/" className="inline-block group">
                            <img
                                src="https://ik.imagekit.io/dypkhqxip/redlix%20new?updatedAt=1781042212493"
                                alt="Redlix Logo"
                                className="h-[56px] w-auto object-contain brightness-0 invert opacity-95 transition-transform duration-300 group-hover:scale-[1.02]"
                            />
                        </Link>
                        <p className="text-zinc-500 text-sm leading-relaxed max-w-[260px]">
                            Web design, product engineering, and custom software from Redlix Studio.
                        </p>
                    </div>

                    {/* Company Links (Col span 2) */}
                    <div className="lg:col-span-2 flex flex-col items-start text-left">
                        <span className="text-xs font-bold uppercase tracking-wider text-[#E61E32] mb-4 block">Company</span>
                        <ul className="flex flex-col gap-3 text-[14px]">
                            <li>
                                <Link href="/about-us" className="text-zinc-400 hover:text-white transition-colors block">
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link href="/portfolio" className="text-zinc-400 hover:text-white transition-colors block">
                                    Our Work
                                </Link>
                            </li>
                            <li>
                                <Link href="/coming-soon" className="text-zinc-400 hover:text-white transition-colors block">
                                    Careers
                                </Link>
                            </li>
                            <li>
                                <Link href="/employee/login" className="text-zinc-400 hover:text-white transition-colors block">
                                    Employee Portal
                                </Link>
                            </li>
                            <li>
                                <Link href="/department/login" className="text-zinc-400 hover:text-white transition-colors block">
                                    Department Portal
                                </Link>
                            </li>
                            <li>
                                <Link href="/#faq" className="text-zinc-400 hover:text-white transition-colors block">
                                    FAQs
                                </Link>
                            </li>
                            <li>
                                <Link href="/brand-assets" className="text-zinc-400 hover:text-white transition-colors block">
                                    Brand Assets
                                </Link>
                            </li>
                            <li>
                                <Link href="/support" className="text-zinc-400 hover:text-white transition-colors block">
                                    Contact
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Our Wings (Col span 2) */}
                    <div className="lg:col-span-2 flex flex-col items-start text-left">
                        <span className="text-xs font-bold uppercase tracking-wider text-[#E61E32] mb-4 block">Our Wings</span>
                        <ul className="flex flex-col gap-3 text-[14px]">
                            <li>
                                <Link href="/coming-soon" className="text-zinc-400 hover:text-white transition-colors block">
                                    Product Wing
                                </Link>
                            </li>
                            <li>
                                <Link href="/coming-soon" className="text-zinc-400 hover:text-white transition-colors block">
                                    IT Services Wing
                                </Link>
                            </li>
                            <li>
                                <Link href="/coming-soon" className="text-zinc-400 hover:text-white transition-colors block">
                                    Event Wing
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Socials Column (Col span 2) */}
                    <div className="lg:col-span-2 flex flex-col items-start text-left">
                        <span className="text-xs font-bold uppercase tracking-wider text-[#E61E32] mb-4 block">Socials</span>
                        <ul className="flex flex-col gap-3 text-[14px]">
                            <li>
                                <a href="mailto:help.ckrdatapoint@gmail.com" className="group flex items-center gap-1.5 text-zinc-400 hover:text-white transition-colors">
                                    <span>Email</span>
                                    <ArrowUpRight className="w-3.5 h-3.5 text-zinc-500 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" strokeWidth={3} />
                                </a>
                            </li>
                            <li>
                                <a href="https://www.instagram.com/redlix.co.in/" target="_blank" rel="noopener noreferrer" className="group flex items-center gap-1.5 text-zinc-400 hover:text-white transition-colors">
                                    <span>Instagram</span>
                                    <ArrowUpRight className="w-3.5 h-3.5 text-zinc-500 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" strokeWidth={3} />
                                </a>
                            </li>
                            <li>
                                <a href="https://www.linkedin.com/company/redline-agency-db/" target="_blank" rel="noopener noreferrer" className="group flex items-center gap-1.5 text-zinc-400 hover:text-white transition-colors">
                                    <span>LinkedIn</span>
                                    <ArrowUpRight className="w-3.5 h-3.5 text-zinc-500 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" strokeWidth={3} />
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Newsletter (Col span 3) */}
                    <div className="lg:col-span-3 flex flex-col items-start text-left">
                        <span className="text-xs font-bold uppercase tracking-wider text-[#E61E32] mb-4 block">Newsletter</span>
                        <p className="text-zinc-500 text-sm leading-relaxed max-w-[260px]">
                            Stay ahead with design & marketing tips and strategies that drive results.
                        </p>
                        
                        {/* Pill Input Container */}
                        <form onSubmit={handleSubmit} className="relative w-full max-w-[280px] mt-4">
                            <div className="flex items-center bg-[#17181A] border border-white/5 rounded-full pl-4 pr-1.5 py-1 flex items-center justify-between w-full shadow-[inset_0_1px_2px_rgba(0,0,0,0.2)] focus-within:border-white/15 transition-all duration-200">
                                <span className="text-zinc-600 mr-2 text-[14px] select-none">@</span>
                                <input
                                    type="email"
                                    placeholder="Enter your email..."
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="bg-transparent text-zinc-200 placeholder-zinc-600 text-sm outline-none w-full border-none p-0 focus:ring-0"
                                />
                                <button
                                    type="submit"
                                    aria-label="Subscribe"
                                    className="w-8 h-8 rounded-full bg-[#E61E32] hover:bg-[#ff1f34] text-white flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 shrink-0 group/btn"
                                >
                                    <svg className="w-4 h-4 transform group-hover/btn:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                    </svg>
                                </button>
                            </div>
                        </form>
                    </div>

                </div>

                {/* Bottom Bar Section */}
                <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-[13.5px] text-zinc-500">
                    <p className="order-2 md:order-1 font-mono text-[12.5px]">
                        © {year} Redlix Studio. All rights reserved.
                    </p>
                    <div className="order-1 md:order-2 flex flex-wrap justify-center gap-x-6 gap-y-2">
                        <Link href="/privacy" className="hover:text-zinc-300 transition-colors py-1">
                            Privacy Policy
                        </Link>
                        <Link href="/terms" className="hover:text-zinc-300 transition-colors py-1">
                            Terms of Service
                        </Link>
                        <Link href="/cookies" className="hover:text-zinc-300 transition-colors py-1">
                            Cookies Policy
                        </Link>
                        <Link href="/sitemap" className="hover:text-zinc-300 transition-colors py-1">
                            Sitemap
                        </Link>
                    </div>
                </div>

            </div>

            {/* Redlix Inline Logo — Red Watermark BG */}
            <div className="pointer-events-none absolute bottom-0 left-0 right-0 flex items-end justify-center overflow-hidden" aria-hidden="true">
                <img
                    src="https://ik.imagekit.io/dypkhqxip/redlix%20new?updatedAt=1781042212493"
                    alt=""
                    className="w-[90%] max-w-5xl opacity-[0.04] select-none object-contain"
                    style={{ filter: "brightness(0) invert(1)", transform: "translateY(18%)" }}
                />
            </div>
        </footer>
    );
}
