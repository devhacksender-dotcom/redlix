"use client";

import React from "react";
import Link from "next/link";

const projects = [
    {
        title: "PisciDrop",
        slug: "piscidrop",
        category: "Logistics & Supply Chain",
        image: "https://ik.imagekit.io/dypkhqxip/picsidrop",
        description: "Redlix built our end-to-end aquaculture logistics platform with real-time tracking, automated dispatch, and supply chain analytics that transformed our delivery operations.",
        badge: "Excited to support your impact.",
        badgeColor: "bg-orange-100 text-orange-600",
        author: "Pavan Reddy Pateel",
        role: "Founder, PisciDrop",
        avatar: "https://ik.imagekit.io/dypkhqxip/Pavan%20Reddy%20Pateel?updatedAt=1780238997511",
    },
    {
        title: "Dhasha Media",
        slug: "dhasha-media",
        category: "Internal Operations Engine",
        image: "https://ik.imagekit.io/dypkhqxip/dhashamedia",
        description: "Redlix built our custom client management system that streamlined our entire workflow. What used to take hours now takes minutes for our agency operations.",
        badge: "Proud to ship this together.",
        badgeColor: "bg-zinc-100 text-zinc-600",
        author: "Dhanush Reddy",
        role: "Founder @ Dhasha Media",
        avatar: "https://res.cloudinary.com/dsqqrpzfl/image/upload/v1770931011/Screenshot_2026-02-13_at_02.45.59_kw8pih.png",
    },
    {
        title: "HSGA Telangana",
        slug: "hsga-telangana",
        category: "Government Infrastructure",
        image: "https://ik.imagekit.io/dypkhqxip/hsga",
        description: "We imagined a modern digital platform for state governance: Redlix brought it to life with precision, accessibility, and performance that serves thousands.",
        badge: "Pushing boundaries is what we do.",
        badgeColor: "bg-blue-100 text-blue-600",
        author: "HSGA Telangana",
        role: "Government Infrastructure",
        avatar: "https://res.cloudinary.com/dq2suftps/image/upload/v1722516854/logo_bivaq2.jpg",
    },
    {
        title: "Forge Digital Technologies",
        slug: "forge-digital",
        category: "IT Solutions Company",
        image: "https://ik.imagekit.io/dypkhqxip/fdt",
        description: "Redlix built our enterprise-grade IT solutions platform with dynamic provisioning, multi-tenant architecture, and a seamless client onboarding experience.",
        badge: "Loved building with Redlix.",
        badgeColor: "bg-rose-100 text-rose-600",
        author: "Forge Digital",
        role: "Founder & CEO of FDT",
        avatar: "https://res.cloudinary.com/dsqqrpzfl/image/upload/v1771184951/Screenshot_2026-02-16_at_01.18.59_yodn7t.png",
    },
    {
        title: "HUS System",
        slug: "hus-system",
        category: "Government Infrastructure",
        image: "https://ik.imagekit.io/dypkhqxip/hus",
        description: "The precision engineering in our governance platform is remarkable. Redlix built a system that handles complex management and coordination seamlessly.",
        badge: "Execution without gaps.",
        badgeColor: "bg-emerald-100 text-emerald-600",
        author: "HUS System",
        role: "Government Platform",
        avatar: "https://res.cloudinary.com/dq2suftps/image/upload/v1722516854/logo_bivaq2.jpg",
    },
    {
        title: "NSS CMRIT Chapter",
        slug: "nss-cmrit",
        category: "Educational Organization",
        image: "https://ik.imagekit.io/dypkhqxip/nss",
        description: "An incredible collaboration that delivered beyond expectations. Redlix transformed our vision into a beautiful, functional platform that our community loves.",
        badge: "Built for the community.",
        badgeColor: "bg-violet-100 text-violet-600",
        author: "NSS CMRIT",
        role: "Student Chapter",
        avatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSiY63DjvYa-bL8ci8s5_KTiLm_9Mw_Wy0Xdw&s",
    },
    {
        title: "Stories At Scale",
        slug: "stories-at-scale",
        category: "Social Media Marketing Agency",
        image: "https://ik.imagekit.io/dypkhqxip/sas",
        description: "Redlix built our social media marketing engine and campaign intelligence portal, helping us scale client creatives and engagement with sub-second analytics.",
        badge: "Truly exceptional work.",
        badgeColor: "bg-amber-100 text-amber-600",
        author: "Harshith Sai Tunguntla",
        role: "CEO @ SAS",
        avatar: "https://res.cloudinary.com/dsqqrpzfl/image/upload/v1771184658/Screenshot_2026-02-16_at_01.14.02_btxipo.png",
    },
    {
        title: "National E-Commerce Platform",
        slug: "national-ecommerce",
        category: "Retail & Commerce",
        image: "https://ik.imagekit.io/dypkhqxip/shop",
        description: "Redlix built our B2B e-commerce platform with contract-based catalogues, client-specific SKUs, and dynamic discount programs that scaled our business.",
        badge: "State initiative success.",
        badgeColor: "bg-amber-100 text-amber-600",
        author: "HSGA Telangana",
        role: "Digital Initiative",
        avatar: "https://res.cloudinary.com/dq2suftps/image/upload/v1722516854/logo_bivaq2.jpg",
    }
];

