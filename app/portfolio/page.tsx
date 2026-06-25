import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import CorporateFooter from "@/components/CorporateFooter";
import CallToAction from "@/components/CallToAction";

export const metadata: Metadata = {
    title: "Portfolio",
    description: "Explore our diverse portfolio of high-performance digital transformations. From enterprise systems to bespoke web experiences.",
};

const projects = [
    {
        title: "PisciDrop",
        slug: "piscidrop",
        category: "Logistics & Supply Chain",
        image: "https://ik.imagekit.io/dypkhqxip/picsidrop",
        description: "Redlix built our end-to-end aquaculture logistics platform with real-time tracking, automated dispatch, and supply chain analytics that transformed our delivery operations.",
        bgColor: "bg-[#fff7ed]", // Soft Peach
        borderColor: "border-[#fed7aa]/60",
        textColor: "text-[#7c2d12]",
        catColor: "text-[#c2410c]/80",
        descColor: "text-[#9a3412]/80",
    },
    {
        title: "Dhasha Media",
        slug: "dhasha-media",
        category: "Internal Operations Engine",
        image: "https://ik.imagekit.io/dypkhqxip/dhashamedia",
        description: "Custom internal operations system for media agency workflows. Automated bookings and complex workflows, improving efficiency.",
        bgColor: "bg-[#fff1f2]", // Soft Rose
        borderColor: "border-[#fecdd3]/60",
        textColor: "text-[#881337]",
        catColor: "text-[#be123c]/80",
        descColor: "text-[#9f1239]/80",
    },
    {
        title: "HSGA Telangana",
        slug: "hsga-telangana",
        category: "Government Infrastructure",
        image: "https://ik.imagekit.io/dypkhqxip/hsga",
        description: "Designed and developed the official HSGA Telangana landing page. Elevated digital presence with fast, accessible design.",
        bgColor: "bg-[#eff6ff]", // Soft Blue
        borderColor: "border-[#dbeafe]/60",
        textColor: "text-[#1e3a8a]",
        catColor: "text-[#1d4ed8]/80",
        descColor: "text-[#1e40af]/80",
    },
    {
        title: "Forge Digital Technologies",
        slug: "forge-digital",
        category: "Fintech Operations Architecture",
        image: "https://ik.imagekit.io/dypkhqxip/fdt",
        description: "Next-generation software systems and custom API architectures built for global financial enterprises. Streamlining asset management and scaling transaction volumes.",
        bgColor: "bg-[#f5f3ff]", // Soft Lavender
        borderColor: "border-[#ddd6fe]/60",
        textColor: "text-[#4c1d95]",
        catColor: "text-[#6d28d9]/80",
        descColor: "text-[#5b21b6]/80",
    },
    {
        title: "HUS System",
        slug: "hus-system",
        category: "Government Infrastructure",
        image: "https://ik.imagekit.io/dypkhqxip/hus",
        description: "Robust system engineered for large-scale state digital infrastructure. Precision engineering for complex governance use cases.",
        bgColor: "bg-[#f0fdf4]", // Soft Mint
        borderColor: "border-[#bbf7d0]/60",
        textColor: "text-[#064e3b]",
        catColor: "text-[#047857]/80",
        descColor: "text-[#065f46]/80",
    },
    {
        title: "NSS CMRIT Chapter",
        slug: "nss-cmrit",
        category: "Educational Organization",
        image: "https://ik.imagekit.io/dypkhqxip/nss",
        description: "Website built for the student chapter with improved design and UX. Boosted interaction and conversion with fast loading and intuitive UX.",
        bgColor: "bg-[#fffbeb]", // Soft Amber
        borderColor: "border-[#fde68a]/60",
        textColor: "text-[#78350f]",
        catColor: "text-[#b45309]/80",
        descColor: "text-[#92400e]/80",
    },
    {
        title: "Stories At Scale",
        slug: "stories-at-scale",
        category: "Social Media Marketing Agency",
        image: "https://ik.imagekit.io/dypkhqxip/sas",
        description: "High-performance marketing optimization dashboard and client campaign engine. Streamlining digital asset tracking and scaling multi-channel workflows.",
        bgColor: "bg-[#ecfeff]", // Soft Cyan
        borderColor: "border-[#cffafe]/60",
        textColor: "text-[#083344]",
        catColor: "text-[#0e7490]/80",
        descColor: "text-[#155e75]/80",
    },
    {
        title: "National E-Commerce Platform",
        slug: "national-ecommerce",
        category: "Retail & Commerce",
        image: "https://ik.imagekit.io/dypkhqxip/shop",
        description: "High-conversion online retail store with real-time inventory synchronization. Delivered seamless global checkout and multi-currency support.",
        bgColor: "bg-[#fafaf9]", // Soft Stone
        borderColor: "border-[#e7e5e4]/60",
        textColor: "text-[#1c1917]",
        catColor: "text-[#44403c]/80",
        descColor: "text-[#57534e]/80",
    },
    {
        title: "Student Forge",
        slug: "student-forge",
        category: "Educational Platform",
        image: "https://ik.imagekit.io/dypkhqxip/sfredlix?updatedAt=1779555687235",
        description: "Redlix designed and engineered Student Forge, a dynamic digital collaboration platform for student organizations, providing volunteer hour tracking, event hosting, and resources sharing databases.",
        bgColor: "bg-[#f0fdf4]", // Soft Mint
        borderColor: "border-[#bbf7d0]/60",
        textColor: "text-[#064e3b]",
        catColor: "text-[#047857]/80",
        descColor: "text-[#065f46]/80",
    },
];

