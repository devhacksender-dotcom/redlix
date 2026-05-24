"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

export type LegalSection = {
    id: string;
    title: string;
    content: React.ReactNode;
};

type LegalDocLayoutProps = {
    title: string;
    description?: string;
    updated?: string;
    effective?: string;
    sections: LegalSection[];
    className?: string;
};

export const legalProseClass =
    "text-[15px] md:text-[16px] text-[#5f6368] leading-relaxed space-y-4 [&_p]:leading-relaxed [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-2 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:space-y-2 [&_a]:text-[#E61E32] [&_a]:hover:underline [&_strong]:text-[#202124] [&_strong]:font-semibold [&_h4]:text-[#202124] [&_h4]:font-semibold [&_h4]:text-[15px] [&_code]:text-[13px] [&_code]:bg-gray-50 [&_code]:border [&_code]:border-gray-200 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_table]:w-full [&_table]:text-[14px] [&_table]:border [&_table]:border-gray-200 [&_table]:rounded-xl [&_table]:overflow-hidden [&_thead]:bg-gray-50 [&_thead]:text-[#202124] [&_th]:px-4 [&_th]:py-3 [&_th]:font-medium [&_th]:text-left [&_td]:px-4 [&_td]:py-3 [&_tbody]:divide-y [&_tbody]:divide-gray-100 [&_li]:text-[#5f6368]";

export function LegalProse({
    children,
    className = "",
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return <div className={`${legalProseClass} ${className}`}>{children}</div>;
}

export default function LegalDocLayout({
    title,
    description,
    updated,
    effective,
    sections,
    className = "",
}: LegalDocLayoutProps) {
    const [activeId, setActiveId] = useState(sections[0]?.id ?? "");
    const isClickScrolling = useRef(false);

    useEffect(() => {
        const observers: IntersectionObserver[] = [];

        sections.forEach((section) => {
            const el = document.getElementById(section.id);
            if (!el) return;

            const observer = new IntersectionObserver(
                (entries) => {
                    if (isClickScrolling.current) return;
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            setActiveId(section.id);
                        }
                    });
                },
                { rootMargin: "-18% 0px -58% 0px", threshold: 0 }
            );

            observer.observe(el);
            observers.push(observer);
        });

        return () => observers.forEach((o) => o.disconnect());
    }, [sections]);

    const scrollTo = (id: string) => {
        const el = document.getElementById(id);
        if (!el) return;

        isClickScrolling.current = true;
        setActiveId(id);
        el.scrollIntoView({ behavior: "smooth", block: "start" });

        window.setTimeout(() => {
            isClickScrolling.current = false;
        }, 700);
    };

    return (
        <div className={`min-h-screen bg-white text-[#202124] font-sans pt-28 pb-20 ${className}`}>
            <div className="max-w-6xl mx-auto px-6 lg:px-10">
                <div className="flex gap-10 lg:gap-16">
                    <aside className="hidden lg:block w-56 shrink-0">
                        <nav className="sticky top-28 space-y-0.5" aria-label="Page sections">
                            {sections.map((section) => {
                                const isActive = activeId === section.id;
                                return (
                                    <button
                                        key={section.id}
                                        type="button"
                                        onClick={() => scrollTo(section.id)}
                                        className={`relative w-full text-left py-2.5 pl-5 pr-2 text-[14px] transition-colors duration-200 ${
                                            isActive
                                                ? "text-[#202124] font-semibold"
                                                : "text-[#5f6368] hover:text-[#202124] font-medium"
                                        }`}
                                    >
                                        {isActive && (
                                            <motion.span
                                                layoutId="legal-doc-nav-indicator"
                                                className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-[#202124] rounded-full"
                                                transition={{
                                                    type: "spring",
                                                    stiffness: 380,
                                                    damping: 32,
                                                }}
                                            />
                                        )}
                                        {section.title}
                                    </button>
                                );
                            })}
                        </nav>
                    </aside>

                    <div className="flex-1 min-w-0">
                        <header className="mb-10 pb-8 border-b border-gray-100">
                            <h1 className="text-[28px] md:text-[36px] font-semibold text-[#202124] tracking-tight leading-tight">
                                {title}
                            </h1>
                            {description && (
                                <p className="mt-4 text-[#5f6368] text-[15px] md:text-[16px] leading-relaxed max-w-2xl">
                                    {description}
                                </p>
                            )}
                            {(updated || effective) && (
                                <p className="mt-4 text-[13px] text-gray-400 font-medium">
                                    {updated && <>Last updated {updated}</>}
                                    {updated && effective && <span className="mx-2 text-gray-300">·</span>}
                                    {effective && <>Effective {effective}</>}
                                </p>
                            )}
                        </header>

                        <div
                            className="lg:hidden mb-8 flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-none"
                            role="tablist"
                            aria-label="Jump to section"
                        >
                            {sections.map((section) => (
                                <button
                                    key={section.id}
                                    type="button"
                                    role="tab"
                                    aria-selected={activeId === section.id}
                                    onClick={() => scrollTo(section.id)}
                                    className={`shrink-0 px-3.5 py-2 rounded-lg text-[13px] whitespace-nowrap transition-colors border ${
                                        activeId === section.id
                                            ? "bg-[#202124] text-white font-semibold border-[#202124]"
                                            : "bg-gray-50 text-[#5f6368] font-medium border-gray-200"
                                    }`}
                                >
                                    {section.title}
                                </button>
                            ))}
                        </div>

                        <div className="space-y-14 md:space-y-16">
                            {sections.map((section) => (
                                <section
                                    key={section.id}
                                    id={section.id}
                                    className="scroll-mt-28"
                                >
                                    <h2 className="text-[20px] md:text-[22px] font-semibold text-[#202124] tracking-tight mb-5">
                                        {section.title}
                                    </h2>
                                    <LegalProse>{section.content}</LegalProse>
                                </section>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
