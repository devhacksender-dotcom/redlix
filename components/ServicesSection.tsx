import React from "react";
import Link from "next/link";
import { Sparkles, Globe, Smartphone, Cpu } from "lucide-react";

// Prepend custom micro-vector SVGs inside technology pills for a high-end designer finish.
function getPillIcon(pill: string) {
    switch (pill) {
        case "Next.js":
            return (
                <svg className="w-3 h-3 text-[#0A3D5C] shrink-0 mr-1.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                    <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-2 18h-1.5v-9h1.5v9zm6.5 0h-1.25l-3.25-5.25v5.25h-1.5v-9h1.25l3.25 5.25v-5.25h1.5v9z"/>
                </svg>
            );
        case "React":
            return (
                <svg className="w-3.5 h-3.5 text-[#0A3D5C] shrink-0 mr-1.5 animate-[spin_8s_linear_infinite]" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="6.5" aria-hidden>
                    <ellipse cx="50" cy="50" rx="15" ry="38" transform="rotate(30 50 50)" />
                    <ellipse cx="50" cy="50" rx="15" ry="38" transform="rotate(90 50 50)" />
                    <ellipse cx="50" cy="50" rx="15" ry="38" transform="rotate(150 50 50)" />
                    <circle cx="50" cy="50" r="6" fill="currentColor" />
                </svg>
            );
        case "PostgreSQL":
            return (
                <svg className="w-3.5 h-3.5 text-[#0A3D5C] shrink-0 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                </svg>
            );
        case "AWS Cloud":
            return (
                <svg className="w-3.5 h-3.5 text-[#0A3D5C] shrink-0 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                </svg>
            );
        case "Docker":
            return (
                <svg className="w-3.5 h-3.5 text-[#0A3D5C] shrink-0 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
            );
        case "Node.js Systems":
            return (
                <svg className="w-3.5 h-3.5 text-[#0A3D5C] shrink-0 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
            );
        case "AI Agent Integration":
            return (
                <svg className="w-3.5 h-3.5 text-[#0A3D5C] shrink-0 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 21l-.813-5.096L3 15l5.187-.813L9 9l.813 5.187L15 15l-5.187.813zM19.071 4.929l-.707 3.536-3.536.707 3.536.707.707 3.536.707-3.536 3.536-.707-3.536-.707-.707-3.536z" />
                </svg>
            );
        case "REST APIs":
            return (
                <svg className="w-3.5 h-3.5 text-[#0A3D5C] shrink-0 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
            );
        case "Stripe Payments":
            return (
                <svg className="w-3.5 h-3.5 text-[#0A3D5C] shrink-0 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
            );
        case "SaaS Systems":
            return (
                <svg className="w-3.5 h-3.5 text-[#0A3D5C] shrink-0 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
            );
        default:
            return null;
    }
}

const services = [
    {
        title: "Web Design & Development",
        description:
            "We build high-converting websites that look great and actually grow your business. Get a custom, fast, and SEO-ready site that turns traffic into revenue.",
        image: "https://ik.imagekit.io/dypkhqxip/dhashamedia",
        imageAlt: "Dhasha Media website preview",
        slug: "dhasha-media",
        icon: Globe,
        iconRound: false,
        bg: "#E8DCFF",
        titleColor: "#3B1F6E",
        textColor: "#5A3D8F",
    },
    {
        title: "Web and Mobile App Design",
        description:
            "We design and prototype powerful web and mobile applications that solve complex business problems. Get a highly functional, intuitive product engineered for exceptional performance and user retention.",
        image: "https://ik.imagekit.io/dypkhqxip/4PIEf1dh4xQBaKyTYGw4lTQNg.avif",
        imageAlt: "PisciDrop app preview",
        slug: "piscidrop",
        icon: Smartphone,
        iconRound: true,
        bg: "#D4F574",
        titleColor: "#1F3D0F",
        textColor: "#2F5218",
    },
    {
        title: "SaaS & Custom Software",
        description:
            "Stop waiting for slow developers and wasting lakhs of Rupees. We build production-ready SaaS platforms, custom CRM/ERPs, automation tools, and APIs tailored to your needs.",
        image: "https://ik.imagekit.io/dypkhqxip/hsga",
        imageAlt: "HSGA Telangana platform preview",
        slug: "hsga-telangana",
        icon: Cpu,
        iconRound: false,
        bg: "#A8E4FF",
        titleColor: "#0A3D5C",
        textColor: "#1A5A7A",
    },
];

