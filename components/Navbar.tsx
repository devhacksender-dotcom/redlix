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
        <header className="fixed top-5 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-[500px] z-50 transition-all duration-300">
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
                            className="md:hidden flex items-center justify-center p-2 text-zinc-400 hover:text-white focus:outline-none transition-colors duration-200"
                            aria-label="Toggle menu"
                        >
                            <div className="w-6 h-5 flex flex-col justify-between items-end relative">
                                <span className={`w-6 h-0.5 bg-current rounded-full transition-all duration-300 origin-right ${isOpen ? "rotate-45 translate-y-[2px] -translate-x-[2px]" : ""}`} />
                                <span className={`w-4 h-0.5 bg-current rounded-full transition-all duration-300 ${isOpen ? "opacity-0 w-0" : ""}`} />
                                <span className={`w-6 h-0.5 bg-current rounded-full transition-all duration-300 origin-right ${isOpen ? "-rotate-45 -translate-y-[2px] -translate-x-[2px]" : ""}`} />
                            </div>
                        </button>
                    </div>
                </div>

                {/* Mobile Menu Dropdown */}
                <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? "max-h-[300px] opacity-100 border-t border-white/5 py-4 px-6" : "max-h-0 opacity-0 pointer-events-none"}`}>
                    <div className="flex flex-col gap-4">
                        {navItems.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                onClick={() => setIsOpen(false)}
                                className="text-zinc-400 hover:text-white font-medium text-[15px] transition-colors py-1"
                            >
                                {item.name}
                            </Link>
                        ))}
                        <div className="w-full h-[1px] bg-white/5 my-1" />
                        <a
                            href="https://cal.com/redlix.co.in"
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => setIsOpen(false)}
                            className="flex items-center justify-center w-full py-3 bg-white/[0.08] hover:bg-white/[0.12] border border-white/15 rounded-lg text-white text-[14.5px] font-semibold transition-all duration-300"
                        >
                            <img
                                src="https://www.gstatic.com/images/branding/productlogos/meet_2026/v2/web-96dp/logo_meet_2026_color_2x_web_96dp.png"
                                alt="Google Meet"
                                className="w-[20px] h-[20px] mr-2.5 flex-shrink-0"
                            />
                            Intro Call
                        </a>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Navbar;