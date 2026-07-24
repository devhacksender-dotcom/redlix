import React from "react";
import Link from "next/link";

const blogPosts = [
    {
        tag: "DEVELOPMENT",
        date: "July 31, 2025",
        title: "Traditional Coding v/s Vibe Coding",
        description: "My Journey from Structure to Soul — exploring the evolution of development from rigid methodologies to the intuitive, flow-state world of 'vibe' coding.",
        image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2070&auto=format&fit=crop",
        link: "https://www.linkedin.com/pulse/traditional-coding-vs-vibe-rishi-rohan-kalapala/"
    },
    {
        tag: "STARTUP",
        date: "January 5, 2026",
        title: "From Chaos to Clarity — The Naming Journey of My Startup",
        description: "How stepping back to rethink fundamentals led from DHRC to Gearupzz — a platform designed to support engineering students through every phase of their journey.",
        image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=2070&auto=format&fit=crop",
        link: "https://medium.com/@rishirohankalapala/chaos-to-clarity-the-naming-journey-of-my-startup"
    },
];

export default function BlogsSection() {
    return (
        <section className="w-full bg-[#fafafa] font-sans py-12 lg:py-16 border-t border-gray-200">
            <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-12">

                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
                    <div className="max-w-2xl">
                        <h2 className="text-[28px] sm:text-[34px] font-normal text-gray-900 tracking-tight mb-4">
                            Latest Insights
                        </h2>
                        <p className="text-[14px] text-gray-500 leading-relaxed font-normal">
                            Discover our latest thoughts on software engineering, product design, and digital strategy.
                        </p>
                    </div>
                    <div>
                        <Link
                            href="/blogs"
                            className="inline-flex items-center text-[#E61E32] hover:text-[#CC192A] font-medium text-[14px] transition-colors gap-2"
                        >
                            Read all articles
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                        </Link>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {blogPosts.map((post, index) => (
                        <a
                            key={index}
                            href={post.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex flex-col group cursor-pointer bg-white border border-gray-200 rounded-none shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                        >
                            <div className="p-6 flex flex-col flex-grow">
                                <div className="flex items-center gap-2 mb-3">
                                    <span className="text-[10px] font-medium bg-[#E61E32]/10 text-[#E61E32] px-2 py-0.5 tracking-wide rounded-sm">
                                        {post.tag}
                                    </span>
                                    <span className="text-[12px] font-medium text-gray-500 ml-2">
                                        {post.date}
                                    </span>
                                </div>

                                <h3 className="text-[18px] font-medium text-[#202124] tracking-tight mb-2 group-hover:text-[#E61E32] transition-colors duration-300 leading-tight">
                                    {post.title}
                                </h3>
                                <p className="text-[13px] text-[#5f6368] leading-relaxed line-clamp-3 mt-auto font-normal">
                                    {post.description}
                                </p>

                                {/* Read Article Link */}
                                <div className="mt-4 flex items-center text-[#E61E32] font-semibold text-[13px] group-hover:text-[#CC192A] transition-colors uppercase tracking-wider">
                                    Read Article
                                    <svg className="w-4 h-4 ml-1.5 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                    </svg>
                                </div>
                            </div>
                        </a>
                    ))}
                </div>

            </div>
        </section>
    );
}