export default function ServicesSection() {
    return (
        <section className="w-full bg-white font-sans py-12 lg:py-16 border-t border-zinc-100">
            <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-12">
                {/* Header — tag, headline, intro call (stacked, centered) */}
                <div className="flex flex-col items-center text-center mb-10 lg:mb-12">
                    <span className="inline-flex items-center gap-2 px-4 py-1.5 mb-5 bg-white border border-zinc-200/80 rounded-full text-[13px] font-medium text-zinc-700 shadow-[0_2px_8px_rgba(0,0,0,0.03)] select-none">
                        <Sparkles className="w-3.5 h-3.5 text-zinc-500" strokeWidth={2} />
                        Services
                    </span>
                    <div className="w-full overflow-x-auto scrollbar-none flex justify-center mb-6">
                        <h2 className="text-[26px] sm:text-[30px] lg:text-[34px] font-semibold text-[#202124] tracking-tight leading-none whitespace-nowrap">
                            Web design, product engineering, and custom software from Redlix Studio
                        </h2>
                    </div>
                    <a
                        href="https://cal.com/redlix.co.in"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2.5 px-6 py-3 bg-[#1E2022] hover:bg-[#2C3036] text-white rounded-xl text-[14px] font-semibold transition-all duration-300 shadow-[0_4px_12px_rgba(30,32,34,0.1)] cursor-pointer"
                    >
                        <img
                            src="https://www.gstatic.com/images/branding/productlogos/meet_2026/v2/web-96dp/logo_meet_2026_color_2x_web_96dp.png"
                            alt=""
                            className="w-[20px] h-[20px] shrink-0"
                        />
                        Intro call
                    </a>
                </div>

                {/* Cards — equal height */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
                    {services.map((service) => {
                        const Icon = service.icon;
                        const isFirst = service.slug === "dhasha-media";
                        const isSaaS = service.slug === "hsga-telangana";
                        
                        // Set dynamic dimensions. The first and second cards have larger images.
                        const isLargeImage = isFirst || service.slug === "piscidrop";
                        const containerHeight = isLargeImage ? "h-[260px]" : "h-[220px]";
                        const imageHeight = isLargeImage ? "h-[240px]" : "h-[200px]";
                        const maxWidth = isLargeImage ? "max-w-[360px]" : "max-w-[320px]";
                        
                        return (
                            <Link
                                key={service.slug}
                                href={`/portfolio/${service.slug}`}
                                className="group flex flex-col h-full min-h-[480px] sm:min-h-[520px] rounded-[32px] overflow-hidden transition-shadow duration-300 hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)] cursor-pointer"
                                style={{ backgroundColor: service.bg }}
                            >
                                <div className="flex flex-col flex-1 px-7 pt-7 pb-5 sm:px-8 sm:pt-8">
                                    <div
                                        className={`w-8 h-8 bg-[#1a1a1a] flex items-center justify-center mb-5 shrink-0 ${
                                            service.iconRound ? "rounded-full" : "rounded-[10px]"
                                        }`}
                                    >
                                        <Icon className="w-4.5 h-4.5 text-white" strokeWidth={2.2} />
                                    </div>
                                    <h3
                                        className="text-[18px] sm:text-[20px] font-semibold tracking-tight leading-snug mb-3 shrink-0"
                                        style={{ color: service.titleColor }}
                                    >
                                        {service.title}
                                    </h3>
                                    <p
                                        className="text-[14px] leading-relaxed font-normal line-clamp-4 min-h-[5.5rem] flex-1"
                                        style={{ color: service.textColor }}
                                    >
                                        {service.description}
                                    </p>
                                </div>

                                {isSaaS ? (
                                    <div className="w-full h-[220px] shrink-0 mt-auto flex flex-col gap-2 pt-1 pb-3 overflow-hidden select-none">
                                        {/* Row 1 */}
                                        <div className="flex gap-2 justify-start pl-3 whitespace-nowrap">
                                            {["Next.js", "React", "SaaS Systems"].map((pill) => (
                                                <span key={pill} className="inline-flex items-center px-3.5 py-1.5 bg-white/60 backdrop-blur-sm border border-white/80 rounded-full text-[11.5px] font-semibold text-[#0A3D5C] shadow-[0_2px_8px_rgba(10,61,92,0.04)]">
                                                    {getPillIcon(pill)}
                                                    {pill}
                                                </span>
                                            ))}
                                        </div>
                                        {/* Row 2 */}
                                        <div className="flex gap-2 justify-center whitespace-nowrap">
                                            {["PostgreSQL", "REST APIs", "Stripe Payments"].map((pill) => (
                                                <span key={pill} className="inline-flex items-center px-3.5 py-1.5 bg-white/60 backdrop-blur-sm border border-white/80 rounded-full text-[11.5px] font-semibold text-[#0A3D5C] shadow-[0_2px_8px_rgba(10,61,92,0.04)]">
                                                    {getPillIcon(pill)}
                                                    {pill}
                                                </span>
                                            ))}
                                        </div>
                                        {/* Row 3 */}
                                        <div className="flex gap-2 justify-end pr-3 whitespace-nowrap">
                                            {["Custom CRMs", "ERP Portals", "AWS Cloud"].map((pill) => (
                                                <span key={pill} className="inline-flex items-center px-3.5 py-1.5 bg-white/60 backdrop-blur-sm border border-white/80 rounded-full text-[11.5px] font-semibold text-[#0A3D5C] shadow-[0_2px_8px_rgba(10,61,92,0.04)]">
                                                    {getPillIcon(pill)}
                                                    {pill}
                                                </span>
                                            ))}
                                        </div>
                                        {/* Row 4 */}
                                        <div className="flex gap-2 justify-center whitespace-nowrap">
                                            {["Auth0 / Clerk", "Docker", "Node.js Systems"].map((pill) => (
                                                <span key={pill} className="inline-flex items-center px-3.5 py-1.5 bg-white/60 backdrop-blur-sm border border-white/80 rounded-full text-[11.5px] font-semibold text-[#0A3D5C] shadow-[0_2px_8px_rgba(10,61,92,0.04)]">
                                                    {getPillIcon(pill)}
                                                    {pill}
                                                </span>
                                            ))}
                                        </div>
                                        {/* Row 5 */}
                                        <div className="flex gap-2 justify-start pl-6 whitespace-nowrap">
                                            {["AI Agent Integration", "Real-time Dashboards"].map((pill) => (
                                                <span key={pill} className="inline-flex items-center px-3.5 py-1.5 bg-white/60 backdrop-blur-sm border border-white/80 rounded-full text-[11.5px] font-semibold text-[#0A3D5C] shadow-[0_2px_8px_rgba(10,61,92,0.04)]">
                                                    {getPillIcon(pill)}
                                                    {pill}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <div className={`relative w-full ${containerHeight} shrink-0 mt-auto`}>
                                        <div
                                            className={
                                                isFirst
                                                    ? `absolute bottom-0 right-0 w-[calc(100%-28px)] ${maxWidth} translate-x-8`
                                                    : `absolute bottom-0 left-1/2 -translate-x-1/2 w-[calc(100%-28px)] ${maxWidth}`
                                            }
                                        >
                                            <div
                                                className={
                                                    isFirst
                                                        ? "rounded-tl-[20px] overflow-hidden bg-white shadow-[0_-2px_20px_rgba(0,0,0,0.07),0_8px_28px_rgba(0,0,0,0.1)] border border-black/[0.06] border-b-0 border-r-0"
                                                        : "rounded-t-[20px] overflow-hidden bg-white shadow-[0_-2px_20px_rgba(0,0,0,0.07),0_8px_28px_rgba(0,0,0,0.1)] border border-black/[0.06] border-b-0"
                                                }
                                            >
                                                <img
                                                    src={service.image}
                                                    alt={service.imageAlt}
                                                    className={`w-full ${imageHeight} object-cover object-top block`}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </Link>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
