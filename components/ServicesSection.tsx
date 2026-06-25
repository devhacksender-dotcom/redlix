import React from "react";
import Link from "next/link";
import { Sparkles, Globe, Smartphone, Cpu, Layers } from "lucide-react";

// Prepend high-fidelity official brand colored SVG logos inside technology pills using third party Simple Icons CDN.
function getPillIcon(pill: string) {
    const customUrlMap: Record<string, string> = {
        "Java": "https://upload.wikimedia.org/wikipedia/en/thumb/3/30/Java_programming_language_logo.svg/960px-Java_programming_language_logo.svg.png",
        "AWS": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Amazon_Web_Services_Logo.svg/960px-Amazon_Web_Services_Logo.svg.png?_=20170912170050",
        "CSS3": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/62/CSS3_logo.svg/1280px-CSS3_logo.svg.png"
    };

    if (customUrlMap[pill]) {
        return (
            <img
                src={customUrlMap[pill]}
                alt=""
                className="w-4 h-4 shrink-0 mr-1.5 object-contain"
                loading="lazy"
            />
        );
    }

    const slugMap: Record<string, string> = {
        "TypeScript": "typescript",
        "JavaScript": "javascript",
        "Python": "python",
        "Go": "go",
        "Rust": "rust",
        "C++": "cplusplus",
        "C": "c",
        "PHP": "php",
        "Ruby": "ruby",
        "Swift": "swift",
        "Kotlin": "kotlin",
        "HTML5": "html5",
        "Dart": "dart",
        "Zig": "zig",
        "React": "react",
        "Next.js": "nextdotjs",
        "Node.js": "nodedotjs",
        "PostgreSQL": "postgresql",
        "MongoDB": "mongodb",
        "Redis": "redis",
        "Docker": "docker",
        "Kubernetes": "kubernetes",
        "GraphQL": "graphql",
        "Prisma": "prisma",
        "Stripe": "stripe",
        "Firebase": "firebase",
        "Git": "git"
    };
    const slug = slugMap[pill];
    if (!slug) return null;
    return (
        <img
            src={`https://cdn.simpleicons.org/${slug}`}
            alt=""
            className="w-4 h-4 shrink-0 mr-1.5 object-contain"
            loading="lazy"
        />
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
                        <Layers className="w-3.5 h-3.5 text-zinc-500" strokeWidth={2} />
                        Services
                    </span>
                    <h2 className="text-[26px] sm:text-[30px] lg:text-[34px] font-semibold text-[#202124] tracking-tight leading-tight mb-6">
                        Web design & product engineering
                    </h2>
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
                                        className="text-[16px] sm:text-[18px] font-semibold tracking-tight leading-snug mb-3 shrink-0"
                                        style={{ color: service.titleColor }}
                                    >
                                        {service.title}
                                    </h3>
                                    <p
                                        className="text-[13px] leading-relaxed font-normal line-clamp-4 min-h-[5.5rem] flex-1"
                                        style={{ color: service.textColor }}
                                    >
                                        {service.description}
                                    </p>
                                </div>

                                {isSaaS ? (
                                    <div className="w-full h-[220px] shrink-0 mt-auto flex flex-col gap-2 pt-1 pb-3 overflow-hidden select-none">
                                        {/* Row 1 - Infinite Scroll Left */}
                                        <div className="w-full overflow-hidden relative">
                                            <div className="animate-marquee flex gap-2 whitespace-nowrap">
                                                <div className="flex gap-2 shrink-0">
                                                    {["TypeScript", "JavaScript", "Python", "Go", "Rust", "Swift"].map((pill) => (
                                                        <span key={`r1-1-${pill}`} className="inline-flex items-center px-3.5 py-1.5 bg-white border border-zinc-200/80 rounded-full text-[11px] font-semibold text-[#0A3D5C] shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
                                                            {getPillIcon(pill)}
                                                            {pill}
                                                        </span>
                                                    ))}
                                                </div>
                                                <div className="flex gap-2 shrink-0">
                                                    {["TypeScript", "JavaScript", "Python", "Go", "Rust", "Swift"].map((pill) => (
                                                        <span key={`r1-2-${pill}`} className="inline-flex items-center px-3.5 py-1.5 bg-white border border-zinc-200/80 rounded-full text-[11px] font-semibold text-[#0A3D5C] shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
                                                            {getPillIcon(pill)}
                                                            {pill}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                        {/* Row 2 - Infinite Scroll Right */}
                                        <div className="w-full overflow-hidden relative">
                                            <div className="animate-marquee-reverse flex gap-2 whitespace-nowrap">
                                                <div className="flex gap-2 shrink-0">
                                                    {["React", "Next.js", "Node.js", "GraphQL", "HTML5", "CSS3"].map((pill) => (
                                                        <span key={`r2-1-${pill}`} className="inline-flex items-center px-3.5 py-1.5 bg-white border border-zinc-200/80 rounded-full text-[11px] font-semibold text-[#0A3D5C] shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
                                                            {getPillIcon(pill)}
                                                            {pill}
                                                        </span>
                                                    ))}
                                                </div>
                                                <div className="flex gap-2 shrink-0">
                                                    {["React", "Next.js", "Node.js", "GraphQL", "HTML5", "CSS3"].map((pill) => (
                                                        <span key={`r2-2-${pill}`} className="inline-flex items-center px-3.5 py-1.5 bg-white border border-zinc-200/80 rounded-full text-[11px] font-semibold text-[#0A3D5C] shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
                                                            {getPillIcon(pill)}
                                                            {pill}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                        {/* Row 3 - Infinite Scroll Left */}
                                        <div className="w-full overflow-hidden relative">
                                            <div className="animate-marquee flex gap-2 whitespace-nowrap">
                                                <div className="flex gap-2 shrink-0">
                                                    {["PostgreSQL", "MongoDB", "Redis", "Prisma", "Stripe", "Firebase"].map((pill) => (
                                                        <span key={`r3-1-${pill}`} className="inline-flex items-center px-3.5 py-1.5 bg-white border border-zinc-200/80 rounded-full text-[11px] font-semibold text-[#0A3D5C] shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
                                                            {getPillIcon(pill)}
                                                            {pill}
                                                        </span>
                                                    ))}
                                                </div>
                                                <div className="flex gap-2 shrink-0">
                                                    {["PostgreSQL", "MongoDB", "Redis", "Prisma", "Stripe", "Firebase"].map((pill) => (
                                                        <span key={`r3-2-${pill}`} className="inline-flex items-center px-3.5 py-1.5 bg-white border border-zinc-200/80 rounded-full text-[11px] font-semibold text-[#0A3D5C] shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
                                                            {getPillIcon(pill)}
                                                            {pill}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                        {/* Row 4 - Infinite Scroll Right */}
                                        <div className="w-full overflow-hidden relative">
                                            <div className="animate-marquee-reverse flex gap-2 whitespace-nowrap">
                                                <div className="flex gap-2 shrink-0">
                                                    {["Kotlin", "Dart", "Java", "C++", "C", "Zig"].map((pill) => (
                                                        <span key={`r4-1-${pill}`} className="inline-flex items-center px-3.5 py-1.5 bg-white border border-zinc-200/80 rounded-full text-[11px] font-semibold text-[#0A3D5C] shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
                                                            {getPillIcon(pill)}
                                                            {pill}
                                                        </span>
                                                    ))}
                                                </div>
                                                <div className="flex gap-2 shrink-0">
                                                    {["Kotlin", "Dart", "Java", "C++", "C", "Zig"].map((pill) => (
                                                        <span key={`r4-2-${pill}`} className="inline-flex items-center px-3.5 py-1.5 bg-white border border-zinc-200/80 rounded-full text-[11px] font-semibold text-[#0A3D5C] shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
                                                            {getPillIcon(pill)}
                                                            {pill}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                        {/* Row 5 - Infinite Scroll Left */}
                                        <div className="w-full overflow-hidden relative">
                                            <div className="animate-marquee flex gap-2 whitespace-nowrap">
                                                <div className="flex gap-2 shrink-0">
                                                    {["Docker", "Kubernetes", "AWS", "Git", "PHP", "Ruby"].map((pill) => (
                                                        <span key={`r5-1-${pill}`} className="inline-flex items-center px-3.5 py-1.5 bg-white border border-zinc-200/80 rounded-full text-[11px] font-semibold text-[#0A3D5C] shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
                                                            {getPillIcon(pill)}
                                                            {pill}
                                                        </span>
                                                    ))}
                                                </div>
                                                <div className="flex gap-2 shrink-0">
                                                    {["Docker", "Kubernetes", "AWS", "Git", "PHP", "Ruby"].map((pill) => (
                                                        <span key={`r5-2-${pill}`} className="inline-flex items-center px-3.5 py-1.5 bg-white border border-zinc-200/80 rounded-full text-[11px] font-semibold text-[#0A3D5C] shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
                                                            {getPillIcon(pill)}
                                                            {pill}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
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
