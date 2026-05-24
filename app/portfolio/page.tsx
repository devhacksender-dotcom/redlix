import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import CorporateFooter from "@/components/CorporateFooter";
import CallToAction from "@/components/CallToAction";

export const metadata: Metadata = {
    title: "Portfolio | Redlix Studio",
    description: "Explore our diverse portfolio of high-performance digital transformations. From enterprise systems to bespoke web experiences.",
};

const projects = [
    {
        title: "Dhasha Media",
        slug: "dhasha-media",
        category: "Internal Operations Engine",
        image: "https://ik.imagekit.io/dypkhqxip/ab%20(1).png",
        description: "Custom internal operations system for media agency workflows. Automated bookings and complex workflows, improving efficiency.",
    },
    {
        title: "HSGA Telangana",
        slug: "hsga-telangana",
        category: "Government Infrastructure",
        image: "https://ik.imagekit.io/dypkhqxip/Untitled%20design%20(1).png",
        description: "Designed and developed the official HSGA Telangana landing page. Elevated digital presence with fast, accessible design.",
    },
    {
        title: "SmartFit AI",
        slug: "smartfit",
        category: "AI Fitness & Wellness",
        image: "https://ik.imagekit.io/dypkhqxip/smartfitai",
        description: "AI-powered fitness platform delivering custom training programs and real-time posture analysis.",
    },
    {
        title: "HUS System",
        slug: "hus-system",
        category: "Government Infrastructure",
        image: "https://ik.imagekit.io/dypkhqxip/Untitled%20design.png",
        description: "Robust system engineered for large-scale state digital infrastructure. Precision engineering for complex governance use cases.",
    },
    {
        title: "NSS CMRIT Chapter",
        slug: "nss-cmrit",
        category: "Educational Organization",
        image: "https://ik.imagekit.io/dypkhqxip/ab%20(4).png",
        description: "Website built for the student chapter with improved design and UX. Boosted interaction and conversion with fast loading and intuitive UX.",
    },
    {
        title: "National E-Commerce Platform",
        slug: "national-ecommerce",
        category: "Retail & Commerce",
        image: "https://ik.imagekit.io/dypkhqxip/ab%20(2).png",
        description: "High-conversion online retail store with real-time inventory synchronization. Delivered seamless global checkout and multi-currency support.",
    },
];

export default function PortfolioPage() {
    return (
        <div className="flex flex-col min-h-screen bg-white font-sans text-black pt-20">
            <main className="flex-grow">
                {/* Header Section */}
                <section className="bg-white py-16 lg:py-24 border-b border-gray-100">
                    <div className="max-w-[1500px] mx-auto px-6 lg:px-12 text-center md:text-left">
                        <span className="text-[#E61E32] font-medium text-[11px] uppercase tracking-[0.3em] mb-4 block">Our Work</span>
                        <h1 className="text-[36px] md:text-[48px] lg:text-[56px] font-medium tracking-tight text-[#202124] leading-tight mb-6 uppercase">
                            Portfolio
                        </h1>
                        <p className="text-[16px] md:text-[18px] text-[#5f6368] leading-relaxed max-w-2xl font-light">
                            A showcase of our precision-engineered digital products, enterprise architectures, and bespoke software solutions designed for high-performance impact.
                        </p>
                    </div>
                </section>

                {/* Projects Grid */}
                <section className="py-16 lg:py-24">
                    <div className="max-w-[1500px] mx-auto px-6 lg:px-12">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
                            {projects.map((project, index) => (
                                <Link
                                    href={`/portfolio/${project.slug}`}
                                    key={index}
                                    className="group block relative aspect-[4/5] bg-gray-100 border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500"
                                >
                                    <img
                                        src={project.image}
                                        alt={project.title}
                                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out grayscale group-hover:grayscale-0"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />

                                    <div className="absolute inset-0 p-8 flex flex-col justify-end">
                                        <span className="text-[11px] font-bold text-white/70 uppercase tracking-widest mb-2">
                                            {project.category}
                                        </span>
                                        <h3 className="text-[24px] font-medium text-white tracking-tight mb-2">
                                            {project.title}
                                        </h3>
                                        <p className="text-[14px] text-white/70 leading-relaxed line-clamp-2 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 font-light">
                                            {project.description}
                                        </p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>

                <CallToAction />
            </main>
            <CorporateFooter />
        </div>
    );
}
