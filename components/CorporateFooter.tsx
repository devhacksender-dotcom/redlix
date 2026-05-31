import React from "react";
import Link from "next/link";
import { CommitsGrid } from "@/components/ui/commits-grid";

export default function CorporateFooter() {
    return (
        <footer className="w-full bg-[#0C0D0E] font-sans text-zinc-400 pt-16 pb-12 border-t border-zinc-900">
            <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* Main Split Grid */}
                <div className="flex flex-col md:flex-row justify-between gap-12 md:gap-16 pb-12">
                    
                    {/* Left Side: Brand, Socials & Clutch Review */}
                    <div className="flex flex-col items-start text-left max-w-xs">
                        
                        {/* Redlix Logo Only */}
                        <Link href="/" className="group mb-4 inline-block">
                            <img
                                src="https://ik.imagekit.io/dypkhqxip/redlixlogo?updatedAt=1777318254456"
                                alt="Redlix Logo"
                                className="h-[48px] w-auto brightness-0 invert opacity-95 transition-transform duration-300 group-hover:scale-[1.05]"
                            />
                        </Link>

                        {/* Social Links */}
                        <div className="flex items-center gap-4 text-zinc-400 mt-2">
                            <a href="#" className="hover:text-white transition-colors" aria-label="LinkedIn">
                                <svg className="w-[16px] h-[16px]" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                                </svg>
                            </a>
                            <a href="#" className="hover:text-white transition-colors" aria-label="X">
                                <svg className="w-[15px] h-[15px]" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                </svg>
                            </a>
                            <a href="#" className="hover:text-white transition-colors" aria-label="Instagram">
                                <svg className="w-[16px] h-[16px]" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                                </svg>
                            </a>
                        </div>


                    </div>

                    {/* Right Side: Columns Links */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-10 md:gap-16">
                        
                        {/* Column 1: Quick Links */}
                        <div className="flex flex-col gap-4 text-left">
                            <h4 className="text-[13px] font-medium text-white tracking-wide">Quick Links</h4>
                            <ul className="flex flex-col gap-2.5 text-[13px] text-zinc-400">
                                <li><Link href="/" className="hover:text-white transition-colors">Services</Link></li>
                                <li><Link href="/portfolio" className="hover:text-white transition-colors">Work</Link></li>
                                <li><Link href="/#pricing" className="hover:text-white transition-colors">Plans</Link></li>
                                <li><Link href="/resources" className="hover:text-white transition-colors">Blog</Link></li>
                                <li><Link href="/#faq" className="hover:text-white transition-colors">FAQ</Link></li>
                                <li><Link href="/resources" className="hover:text-white transition-colors">Resources</Link></li>
                            </ul>
                        </div>

                        {/* Column 2: Case Studies */}
                        <div className="flex flex-col gap-4 text-left">
                            <h4 className="text-[13px] font-medium text-white tracking-wide">Case Studies</h4>
                            <ul className="flex flex-col gap-2.5 text-[13px] text-zinc-400">
                                <li><Link href="/portfolio/piscidrop" className="hover:text-white transition-colors">PisciDrop : Website</Link></li>
                                <li><Link href="/portfolio/dhasha-media" className="hover:text-white transition-colors">Dhasha : Product</Link></li>
                                <li><Link href="/portfolio/hsga-telangana" className="hover:text-white transition-colors">HSGA : Portal</Link></li>
                                <li><Link href="/portfolio/forge-digital-technologies" className="hover:text-white transition-colors">Forge : System</Link></li>
                            </ul>
                        </div>

                        {/* Column 3: Legal */}
                        <div className="flex flex-col gap-4 text-left">
                            <h4 className="text-[13px] font-medium text-white tracking-wide">Legal</h4>
                            <ul className="flex flex-col gap-2.5 text-[13px] text-zinc-400">
                                <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                                <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
                                <li><a href="mailto:help.ckrdatapoint@gmail.com" className="hover:text-white transition-colors">Support</a></li>
                            </ul>
                        </div>

                    </div>

                </div>

                {/* Divider */}
                <div className="w-full h-[1px] bg-zinc-900 mb-8" />

                {/* Bottom Row */}
                <div className="flex flex-col items-center gap-6 mt-2 select-none">
                    <div className="text-[12px] text-zinc-500 font-medium text-center">
                        Redlix &copy; 2026 All Rights Reserved
                    </div>
                    <div className="w-full max-w-md flex justify-center opacity-85 hover:opacity-100 transition-opacity duration-300">
                        <CommitsGrid text="REDLIX" />
                    </div>
                </div>

            </div>
        </footer>
    );
}
