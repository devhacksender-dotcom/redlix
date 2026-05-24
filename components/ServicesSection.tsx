import React from "react";
import Link from "next/link";
import { Sparkles } from "lucide-react";

function IconWebDev() {
    return (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
            <path d="M8 1L15 8L8 15L1 8L8 1Z" fill="white" fillOpacity="0.9" />
            <path d="M8 4L12 8L8 12L4 8L8 4Z" fill="#1a1a1a" />
        </svg>
    );
}

function IconMobile() {
    return (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
            {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
                <circle
                    key={deg}
                    cx="8"
                    cy="8"
                    r="1.15"
                    fill="white"
                    transform={`rotate(${deg} 8 8) translate(0 -4.5)`}
                />
            ))}
        </svg>
    );
}

function IconSoftware() {
    return (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M5 4L2 8L5 12" />
            <path d="M11 4L14 8L11 12" />
            <path d="M9.5 3L6.5 13" />
        </svg>
    );
}

const services = [
    {
        title: "Web Design & Development",
        description:
            "We build high-converting websites that look great and actually grow your business. Get a custom, fast, and SEO-ready site that turns traffic into revenue.",
        image: "https://ik.imagekit.io/dypkhqxip/dhashamedia",
        imageAlt: "Dhasha Media website preview",
        slug: "dhasha-media",
        icon: IconWebDev,
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
        icon: IconMobile,
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
        icon: IconSoftware,
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
                    <span className="inline-flex items-center gap-2 px-4 py-1.5 mb-5 bg-white border border-zinc-200/80 rounded-full text-[13px] font-medium text-zinc-700 shadow-[0_2px_8px_rgba(0,0,0,0.03)]">
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
                        className="inline-flex items-center justify-center gap-2.5 px-6 py-3 bg-[#1E2022] hover:bg-[#2C3036] text-white rounded-xl text-[14px] font-semibold transition-all duration-300 shadow-[0_4px_12px_rgba(0,0,0,0.1)]"
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
                                className="group flex flex-col h-full min-h-[480px] sm:min-h-[520px] rounded-[32px] overflow-hidden transition-shadow duration-300 hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)]"
                                style={{ backgroundColor: service.bg }}
                            >
                                <div className="flex flex-col flex-1 px-7 pt-7 pb-5 sm:px-8 sm:pt-8">
                                    <div
                                        className={`w-8 h-8 bg-[#1a1a1a] flex items-center justify-center mb-5 shrink-0 ${
                                            service.iconRound ? "rounded-full" : "rounded-[10px]"
                                        }`}
                                    >
                                        <Icon />
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
                                                <span key={pill} className="px-3.5 py-1.5 bg-white/60 backdrop-blur-sm border border-white/80 rounded-full text-[11.5px] font-semibold text-[#0A3D5C] shadow-[0_2px_8px_rgba(10,61,92,0.04)]">
                                                    {pill}
                                                </span>
                                            ))}
                                        </div>
                                        {/* Row 2 */}
                                        <div className="flex gap-2 justify-center whitespace-nowrap">
                                            {["PostgreSQL", "REST APIs", "Stripe Payments"].map((pill) => (
                                                <span key={pill} className="px-3.5 py-1.5 bg-white/60 backdrop-blur-sm border border-white/80 rounded-full text-[11.5px] font-semibold text-[#0A3D5C] shadow-[0_2px_8px_rgba(10,61,92,0.04)]">
                                                    {pill}
                                                </span>
                                            ))}
                                        </div>
                                        {/* Row 3 */}
                                        <div className="flex gap-2 justify-end pr-3 whitespace-nowrap">
                                            {["Custom CRMs", "ERP Portals", "AWS Cloud"].map((pill) => (
                                                <span key={pill} className="px-3.5 py-1.5 bg-white/60 backdrop-blur-sm border border-white/80 rounded-full text-[11.5px] font-semibold text-[#0A3D5C] shadow-[0_2px_8px_rgba(10,61,92,0.04)]">
                                                    {pill}
                                                </span>
                                            ))}
                                        </div>
                                        {/* Row 4 */}
                                        <div className="flex gap-2 justify-center whitespace-nowrap">
                                            {["Auth0 / Clerk", "Docker", "Node.js Systems"].map((pill) => (
                                                <span key={pill} className="px-3.5 py-1.5 bg-white/60 backdrop-blur-sm border border-white/80 rounded-full text-[11.5px] font-semibold text-[#0A3D5C] shadow-[0_2px_8px_rgba(10,61,92,0.04)]">
                                                    {pill}
                                                </span>
                                            ))}
                                        </div>
                                        {/* Row 5 */}
                                        <div className="flex gap-2 justify-start pl-6 whitespace-nowrap">
                                            {["AI Agent Integration", "Real-time Dashboards"].map((pill) => (
                                                <span key={pill} className="px-3.5 py-1.5 bg-white/60 backdrop-blur-sm border border-white/80 rounded-full text-[11.5px] font-semibold text-[#0A3D5C] shadow-[0_2px_8px_rgba(10,61,92,0.04)]">
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
