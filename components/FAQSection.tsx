"use client";

import React, { useState } from "react";

const faqs = [
    {
        question: "What services does Redlix offer?",
        answer: "Redlix provides a comprehensive suite of digital solutions, including custom software development, high-performance systems architecture, digital transformation consulting, and enterprise-grade web applications tailored to your specific business needs."
    },
    {
        question: "How do I start a project with you?",
        answer: "Starting a project is simple. You can schedule a discovery call through our website or contact our sales team directly. We'll discuss your vision, requirements, and objectives to create a tailored roadmap for your project."
    },
    {
        question: "How do you price projects?",
        answer: "We price projects on a fixed-scope or monthly retainer basis depending on your needs. For custom MVPs and software builds, we provide a transparent, upfront quote. For long-term product engineering, we offer dedicated monthly developer resources."
    },
    {
        question: "Who owns the intellectual property and code?",
        answer: "You do. Once the project is completed and the final invoice is paid, 100% of the codebase, design files, and intellectual property rights are fully and legally transferred to your company."
    },
    {
        question: "What is the typical project timeline?",
        answer: "Timelines vary depending on the complexity and scope of the project. A standard enterprise application typically takes between 8 to 16 weeks from discovery to deployment. We provide detailed milestones and regular updates throughout the process."
    },
    {
        question: "Do you offer post-launch support and maintenance?",
        answer: "Yes, we provide ongoing post-launch support, cloud infrastructure hosting setup, systems monitoring, and maintenance plans to ensure your product continues to run smoothly as your brand scales."
    },
    {
        question: "Can you work with our existing codebase or tech stack?",
        answer: "Absolutely. While we specialize in TypeScript (React/Next.js), Node.js, Python, and PostgreSQL, our engineering team can audit, refactor, and build directly on top of your existing code and infrastructure."
    },
    {
        question: "Do you build SEO-friendly websites to help us rank on Google?",
        answer: "Yes, every website we build is optimized for search engines from day one. We implement semantic HTML, maximize page loading speed, target core web vitals, and construct clean metadata structures to help your brand rank at the top of Google search results."
    },
    {
        question: "How do you design systems to help businesses scale?",
        answer: "We architect custom software using modern cloud infrastructure (AWS, serverless, and optimized databases). By implementing efficient caching, database indexing, and auto-scaling APIs, we ensure your platform handles high traffic volumes smoothly."
    },
    {
        question: "What core tech stack do you specialize in?",
        answer: "We specialize in high-performance stacks like TypeScript (Next.js, React), Node.js, Python, PostgreSQL, and Firebase. This combination allows us to deliver ultra-fast load times, solid security, and seamless cross-platform experiences."
    },
    {
        question: "How do you handle data security?",
        answer: "Security is built into every layer of our development process. We implement industry-standard SSL/TLS encryption, secure OAuth/JWT authentication protocols, and regular security audits to protect your data and ensure compliance with global standards."
    }
];

export default function FAQSection() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const toggleFAQ = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section id="faq" className="w-full bg-[#f4f4f5] py-16 sm:py-24 font-sans">
            <div className="max-w-4xl mx-auto px-4 sm:px-6">
                {/* Section Title */}
                <h2 className="text-3xl sm:text-4xl font-semibold text-center text-zinc-900 tracking-tight mb-10 sm:mb-12">
                    FAQs
                </h2>

                {/* FAQ Container Card */}
                <div className="bg-white rounded-lg border border-zinc-200/80 shadow-sm divide-y divide-zinc-200">
                    {faqs.map((faq, index) => {
                        const isOpen = openIndex === index;
                        return (
                            <div key={index} className="transition-colors">
                                <button
                                    onClick={() => toggleFAQ(index)}
                                    className="w-full flex items-center justify-between px-6 py-5 text-left focus:outline-none cursor-pointer group"
                                >
                                    <span className="text-[15px] sm:text-[16.5px] font-semibold text-zinc-900 leading-snug pr-4">
                                        Q{index + 1}. {faq.question}
                                    </span>
                                    {isOpen ? (
                                        <svg
                                            className="w-5 h-5 text-zinc-900 shrink-0 transition-transform duration-200"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            strokeWidth={2.5}
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
                                        </svg>
                                    ) : (
                                        <svg
                                            className="w-5 h-5 text-zinc-900 shrink-0 transition-transform duration-200"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            strokeWidth={2.5}
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                        </svg>
                                    )}
                                </button>

                                <div
                                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                                        isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
                                    }`}
                                >
                                    <div className="px-6 pb-6 pt-1">
                                        <p className="text-[13.5px] sm:text-[14.5px] text-zinc-600 leading-relaxed font-normal">
                                            {faq.answer}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

