import React from "react";
import { Metadata } from "next";
import CorporateFooter from "@/components/CorporateFooter";
import CallToAction from "@/components/CallToAction";

export const metadata: Metadata = {
    title: "About Us | Redlix Systems",
    description: "Learn about Redlix Systems, a forward-thinking technology company specializing in intelligent digital solutions, AI, and enterprise software engineered for global scale.",
    keywords: ["Redlix Systems Team", "IT Expertise Hyderabad", "Digital Solutions Architecture", "Innovative Technology Partner"],
};

export default function AboutPage() {
    return (
        <div className="flex flex-col min-h-screen bg-white font-sans">
            <main className="flex-grow">

                {/* Hero / Who We Are */}
                <section className="w-full bg-[#f8f9fa] pt-4 pb-0 lg:pt-6 lg:pb-0 border-b border-gray-100 overflow-visible">
                    <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-12 flex flex-col md:flex-row items-center gap-6 lg:gap-10">
                        <div className="w-full md:w-1/2">
                            <span className="text-[#E61E32] font-semibold text-[12px] tracking-widest uppercase mb-3 block">
                                About Redlix Systems
                            </span>
                            <h1 className="text-[26px] sm:text-[30px] lg:text-[34px] font-semibold text-black leading-[1.1] tracking-tight mb-5">
                                Who We Are
                            </h1>
                            <div className="space-y-4 text-[14px] text-[#5f6368] leading-relaxed max-w-xl pb-10 md:pb-0">
                                <p>
                                    Redlix Systems is a forward-thinking technology company dedicated to building <span className="bg-[#92E3A9] text-black px-1">intelligent, scalable, and impactful digital solutions</span>. We specialize in transforming ideas into powerful products that help businesses grow, automate, and lead in the digital era.
                                </p>
                                <p>
                                    Founded with a passion for innovation and precision, Redlix Systems combines technology expertise with creative problem-solving to deliver solutions that are both functional and future-ready.
                                </p>
                            </div>
                        </div>
                        <div className="w-full md:w-1/2 flex justify-center items-center">
                            <img
                                src="https://ik.imagekit.io/dypkhqxip/About%20us%20page-bro.svg"
                                alt="Redlix Team"
                                className="w-full max-w-[600px] lg:max-w-[750px] scale-110 -mb-10 -mt-10 lg:-mb-16 lg:-mt-16 h-auto object-contain transition-transform duration-700 hover:scale-[1.15]"
                            />
                        </div>
                    </div>
                </section>

                {/* Mission & Vision */}
                <section className="w-full bg-white py-12 lg:py-16">
                    <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-12">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">

                            {/* Mission */}
                            <div className="bg-[#fafafa] p-8 border border-gray-100">
                                <span className="text-[#E61E32] font-semibold text-[12px] tracking-widest uppercase mb-3 block">
                                    Our Mission
                                </span>
                                <p className="text-[14px] text-[#5f6368] leading-relaxed mb-4">
                                    Our mission is to empower businesses with <span className="bg-[#92E3A9] text-black px-1">cutting-edge technology solutions</span> that drive efficiency, performance, and sustainable growth.
                                </p>
                                <p className="text-[14px] text-[#5f6368] leading-relaxed">
                                    We aim to bridge the gap between complex technology and real-world business needs through smart engineering and strategic thinking.
                                </p>
                            </div>

                            {/* Vision */}
                            <div className="bg-[#fafafa] p-8 border border-gray-100">
                                <span className="text-[#E61E32] font-semibold text-[12px] tracking-widest uppercase mb-3 block">
                                    Our Vision
                                </span>
                                <p className="text-[14px] text-[#5f6368] leading-relaxed">
                                    To become a trusted global technology partner known for innovation, reliability, and excellence in delivering <span className="bg-[#92E3A9] text-black px-1">next-generation digital solutions</span>.
                                </p>
                            </div>

                        </div>
                    </div>
                </section>

                {/* What We Do & Our Approach */}
                <section className="w-full bg-[#111] py-12 lg:py-16">
                    <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-12">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">

                            {/* What We Do */}
                            <div>
                                <h2 className="text-[26px] sm:text-[30px] lg:text-[34px] font-semibold text-white leading-[1.2] tracking-tight mb-5">
                                    What We Do
                                </h2>
                                <p className="text-[14px] text-gray-400 leading-relaxed mb-6">
                                    At Redlix Systems, we provide end-to-end technology services, including:
                                </p>
                                <ul className="space-y-3 mb-6">
                                    {[
                                        "Web & Application Development",
                                        "AI & Intelligent Systems",
                                        "Cloud-Based Solutions",
                                        "E-Commerce Platforms",
                                        "Enterprise Software Development",
                                        "UI/UX Design & Digital Strategy"
                                    ].map((item, i) => (
                                        <li key={i} className="flex items-center text-[14px] text-gray-300">
                                            <div className="w-1.5 h-1.5 bg-[#E61E32] mr-3 rounded-none" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                                <p className="text-[14px] text-gray-400 leading-relaxed">
                                    We focus on building secure, scalable, and performance-driven systems tailored to each client’s needs.
                                </p>
                            </div>

                            {/* Our Approach */}
                            <div>
                                <h2 className="text-[26px] sm:text-[30px] lg:text-[34px] font-semibold text-white leading-[1.2] tracking-tight mb-5">
                                    Our Approach
                                </h2>
                                <p className="text-[14px] text-gray-400 leading-relaxed mb-6">
                                    We believe technology should be:
                                </p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                                    <div className="bg-[#222] p-5 border border-gray-800">
                                        <h4 className="text-[14px] font-bold text-white mb-2 uppercase tracking-wide">User-Centric</h4>
                                        <p className="text-[13px] text-gray-400">Designed with real users in mind</p>
                                    </div>
                                    <div className="bg-[#222] p-5 border border-gray-800">
                                        <h4 className="text-[14px] font-bold text-white mb-2 uppercase tracking-wide">Scalable</h4>
                                        <p className="text-[13px] text-gray-400">Built to grow with your business</p>
                                    </div>
                                    <div className="bg-[#222] p-5 border border-gray-800">
                                        <h4 className="text-[14px] font-bold text-white mb-2 uppercase tracking-wide">Secure</h4>
                                        <p className="text-[13px] text-gray-400">Engineered with strong security foundations</p>
                                    </div>
                                    <div className="bg-[#222] p-5 border border-gray-800">
                                        <h4 className="text-[14px] font-bold text-white mb-2 uppercase tracking-wide">Innovative</h4>
                                        <p className="text-[13px] text-gray-400">Always pushing beyond conventional limits</p>
                                    </div>
                                </div>
                                <p className="text-[14px] text-gray-400 leading-relaxed">
                                    Our team follows a structured development process — from research and planning to deployment and long-term support — ensuring every project meets the highest standards of quality.
                                </p>
                            </div>

                        </div>
                    </div>
                </section>

                {/* Why Choose & Commitment */}
                <section className="w-full bg-white py-12 lg:py-16">
                    <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-12">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">

                            {/* Why Choose */}
                            <div>
                                <h2 className="text-[26px] sm:text-[30px] lg:text-[34px] font-semibold text-black leading-[1.2] tracking-tight mb-5">
                                    Why Choose Redlix Systems?
                                </h2>
                                <ul className="space-y-3 mb-6">
                                    {[
                                        "Strategic & Data-Driven Solutions",
                                        "Modern Tech Stack & Best Practices",
                                        "Transparent Communication",
                                        "On-Time Delivery",
                                        "Long-Term Partnership Approach"
                                    ].map((item, i) => (
                                        <li key={i} className="flex items-center text-[14px] text-[#5f6368] font-medium">
                                            <svg className="w-4 h-4 text-[#E61E32] mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="2" d="M5 13l4 4L19 7" />
                                            </svg>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                                <div className="border-l-[3px] border-[#E61E32] pl-5 py-2">
                                    <p className="text-[15px] text-black font-semibold uppercase tracking-wide">
                                        We don’t just build software — we build digital ecosystems that create <span className="bg-[#92E3A9] text-black px-1 pt-0.5">measurable impact</span>.
                                    </p>
                                </div>
                            </div>

                            {/* Commitment */}
                            <div className="bg-[#f8f9fa] p-8 border border-gray-100 flex flex-col justify-center">
                                <span className="text-[#E61E32] font-semibold text-[12px] tracking-widest uppercase mb-3 block">
                                    Our Commitment
                                </span>
                                <p className="text-[14px] text-[#5f6368] leading-relaxed">
                                    At Redlix Systems, we are committed to excellence, continuous learning, and technological advancement. We stay ahead of industry trends so our clients stay ahead of their competition.
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
