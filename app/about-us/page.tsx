import React from "react";
import { Metadata } from "next";
import CorporateFooter from "@/components/CorporateFooter";
import CallToAction from "@/components/CallToAction";

export const metadata: Metadata = {
    title: "About Us",
    description: "Learn about Redlix Studio, a forward-thinking technology company specializing in intelligent digital solutions, AI, and enterprise software engineered for global scale.",
    keywords: ["Redlix Studio Team", "IT Expertise Hyderabad", "Digital Solutions Architecture", "Innovative Technology Partner"],
};

export default function AboutPage() {
    return (
        <div className="flex flex-col min-h-screen bg-white font-sans text-black pt-20">
            <main className="flex-grow">

                {/* Hero / Who We Are */}
                <section className="w-full bg-[#FAFAFA] pt-12 pb-16 lg:pt-16 lg:pb-24 border-b border-gray-100 overflow-visible relative">
                    {/* Decorative subtle gradient background blur */}
                    <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-red-100/30 rounded-full blur-[100px] pointer-events-none" />
                    
                    <div className="max-w-[1500px] mx-auto px-6 sm:px-8 lg:px-12 flex flex-col lg:flex-row items-center gap-12 lg:gap-16 relative z-10">
                        <div className="w-full lg:w-1/2">
                            <span className="text-[#E61E32] font-semibold text-[12px] tracking-[0.25em] uppercase mb-4 block">
                                About Redlix Studio
                            </span>
                            <h1 className="text-[36px] sm:text-[44px] lg:text-[52px] font-bold text-zinc-950 leading-[1.1] tracking-tight mb-6">
                                Who We Are
                            </h1>
                            <div className="space-y-6 text-[15px] text-[#5f6368] leading-relaxed max-w-xl">
                                <p className="text-[16px] text-zinc-900 font-normal">
                                    Redlix Studio is a modern, forward-thinking technology and design agency dedicated to building <span className="font-semibold text-black border-b-2 border-[#92E3A9] pb-0.5">intelligent, high-performance, and beautifully engineered digital products</span>. We specialize in transforming bold concepts into robust platforms that help businesses scale, automate, and lead in the digital era.
                                </p>
                                <p>
                                    Founded with an uncompromising focus on precision and quality, Redlix Studio merges deep systems engineering with world-class user experiences. We do not just build websites and applications; we design complete digital engines that serve as the technical backbone for our clients' long-term success.
                                </p>
                            </div>
                        </div>
                        <div className="w-full lg:w-1/2 flex justify-center items-center">
                            <img
                                src="https://ik.imagekit.io/dypkhqxip/About%20us%20page-bro.svg"
                                alt="Redlix Team Illustration"
                                className="w-full max-w-[600px] lg:max-w-[750px] scale-110 -mb-10 -mt-10 lg:-mb-16 lg:-mt-16 h-auto object-contain transition-transform duration-700 hover:scale-[1.15]"
                            />
                        </div>
                    </div>
                </section>

                {/* Mission & Vision */}
                <section className="w-full bg-white py-16 lg:py-24">
                    <div className="max-w-[1500px] mx-auto px-6 sm:px-8 lg:px-12">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">

                            {/* Mission Card */}
                            <div className="bg-[#FAFDFB] p-8 sm:p-10 border border-emerald-100/50 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.01)] hover:shadow-[0_8px_30px_rgba(146,227,169,0.1)] transition-all duration-500 flex flex-col justify-between">
                                <div>
                                    <span className="text-emerald-600 font-semibold text-[11px] tracking-[0.2em] uppercase mb-4 block">
                                        Our Mission
                                    </span>
                                    <h3 className="text-[22px] font-bold text-zinc-950 mb-4 tracking-tight">
                                        Empowering through Technology
                                    </h3>
                                    <p className="text-[14.5px] text-[#5f6368] leading-relaxed mb-4">
                                        Our mission is to empower businesses with <span className="bg-[#92E3A9]/20 text-emerald-950 px-1.5 py-0.5 rounded font-medium">cutting-edge tech solutions</span> that drive efficiency, performance, and sustainable growth.
                                    </p>
                                    <p className="text-[14.5px] text-[#5f6368] leading-relaxed">
                                        We aim to bridge the gap between complex enterprise technologies and real-world business needs through smart engineering, modern architecture, and strategic design.
                                    </p>
                                </div>
                                <div className="mt-8 pt-6 border-t border-zinc-100 flex items-center text-[13px] font-semibold text-emerald-700">
                                    Strategic Delivery & Quality Assurance
                                </div>
                            </div>

                            {/* Vision Card */}
                            <div className="bg-[#FCF9FA] p-8 sm:p-10 border border-red-100/50 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.01)] hover:shadow-[0_8px_30px_rgba(230,30,50,0.05)] transition-all duration-500 flex flex-col justify-between">
                                <div>
                                    <span className="text-[#E61E32] font-semibold text-[11px] tracking-[0.2em] uppercase mb-4 block">
                                        Our Vision
                                    </span>
                                    <h3 className="text-[22px] font-bold text-zinc-950 mb-4 tracking-tight">
                                        Architects of the Future
                                    </h3>
                                    <p className="text-[14.5px] text-[#5f6368] leading-relaxed mb-4">
                                        To become a trusted global technology partner recognized for innovation, technical excellence, and integrity in delivering <span className="bg-red-50 text-red-700 px-1.5 py-0.5 rounded font-medium">next-generation digital systems</span>.
                                    </p>
                                    <p className="text-[14.5px] text-[#5f6368] leading-relaxed">
                                        We aspire to establish new standards for digital product design, proving that aesthetics and high-performance systems can coexist beautifully to create meaningful utility.
                                    </p>
                                </div>
                                <div className="mt-8 pt-6 border-t border-zinc-100 flex items-center text-[13px] font-semibold text-[#E61E32]">
                                    Global Scale & Local Excellence
                                </div>
                            </div>

                        </div>
                    </div>
                </section>

                {/* What We Do & Our Approach */}
                <section className="w-full bg-[#111] py-16 lg:py-24 relative overflow-hidden">
                    {/* Red blur effect in dark section */}
                    <div className="absolute -bottom-20 -left-20 w-[350px] h-[350px] bg-[#E61E32]/10 rounded-full blur-[90px] pointer-events-none" />

                    <div className="max-w-[1500px] mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">

                            {/* What We Do */}
                            <div className="lg:col-span-5">
                                <span className="text-[#E61E32] font-semibold text-[12px] tracking-[0.25em] uppercase mb-4 block">
                                    Our Capability
                                </span>
                                <h2 className="text-[32px] sm:text-[38px] font-bold text-white leading-tight tracking-tight mb-6">
                                    What We Do
                                </h2>
                                <p className="text-[15px] text-zinc-400 leading-relaxed mb-8">
                                    At Redlix Studio, we provide comprehensive, engineering-first technology solutions tailored to your growth objectives:
                                </p>
                                <ul className="space-y-4">
                                    {[
                                        "High-Performance Web & App Development",
                                        "AI-Powered Systems & Custom Automation",
                                        "Cloud Native Architecture & Edge Scaling",
                                        "Headless E-Commerce Platforms & Gateways",
                                        "Bespoke Enterprise Software & Clean APIs",
                                        "High-Fidelity UI/UX Design & Brand Systems"
                                    ].map((item, i) => (
                                        <li key={i} className="flex items-center text-[14.5px] text-zinc-300">
                                            <div className="w-2 h-2 bg-[#E61E32] mr-4 rounded-full shadow-[0_0_8px_#E61E32]" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Our Approach */}
                            <div className="lg:col-span-7">
                                <span className="text-zinc-500 font-semibold text-[12px] tracking-[0.25em] uppercase mb-4 block">
                                    Our Core Methodology
                                </span>
                                <h2 className="text-[32px] sm:text-[38px] font-bold text-white leading-tight tracking-tight mb-6">
                                    Our Approach
                                </h2>
                                <p className="text-[15px] text-zinc-400 leading-relaxed mb-8">
                                    We believe that great software is never accidental. We guide our projects with four fundamental design principles:
                                </p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
                                    <div className="bg-[#18181B] p-6 border border-zinc-800 rounded-xl hover:border-zinc-700 transition-colors">
                                        <h4 className="text-[14px] font-bold text-white mb-2 uppercase tracking-wider">User-Centric</h4>
                                        <p className="text-[13px] text-zinc-400 leading-relaxed">Designed around real human behaviors and needs, resulting in high-adoption interfaces.</p>
                                    </div>
                                    <div className="bg-[#18181B] p-6 border border-zinc-800 rounded-xl hover:border-zinc-700 transition-colors">
                                        <h4 className="text-[14px] font-bold text-white mb-2 uppercase tracking-wider">Scalable</h4>
                                        <p className="text-[13px] text-zinc-400 leading-relaxed">Engineered with highly available database infrastructure ready to scale under traffic.</p>
                                    </div>
                                    <div className="bg-[#18181B] p-6 border border-zinc-800 rounded-xl hover:border-zinc-700 transition-colors">
                                        <h4 className="text-[14px] font-bold text-white mb-2 uppercase tracking-wider">Secure</h4>
                                        <p className="text-[13px] text-zinc-400 leading-relaxed">Built on modern protocols, role-based authorization, and strict compliance layers.</p>
                                    </div>
                                    <div className="bg-[#18181B] p-6 border border-zinc-800 rounded-xl hover:border-zinc-700 transition-colors">
                                        <h4 className="text-[14px] font-bold text-white mb-2 uppercase tracking-wider">Innovative</h4>
                                        <p className="text-[13px] text-zinc-400 leading-relaxed">Integrating custom models, edge hosting, and modern stacks to optimize performance.</p>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </section>

                {/* Why Choose & Commitment */}
                <section className="w-full bg-white py-16 lg:py-24">
                    <div className="max-w-[1500px] mx-auto px-6 sm:px-8 lg:px-12">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-stretch">

                            {/* Why Choose */}
                            <div className="lg:col-span-6 flex flex-col justify-between">
                                <div>
                                    <span className="text-[#E61E32] font-semibold text-[12px] tracking-[0.25em] uppercase mb-4 block">
                                        Why Redlix Studio
                                    </span>
                                    <h2 className="text-[32px] sm:text-[38px] font-bold text-zinc-950 leading-tight tracking-tight mb-8">
                                        Why Choose Us?
                                    </h2>
                                    <ul className="space-y-4 mb-8">
                                        {[
                                            "Strategic & Engineering-First Architecture",
                                            "Modern Tech Stack & Global Development Standards",
                                            "Absolute Code Quality & Maintainability",
                                            "Transparent Partnerships & Project Communication",
                                            "Long-Term Product Support & Alignment"
                                        ].map((item, i) => (
                                            <li key={i} className="flex items-start text-[15px] text-[#5f6368] font-medium">
                                                <svg className="w-5 h-5 text-[#E61E32] mr-3 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                                                </svg>
                                                <span>{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="border-l-4 border-[#E61E32] pl-6 py-2.5 bg-zinc-50 rounded-r-xl">
                                    <p className="text-[15px] text-zinc-950 font-bold leading-relaxed">
                                        We don’t just write software — we build digital ecosystems that create <span className="bg-[#92E3A9]/40 text-zinc-900 px-1 py-0.5 rounded">measurable business impact</span>.
                                    </p>
                                </div>
                            </div>

                            {/* Commitment */}
                            <div className="lg:col-span-6 bg-zinc-50/50 p-8 sm:p-10 border border-zinc-100 rounded-2xl flex flex-col justify-center relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-red-100/10 rounded-full blur-2xl pointer-events-none" />
                                <span className="text-[#E61E32] font-semibold text-[11px] tracking-[0.2em] uppercase mb-4 block">
                                    Our Commitment
                                </span>
                                <h3 className="text-[22px] font-bold text-zinc-950 mb-4 tracking-tight">
                                    Uncompromising Quality & Success
                                </h3>
                                <p className="text-[14.5px] text-[#5f6368] leading-relaxed space-y-4">
                                    At Redlix Studio, we are fully committed to engineering excellence, continuous learning, and state-of-the-art implementation. We constantly keep pace with emerging frameworks, databases, and user experience methodologies so our clients always remain leaps ahead of their competitors.
                                </p>
                            </div>

                        </div>
                    </div>
                </section>

                <CallToAction />

            </main>
            <CorporateFooter />
        </div>
    );
}
