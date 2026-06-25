"use client";

import React, { useState } from "react";
import Link from "next/link";

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    const navItems = [
        { name: "Home", href: "/" },
        { name: "Blog", href: "/blogs" },
        { name: "Work", href: "/portfolio" },
        { name: "FAQs", href: "/#faq" }
    ];

    return (
        <header className="fixed top-5 left-1/2 -translate-x-1/2 w-[calc(100%-2.5rem)] max-w-[480px] z-50 transition-all duration-300">
            <div className={`w-full bg-[#1E2022]/95 backdrop-blur-md border border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.25)] transition-all duration-300 ${isOpen ? "rounded-xl" : "rounded-lg"}`}>
                <div className="flex items-center justify-between px-5 py-1.5">

                    {/* LEFT SIDE: Image Logo */}
                    <div className="flex-shrink-0 flex items-center">
                        <Link href="/" className="flex items-center group">
                            <img
                                src="https://ik.imagekit.io/dypkhqxip/redlix%20new?updatedAt=1781042212493"
                                alt="Redlix Logo"
                                className="h-[30px] w-auto brightness-0 invert opacity-95 transition-transform duration-300 group-hover:scale-[1.03]"
                            />
                        </Link>
                    </div>

                    {/* CENTER: Menu Items */}
                    <div className="hidden md:flex items-center gap-4.5">
                        {navItems.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className="text-zinc-400 hover:text-white font-medium text-[13.5px] transition-colors duration-200 tracking-wide"
                            >
                                {item.name}
                            </Link>
                        ))}
                    </div>

                    {/* RIGHT SIDE: Intro Call & Mobile Toggle */}
                    <div className="flex items-center gap-4">
                        {/* Intro Call Button */}
                        <a
                            href="https://cal.com/redlix.co.in"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hidden md:flex items-center justify-center px-4.5 py-1.5 bg-gradient-to-b from-zinc-700/80 to-zinc-800/95 border border-white/10 hover:border-white/20 text-white rounded-md text-[13px] font-semibold tracking-wide transition-all duration-300 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_2px_8px_rgba(0,0,0,0.15)]"
                        >
                            {/* Google Meet official image logo */}
                            <img
                                src="https://www.gstatic.com/images/branding/productlogos/meet_2026/v2/web-96dp/logo_meet_2026_color_2x_web_96dp.png"
                                alt="Google Meet"
                                className="w-[16px] h-[16px] mr-2 flex-shrink-0"
                            />
                            Intro Call
                        </a>

                        {/* Mobile Menu Toggle Button */}
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="md:hidden flex items-center gap-1.5 px-3 py-1.5 bg-white/[0.04] hover:bg-white/[0.08] border border-white/5 hover:border-white/10 rounded-md text-zinc-300 hover:text-white focus:outline-none transition-all duration-300 cursor-pointer group"
                            aria-label="Toggle menu"
                        >
                            <span className="text-[10px] font-bold tracking-[0.2em] uppercase select-none text-zinc-400 group-hover:text-white transition-colors duration-200">
                                {isOpen ? "CLOSE" : "MENU"}
                            </span>
                            <div className="w-4 h-3 relative flex items-center justify-end">
                                <span className={`absolute right-0 h-[1.5px] bg-current rounded-full transition-all duration-300 ${isOpen ? "top-[5px] w-4 rotate-45" : "top-0 w-4"}`} />
                                <span className={`absolute right-0 h-[1.5px] bg-current rounded-full transition-all duration-300 ${isOpen ? "top-[5px] w-0 opacity-0" : "top-[5px] w-2.5 opacity-100"}`} />
                                <span className={`absolute right-0 h-[1.5px] bg-current rounded-full transition-all duration-300 ${isOpen ? "top-[5px] w-4 -rotate-45" : "top-[10px] w-3"}`} />
                            </div>
                        </button>
                    </div>
                </div>

                {/* Mobile Menu Dropdown */}
                <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? "max-h-[350px] opacity-100 border-t border-white/5 py-5 px-6" : "max-h-0 opacity-0 pointer-events-none"}`}>
                    <div className="flex flex-col gap-3">
                        {navItems.map((item, index) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                onClick={() => setIsOpen(false)}
                                className="group/item flex items-center justify-between text-zinc-400 hover:text-white font-medium text-[15px] transition-colors py-2 border-b border-white/5 last:border-b-0"
                                style={{ transitionDelay: `${index * 30}ms` }}
                            >
                                <span>{item.name}</span>
                                <svg className="w-3.5 h-3.5 opacity-0 -translate-x-2 group-hover/item:opacity-100 group-hover/item:translate-x-0 transition-all duration-300 text-[#E61E32]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                                </svg>
                            </Link>
                        ))}
                        <div className="w-full h-[1px] bg-white/5 my-2" />
                        <a
                            href="https://cal.com/redlix.co.in"
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => setIsOpen(false)}
                            className="flex items-center justify-center w-full py-3 bg-gradient-to-r from-[#E61E32] to-[#CC192A] hover:from-[#FF2E44] hover:to-[#E61E32] rounded-lg text-white text-[14px] font-bold transition-all duration-300 shadow-md shadow-[#E61E32]/10"
                        >
                            <img
                                src="https://www.gstatic.com/images/branding/productlogos/meet_2026/v2/web-96dp/logo_meet_2026_color_2x_web_96dp.png"
                                alt="Google Meet"
                                className="w-[18px] h-[18px] mr-2 flex-shrink-0"
                            />
                            Book Intro Call
                        </a>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Navbar;