export default function PortfolioPage() {
    return (
        <div className="flex flex-col min-h-screen bg-white font-sans text-black pt-20">
            <main className="flex-grow">
                {/* Header Section */}
                <section className="bg-white py-10 lg:py-12 border-b border-gray-100">
                    <div className="max-w-[1500px] mx-auto px-6 lg:px-12 text-center md:text-left">
                        <span className="text-[#E61E32] font-semibold text-[12px] tracking-wider mb-3 block">Our work</span>
                        <h1 className="text-[32px] md:text-[42px] lg:text-[48px] font-semibold tracking-tight text-[#202124] leading-tight mb-4">
                            Portfolio
                        </h1>
                        <p className="text-[15px] md:text-[16px] text-[#5f6368] leading-relaxed max-w-2xl">
                            A showcase of our precision-engineered digital products, enterprise architectures, and bespoke software solutions designed for high-performance impact.
                        </p>
                    </div>
                </section>

                {/* Projects Grid */}
                <section className="py-10 lg:py-14">
                    <div className="max-w-[1500px] mx-auto px-6 lg:px-12">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
                            {projects.map((project, index) => (
                                <Link
                                    href={`/portfolio/${project.slug}`}
                                    key={index}
                                    className={`group block border ${project.borderColor} ${project.bgColor} rounded-2xl overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.02)] hover:shadow-xl transition-all duration-500`}
                                >
                                    {/* Image Section */}
                                    <div className="w-full aspect-video overflow-hidden relative border-b border-zinc-100">
                                        <img
                                            src={project.image}
                                            alt={project.title}
                                            className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700 ease-in-out"
                                        />
                                    </div>

                                    {/* Content Section below the Image */}
                                    <div className="p-6 md:p-8 flex flex-col gap-2">
                                        <span className={`text-[11px] font-bold ${project.catColor} tracking-wider`}>
                                            {project.category}
                                        </span>
                                        <h3 className={`text-[20px] font-semibold ${project.textColor} tracking-tight`}>
                                            {project.title}
                                        </h3>
                                        <p className={`text-[14px] ${project.descColor} leading-relaxed line-clamp-3`}>
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