function ProjectCard({ project, keyPrefix }: { project: typeof projects[0]; keyPrefix: string }) {
    return (
        <Link
            href={`/portfolio/${project.slug}`}
            key={keyPrefix}
            className="relative flex-none w-[450px] sm:w-[540px] bg-white border border-zinc-200/60 rounded-2xl overflow-hidden group cursor-pointer shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all duration-300 block flex flex-col"
        >
            <div className="p-3 pb-0">
                <div className="w-full h-[290px] sm:h-[330px] rounded-xl overflow-hidden bg-zinc-50 flex items-center justify-center">
                    <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-contain object-center group-hover:scale-[1.02] transition-transform duration-500 pointer-events-none"
                    />
                </div>
            </div>

            <div className="px-4 pt-4 pb-3 flex-grow flex flex-col min-h-0">
                <p className="text-[13px] text-zinc-600 leading-relaxed mb-3 line-clamp-3">
                    {project.description}
                </p>
                <div className="mb-2">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] font-medium ${project.badgeColor}`}>
                        {project.badge}
                    </span>
                </div>
            </div>

            <div className="px-4 pb-3.5 flex items-center gap-2.5 border-t border-zinc-100 pt-2.5 mt-auto">
                <img
                    src={project.avatar}
                    alt={project.author}
                    className="w-9 h-9 rounded-full object-cover pointer-events-none"
                />
                <div className="min-w-0">
                    <p className="text-[12px] font-semibold text-zinc-800 leading-tight truncate">{project.author}</p>
                    <p className="text-[10.5px] text-zinc-400 truncate">{project.role}</p>
                </div>
            </div>
        </Link>
    );
}

export default function ProjectsSection() {
    return (
        <section className="w-full bg-zinc-50/50 py-2 lg:py-4 border-y border-zinc-100 overflow-hidden">
            <div className="relative w-full overflow-hidden">
                <div className="flex gap-4 animate-marquee-slow hover:[animation-play-state:paused] py-1 select-none items-stretch">
                    <div className="flex items-stretch gap-4 flex-shrink-0">
                        {projects.map((project, index) => (
                            <ProjectCard key={`g1-${index}`} project={project} keyPrefix={`g1-${index}`} />
                        ))}
                    </div>
                    <div className="flex items-stretch gap-4 flex-shrink-0">
                        {projects.map((project, index) => (
                            <ProjectCard key={`g2-${index}`} project={project} keyPrefix={`g2-${index}`} />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
