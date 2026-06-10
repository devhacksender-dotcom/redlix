"use client";

import React from "react";
import Link from "next/link";
import { Youtube, Instagram, Linkedin, Facebook } from "lucide-react";

export default function CorporateFooter() {
    const year = new Date().getFullYear();

    const socialLinks = [
        {
            icon: <Youtube className="w-[18px] h-[18px]" />,
            href: "#",
            label: "YouTube"
        },
        {
            icon: (
                <svg className="w-[16px] h-[16px]" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
            ),
            href: "#",
            label: "X"
        },
        {
            icon: <Instagram className="w-[18px] h-[18px]" />,
            href: "#",
            label: "Instagram"
        },
        {
            icon: <Linkedin className="w-[18px] h-[18px]" />,
            href: "#",
            label: "LinkedIn"
        },
        {
            icon: <Facebook className="w-[18px] h-[18px]" />,
            href: "#",
            label: "Facebook"
        }
    ];

    const companyLinks = [
        { name: "About Us", href: "/about-us" },
        { name: "Our Work", href: "/portfolio" },
        { name: "Careers", href: "#" }
    ];

    const resourcesLinks = [
        { name: "Blog", href: "/blogs" },
        { name: "Help Center", href: "/support" },
        { name: "Brand Assets", href: "/brand-assets" }
    ];

    const caseStudies = [
        { name: "PisciDrop", href: "/portfolio/piscidrop" },
        { name: "Dhasha Media", href: "/portfolio/dhasha-media" },
        { name: "HSGA Telangana", href: "/portfolio/hsga-telangana" },
        { name: "Forge Digital Technologies", href: "/portfolio/forge-digital" },
        { name: "HUS System", href: "/portfolio/hus-system" },
        { name: "NSS CMRIT Chapter", href: "/portfolio/nss-cmrit" },
        { name: "Stories At Scale", href: "/portfolio/stories-at-scale" },
        { name: "National E-Commerce Platform", href: "/portfolio/national-ecommerce" }
    ];

    const terminalLinks = [
        { name: "Employee Portal", href: "/employee/login" },
        { name: "Admin Dashboard", href: "/admin/login" },
        { name: "Department Portal", href: "/department/login" }
    ];

    return (
        <footer className="w-full bg-[#070809] text-zinc-400 border-t border-zinc-900 font-sans">
            <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-16">
                
                {/* TOP GRID */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10 lg:gap-12 pb-2">
                    
                    {/* LOGO & SOCIALS COLUMN (Spans 2 columns on large screens) */}
                    <div className="lg:col-span-2 flex flex-col items-start gap-5">
                        <Link href="/" className="group inline-block">
                            <img
                                src="https://ik.imagekit.io/dypkhqxip/redlix%20new?updatedAt=1781042212493"
                                alt="Redlix Logo"
                                className="h-[44px] w-auto object-contain brightness-0 invert opacity-95 transition-transform duration-300 group-hover:scale-[1.01]"
                            />
                        </Link>

                        <p className="text-zinc-500 max-w-xs text-sm text-left leading-relaxed">
                            Web design, product engineering, and custom software from Redlix Studio.
                        </p>

                        {/* Social Links Row */}
                        <div className="flex gap-2.5">
                            {socialLinks.map((social) => (
                                <a
                                    key={social.label}
                                    href={social.href}
                                    aria-label={social.label}
                                    className="w-9 h-9 rounded-full bg-zinc-900/60 border border-zinc-800/80 hover:border-zinc-700 hover:text-white flex items-center justify-center transition-all duration-300"
                                >
                                    {social.icon}
                                </a>
                            ))}
                        </div>

                        {/* Contact Us Details */}
                        <div className="flex flex-col gap-1.5 mt-2">
                            <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">Contact us</span>
                            <div className="flex flex-col gap-0.5 text-[13.5px] text-zinc-400 font-mono">
                                <a href="tel:+916304889509" className="hover:text-white transition-colors">
                                    +91 6304889509
                                </a>
                                <a href="mailto:help.ckrdatapoint@gmail.com" className="hover:text-white transition-colors">
                                    help.ckrdatapoint@gmail.com
                                </a>
                                <a href="mailto:devhacksender@gmail.com" className="hover:text-white transition-colors">
                                    devhacksender@gmail.com
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* COMPANY COLUMN */}
                    <div className="flex flex-col gap-4 text-left">
                        <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">Company</span>
                        <ul className="flex flex-col gap-2.5 text-[14px]">
                            {companyLinks.map((item) => (
                                <li key={item.name}>
                                    <Link href={item.href} className="hover:text-white hover:underline transition-all duration-200">
                                        {item.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* RESOURCES COLUMN */}
                    <div className="flex flex-col gap-4 text-left">
                        <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">Resources</span>
                        <ul className="flex flex-col gap-2.5 text-[14px]">
                            {resourcesLinks.map((item) => (
                                <li key={item.name}>
                                    <Link href={item.href} className="hover:text-white hover:underline transition-all duration-200">
                                        {item.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* CASE STUDIES COLUMN */}
                    <div className="flex flex-col gap-4 text-left">
                        <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">Case Studies</span>
                        <ul className="flex flex-col gap-2 text-[14px]">
                            {caseStudies.map((item) => (
                                <li key={item.name} className="border-b border-zinc-900 pb-2 last:border-0 last:pb-0">
                                    <Link href={item.href} className="group flex items-center justify-between hover:text-white transition-all duration-200 text-left w-full py-0.5">
                                        <span>{item.name}</span>
                                        <span className="flex items-center justify-center w-[18px] h-[18px] rounded-full bg-[#E61E32]/10 border border-[#E61E32]/25 text-[#E61E32] opacity-75 group-hover:opacity-100 group-hover:bg-[#E61E32] group-hover:text-white transition-all duration-200 shrink-0 ml-2">
                                            <svg className="w-2.5 h-2.5 transform group-hover:translate-x-[0.5px] transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                            </svg>
                                        </span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* PORTAL COLUMN */}
                    <div className="flex flex-col gap-4 text-left">
                        <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">Portal</span>
                        <ul className="flex flex-col gap-2.5 text-[14px]">
                            {terminalLinks.map((item) => (
                                <li key={item.name}>
                                    <Link href={item.href} className="hover:text-white hover:underline transition-all duration-200">
                                        {item.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                </div>

                {/* MIDDLE SECTION (Separator Line & PWA App Section) */}
                <div className="border-t border-zinc-900 pt-10 mt-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    <div className="flex flex-col text-left">
                        <span className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1">Redlix Portal App</span>
                        <h3 className="text-white font-medium text-[16px] mb-1.5">Redlix Employee Terminal (PWA)</h3>
                        <p className="text-zinc-500 text-[13px] leading-relaxed max-w-xl">
                            Looking for our enterprise platforms? Use our product for Host Exams, Registrations, EMS, and LMS Software via{" "}
                            <a 
                                href="https://app.redlix.co.in" 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="text-[#E61E32] hover:text-[#ff1f34] hover:underline transition-colors font-medium"
                            >
                                app.redlix.co.in
                            </a>.
                        </p>
                    </div>
                    <div className="flex flex-col gap-2.5 shrink-0 w-full md:w-auto">
                        <Link 
                            href="/employee/login"
                            className="inline-flex items-center justify-center bg-[#E61E32] hover:bg-[#ff1f34] text-white px-5 py-2.5 text-[13px] font-semibold transition-all duration-300 shadow-[0_4px_12px_rgba(230,30,50,0.15)] hover:scale-[1.01] w-full md:w-[220px]"
                        >
                            <img src="https://ik.imagekit.io/dypkhqxip/logo__1_" alt="" className="w-4 h-4 object-contain mr-2 brightness-0 invert" />
                            Launch PWA App
                        </Link>
                        <Link 
                            href="/department/login"
                            className="inline-flex items-center justify-center bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-white px-5 py-2.5 text-[13px] font-semibold transition-all duration-300 hover:scale-[1.01] w-full md:w-[220px]"
                        >
                            <img src="https://ik.imagekit.io/dypkhqxip/logo__1_" alt="" className="w-4 h-4 object-contain mr-2 brightness-0 invert" />
                            Launch Partner App
                        </Link>
                    </div>
                </div>
            </div>

            {/* BOTTOM BAR LINKS */}
            <div className="border-t border-zinc-900 bg-[#040506] py-6 text-[13px] text-zinc-500">
                <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="order-2 md:order-1 font-mono text-[12.5px]">
                        © {year} Redlix Studio. All rights reserved.
                    </p>
                    <div className="order-1 md:order-2 flex flex-wrap justify-center gap-x-6 gap-y-2">
                        <Link href="/privacy" className="hover:text-zinc-300 hover:underline transition-colors py-1">
                            Privacy policy
                        </Link>
                        <Link href="/terms" className="hover:text-zinc-300 hover:underline transition-colors py-1">
                            Terms and conditions
                        </Link>
                        <Link href="/cookies" className="hover:text-zinc-300 hover:underline transition-colors py-1">
                            Cookies policy
                        </Link>
                        <Link href="/sitemap" className="hover:text-zinc-300 hover:underline transition-colors py-1">
                            Sitemap
                        </Link>
                    </div>
                </div>
            </div>

        </footer>
    );
}
