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
        question: "What are the requirements for Redlix Learn courses?",
        answer: "Redlix Learn courses are designed for various skill levels. While some advanced modules require basic programming knowledge, many of our fundamental courses are open to anyone eager to learn full-stack development, UI/UX design, or system architecture."
    },
    {
        question: "What is the typical project timeline?",
        answer: "Timelines vary depending on the complexity and scope of the project. A standard enterprise application typically takes between 8 to 16 weeks from discovery to deployment. We provide detailed milestones and regular updates throughout the process."
    },
    {
        question: "Do I receive a certificate upon completion of a course?",
        answer: "Yes, all students who successfully complete a Redlix Learn program receive a verified digital certificate. This credential validates your technical proficiency and can be directly shared on professional platforms like LinkedIn."
    },
    {
        question: "Are there internship opportunities at Redlix Studio?",
        answer: "We frequently open internship positions for talented individuals. Interns gain hands-on experience working on real-world projects and receive dedicated mentorship from our senior engineering team."
    },
    {
        question: "How do you handle data security?",
        answer: "Security is built into every layer of our development process. We implement industry-standard encryption, secure authentication protocols, and regular security audits to protect your data and ensure compliance with global standards."
    }
];

export default function FAQSection() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const toggleFAQ = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section className="w-full bg-[#fafafa] py-16 sm:py-24 lg:py-32 border-t border-gray-100 font-sans">
            <div className="max-w-[1200px] mx-auto px-6 sm:px-10">
                <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
                    
                    {/* Left Column */}
                    <div className="w-full lg:w-[35%] flex flex-col items-start text-left">
                        <div className="lg:sticky lg:top-28 space-y-4">
                            {/* Pill Badge */}
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-zinc-200/80 rounded-full text-[12px] font-medium text-zinc-700 shadow-[0_2px_8px_rgba(0,0,0,0.01)] select-none">
                                <svg className="w-3.5 h-3.5 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                FAQs
                            </span>
                            
                            {/* Title */}
                            <h2 className="text-[28px] sm:text-[34px] lg:text-[38px] font-semibold text-zinc-900 tracking-tight leading-tight lg:whitespace-nowrap">
                                Can&apos;t find your answer?
                            </h2>
                            
                            {/* Subtext */}
                            <p className="text-zinc-500 text-[14px] sm:text-[15px] leading-relaxed max-w-[280px] font-normal">
                                Book a call or send us a message on Telegram
                            </p>
                            
                            {/* Button */}
                            <div className="pt-2">
                                <a
                                    href="https://cal.com/redlix.co.in"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2.5 px-5 py-2.5 bg-zinc-950 hover:bg-zinc-800 text-white rounded-full text-[13.5px] font-medium transition-all duration-300 shadow-[0_4px_12px_rgba(0,0,0,0.06)] hover:-translate-y-0.5 hover:shadow-[0_6px_16px_rgba(0,0,0,0.1)]"
                                >
                                    <img
                                        src="https://www.gstatic.com/images/branding/productlogos/meet_2026/v2/web-96dp/logo_meet_2026_color_2x_web_96dp.png"
                                        alt="Google Meet Logo"
                                        className="w-4 h-4 flex-shrink-0"
                                    />
                                    Intro call
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Accordion Cards */}
                    <div className="w-full lg:w-[65%] flex flex-col gap-4">
                        {faqs.map((faq, index) => {
                            const isOpen = openIndex === index;
                            return (
                                <div
                                    key={index}
                                    className="bg-white border border-zinc-200/50 rounded-[20px] shadow-[0_2px_12px_rgba(0,0,0,0.015)] transition-all duration-300 hover:border-zinc-300/80"
                                >
                                    <button
                                        onClick={() => toggleFAQ(index)}
                                        className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
                                    >
                                        <span className="text-[15px] sm:text-[16.5px] font-semibold text-zinc-900 leading-snug pr-4">
                                            {faq.question}
                                        </span>
                                        <svg
                                            className={`w-4 h-4 text-zinc-400 shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180 text-zinc-800" : ""}`}
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            strokeWidth={2.5}
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                    
                                    <div
                                        className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? "max-h-[300px] opacity-100" : "max-h-0 opacity-0"}`}
                                    >
                                        <div className="px-6 pb-6 pt-0">
                                            <p className="text-[13.5px] sm:text-[14.5px] text-zinc-500 leading-relaxed font-normal">
                                                {faq.answer}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                </div>
            </div>
        </section>
    );
}
