"use client";

import React, { useState } from "react";
import CorporateFooter from "@/components/CorporateFooter";

const blogPosts = [
    {
        tag: "DEVELOPMENT",
        date: "July 31, 2025",
        title: "Traditional Coding v/s Vibe Coding",
        description: "My Journey from Structure to Soul — exploring the evolution of development from rigid methodologies to the intuitive, flow-state world of 'vibe' coding.",
        image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2070&auto=format&fit=crop",
        content: (
            <div className="space-y-3 text-zinc-700 leading-relaxed text-[14.5px] sm:text-[15.5px]">
                <p>
                    In the fast-evolving landscape of software development, a new paradigm has emerged—one that shifts the focus from rigid structures to intuitive creation. We call this <strong>"Vibe Coding."</strong> Traditionally, coding was built on absolute rigor: planning architectures, defining data models, writing unit tests, and adhering to strict syntax rules. It required deep focus on the <em>how</em> of implementation.
                </p>
                <p>
                    Vibe coding, on the other hand, is about flow. It utilizes AI assistants to handle the boilerplate, syntax, and infrastructure, allowing the human developer to act as a creative director. You "vibe" with the code—guiding the logic, making design decisions, and iterating rapidly. This doesn't mean forgetting the fundamentals. Instead, it means leveraging your foundational knowledge to review, refine, and orchestrate code written at the speed of thought.
                </p>
                <h3 className="text-[17px] sm:text-[18px] font-semibold text-zinc-900 mt-4 mb-1">The Shift in Developer Productivity</h3>
                <p>
                    With the boilerplate handled by AI, the time-to-market for new features decreases dramatically. Developers can test hypotheses in real-time, changing logic structures on the fly. However, this raises the bar for testing. Since code is generated quickly, writing robust automated tests becomes the developer's primary shield against regression and logic bugs.
                </p>
                <h3 className="text-[17px] sm:text-[18px] font-semibold text-zinc-900 mt-4 mb-1">Why Architecture Still Matters</h3>
                <p>
                    AI can write functional code blocks, but it lacks the contextual understanding of large-scale systems architecture. Designing databases, choosing communication protocols (like gRPC vs REST), and ensuring secure authentication remain uniquely human strengths. Vibe coding allows you to spend more time planning these system foundations and less time typing out repetitive boilerplate.
                </p>
                <h3 className="text-[17px] sm:text-[18px] font-semibold text-zinc-900 mt-4 mb-1">Key Takeaways</h3>
                <ul className="list-disc pl-5 space-y-1 text-zinc-650">
                    <li><strong>Flow State:</strong> Eliminate typing friction and focus entirely on solution design.</li>
                    <li><strong>Rapid Prototyping:</strong> Build and test complete feature concepts in minutes.</li>
                    <li><strong>Rigorous Review:</strong> Use your technical expertise to audit, test, and verify AI-generated components.</li>
                </ul>
            </div>
        )
    },
    {
        tag: "STARTUP",
        date: "January 5, 2026",
        title: "From Chaos to Clarity — The Naming Journey of My Startup",
        description: "How stepping back to rethink fundamentals led from DHRC to Gearupzz — a platform designed to support engineering students through every phase of their journey.",
        image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=2070&auto=format&fit=crop",
        content: (
            <div className="space-y-3 text-zinc-700 leading-relaxed text-[14.5px] sm:text-[15.5px]">
                <p>
                    Every startup begins with a naming struggle. Naming is not just branding—it's the distillation of your product's soul into a single word. Our journey started with DHRC. While functional, it lacked energy, warmth, and failed to connect with our core audience: ambitious engineering students. We realized we needed a name that represented acceleration, preparation, and support.
                </p>
                <p>
                    We set out to brainstorm names that felt active and empowering. After rejecting dozens of options that felt too generic or corporate, we asked ourselves what our platform actually does. It helps students prepare for their careers, build portfolios, and gain industrial skills. It helps them "gear up" for the future.
                </p>
                <p>
                    Adding a creative suffix and energy led us to <strong>Gearupzz</strong>. It represents getting ready, accelerating growth, and joining a community of builders. The double 'z' adds a youthful, modern aesthetic that immediately resonates with university students.
                </p>
                <h3 className="text-[17px] sm:text-[18px] font-semibold text-zinc-900 mt-4 mb-1">Lessons Learned</h3>
                <ol className="list-decimal pl-5 space-y-1 text-zinc-650">
                    <li><strong>Rethink Fundamentals:</strong> If a name doesn't feel right, don't force it. Take a step back and examine the core emotion you want your users to feel when they interact with your brand.</li>
                    <li><strong>Audience Connection:</strong> Your name must resonate with the people using your product daily, not just the board members or investors.</li>
                    <li><strong>Trademark and Availability:</strong> Check domain availability, handles on social media, and local business registries early in the process to avoid heartbreak later.</li>
                </ol>
            </div>
        )
    },
    {
        tag: "TEMPLATE",
        date: "September 16, 2025",
        title: "Blog Template",
        description: "A minimal blog template built using Next.js.",
        image: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=2070&auto=format&fit=crop",
        content: (
            <div className="space-y-3 text-zinc-700 leading-relaxed text-[14.5px] sm:text-[15.5px]">
                
                {/* Embedded Video and Actions */}
                <div className="flex max-w-[800px] flex-col gap-3 my-4">
                    <video
                        autoPlay
                        loop
                        muted
                        playsInline
                        src="https://cdn.magicui.design/blog-demo.mp4"
                        className="w-full rounded-xl border border-zinc-200 shadow-sm"
                    />
                    <div className="flex w-full flex-col sm:flex-row gap-2">
                        <a 
                            href="https://github.com/magicuidesign/blog-template" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-zinc-950 hover:bg-zinc-800 text-white rounded-lg text-[13.5px] font-semibold transition-colors shadow-sm"
                        >
                            GitHub Repository (Free)
                        </a>
                        <a 
                            href="https://blog-magicui.vercel.app/" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-white border border-zinc-200 hover:bg-zinc-50 text-zinc-800 rounded-lg text-[13.5px] font-semibold transition-colors shadow-sm"
                        >
                            Live Preview
                        </a>
                    </div>
                </div>

                <p>
                    A minimal changelog template to showcase your product updates, releases, and improvements in a beautiful timeline format. Built with Next.js, TailwindCSS, and Fumadocs for easy content management. This template provides a high-performance foundation for companies to share their development progress without the overhead of heavy CMS solutions.
                </p>
                <p>
                    We built this template keeping speed, accessibility, and ease of deployment at the absolute forefront. By combining Next.js static site generation with a clean markdown-based content store, pages load instantly worldwide while maintaining high search engine optimization (SEO) scores.
                </p>

                <h3 className="text-[17px] sm:text-[18px] font-semibold text-zinc-900 mt-4 mb-1">Key Dependencies</h3>
                <ul className="list-disc pl-5 space-y-1 text-zinc-650">
                    <li><strong>Next.js 15:</strong> Harnesses App Router architectures, dynamic rendering speeds, and optimized bundle sizes.</li>
                    <li><strong>React 19:</strong> Leverages the latest concurrent rendering features and hooks support.</li>
                    <li><strong>TypeScript 5:</strong> Standardizes strict type safety across database queries and layout templates.</li>
                    <li><strong>TailwindCSS 4:</strong> Utilizes modern utility classes and lightning-fast compile speeds.</li>
                    <li><strong>Fumadocs UI:</strong> Powers layout navigation, search indexes, and sidebar hierarchies natively.</li>
                    <li><strong>Radix UI & Shadcn:</strong> Provides fully unstyled, accessible keyboard-navigable components.</li>
                </ul>

                <h3 className="text-[17px] sm:text-[18px] font-semibold text-zinc-900 mt-4 mb-1">Tech Stack</h3>
                <div className="flex flex-wrap gap-1.5 mt-2">
                    {["Next.js", "React", "TypeScript", "TailwindCSS", "Fumadocs", "Shadcn UI"].map((tech) => (
                        <span key={tech} className="px-2.5 py-0.5 bg-zinc-100 border border-zinc-200/50 rounded-full text-zinc-700 text-[12px] font-medium">
                            {tech}
                        </span>
                    ))}
                </div>
            </div>
        )
    },
    {
        tag: "ARCHITECTURE",
        date: "February 14, 2026",
        title: "Deep Dive into Multi-Tenant Database Architecture",
        description: "An analysis of shared-database, separate-schema vs. physical isolation patterns for enterprise SaaS scaling.",
        image: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?q=80&w=2070&auto=format&fit=crop",
        content: (
            <div className="space-y-3 text-zinc-700 leading-relaxed text-[14.5px] sm:text-[15.5px]">
                <p>
                    Scaling a SaaS database requires careful architectural decisions. The core choice for multi-tenancy comes down to how data is separated between clients.
                </p>
                <p>
                    <strong>1. Shared Database, Shared Schema:</strong> Tenants share the same tables, separated by a tenant_id column. It is highly cost-effective and easy to maintain, but carries query leakage risks if schemas aren't audited. Row-level security (RLS) policies are essential to safeguard tenant data in this setup.
                </p>
                <p>
                    <strong>2. Shared Database, Separate Schema:</strong> PostgreSQL schemas isolate tables logically. This provides a balance between isolation and deployment simplicity. Database migrations are run across schemas sequentially, ensuring clean tenant separations.
                </p>
                <p>
                    <strong>3. Separate Database:</strong> Complete physical isolation. Necessary for enterprise clients requiring custom security compliances and zero noise-neighbor impacts. However, it significantly increases infrastructure overhead and maintenance complexities.
                </p>
                <h3 className="text-[17px] sm:text-[18px] font-semibold text-zinc-900 mt-4 mb-1">Selecting the Right Pattern</h3>
                <p>
                    For early-stage startups, a shared schema with strong row-level security (RLS) is highly recommended. It minimizes server costs and makes database schema updates simple. As you scale into enterprise markets, migrating high-value tenants to separate databases or schemas is the standard progression.
                </p>
            </div>
        )
    },
    {
        tag: "MARKETING",
        date: "March 20, 2026",
        title: "The Impact of Web Vitals on SaaS Conversion Rates",
        description: "Why resolving LCP and INP performance bottlenecks is no longer just a technical issue, but a critical revenue metrics driver.",
        image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2070&auto=format&fit=crop",
        content: (
            <div className="space-y-3 text-zinc-700 leading-relaxed text-[14.5px] sm:text-[15.5px]">
                <p>
                    Performance optimization has evolved beyond pure tech metrics. Today, Largest Contentful Paint (LCP) and Interaction to Next Paint (INP) directly affect conversion funnels and user retention.
                </p>
                <p>
                    Studies show that a 100ms improvement in load speed can boost sales by up to 1%. Search engines also penalize slow-loading sites, decreasing organic search reach. When visitors encounter sluggish elements, they drop off before even seeing your value proposition.
                </p>
                <h3 className="text-[17px] sm:text-[18px] font-semibold text-zinc-900 mt-4 mb-1">Key Performance Metrics</h3>
                <p>
                    - **LCP (Largest Contentful Paint)**: Measures loading performance. Aim for 2.5 seconds or less.
                    - **FID/INP (Interaction to Next Paint)**: Measures interactivity. Aim for 200 milliseconds or less.
                    - **CLS (Cumulative Layout Shift)**: Measures visual stability. Aim for a score of 0.1 or less.
                </p>
                <h3 className="text-[17px] sm:text-[18px] font-semibold text-zinc-900 mt-4 mb-1">Actionable Optimizations</h3>
                <ul className="list-disc pl-5 space-y-1.5 text-zinc-650">
                    <li><strong>Image Compression:</strong> Use WebP/AVIF formats with correct dimension properties to prevent layout shifts.</li>
                    <li><strong>Code Splitting:</strong> Reduce initial JS bundle payloads with lazy loading and dynamic imports.</li>
                    <li><strong>CDN Caching:</strong> Serve static pages from edge servers closer to the client location.</li>
                </ul>
            </div>
        )
    }
];

export default function BlogsPage() {
    const [activePostIndex, setActivePostIndex] = useState<number | null>(null);

    return (
        <div className="flex flex-col min-h-screen bg-white font-sans text-black pt-20">
            <main className="flex-grow">
                {activePostIndex === null ? (
                    <>
                        {/* Header Section */}
                        <section className="bg-[#fafafa] py-10 lg:py-14 border-b border-gray-100">
                            <div className="max-w-[1200px] mx-auto px-6 lg:px-8 text-center md:text-left">
                                <span className="text-[#E61E32] font-semibold text-[11px] uppercase tracking-[0.3em] mb-3 block">Insights</span>
                                <h1 className="text-[32px] md:text-[40px] lg:text-[46px] font-semibold tracking-tight text-zinc-900 leading-tight mb-4">
                                    Latest Articles
                                </h1>
                                <p className="text-[15px] md:text-[16px] text-zinc-550 leading-relaxed max-w-2xl font-light">
                                    Discover our thoughts, guides, and engineering insights on building high-performance software products.
                                </p>
                            </div>
                        </section>

                        {/* Articles Grid */}
                        <section className="py-12 lg:py-16 bg-white">
                            <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {blogPosts.map((post, index) => (
                                        <div
                                            key={index}
                                            onClick={() => {
                                                setActivePostIndex(index);
                                                window.scrollTo({ top: 0, behavior: "smooth" });
                                            }}
                                            className="flex flex-col group cursor-pointer bg-white border border-zinc-200/60 rounded-[20px] shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden"
                                        >
                                            <div className="w-full h-[180px] overflow-hidden bg-zinc-50 relative border-b border-zinc-100">
                                                <img
                                                    src={post.image}
                                                    alt={post.title}
                                                    className="w-full h-full object-cover group-hover:scale-105 group-hover:opacity-95 transition-all duration-500 ease-in-out"
                                                />
                                            </div>

                                            <div className="p-5 flex flex-col flex-grow">
                                                <div className="flex items-center gap-2 mb-2.5">
                                                    <span className="text-[9.5px] font-bold bg-[#E61E32]/10 text-[#E61E32] px-2 py-0.5 tracking-wide rounded-sm uppercase">
                                                        {post.tag}
                                                    </span>
                                                    <span className="text-[11.5px] font-medium text-zinc-400 ml-2">
                                                        {post.date}
                                                    </span>
                                                </div>

                                                <h3 className="text-[17px] font-semibold text-zinc-900 tracking-tight mb-2 group-hover:text-[#E61E32] transition-colors duration-300 leading-snug">
                                                    {post.title}
                                                </h3>
                                                <p className="text-[13px] text-zinc-500 leading-relaxed line-clamp-3 mt-auto font-normal">
                                                    {post.description}
                                                </p>

                                                {/* Read Link */}
                                                <div className="mt-4 flex items-center text-[#E61E32] font-semibold text-[12.5px] group-hover:text-[#CC192A] transition-colors uppercase tracking-wider">
                                                    Read Article
                                                    <svg className="w-3.5 h-3.5 ml-1.5 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>
                    </>
                ) : (
                    /* Article Detail View */
                    <section className="py-8 lg:py-12 bg-white">
                        <div className="max-w-[720px] mx-auto px-6">
                            
                            {/* Back Button */}
                            <button
                                onClick={() => {
                                    setActivePostIndex(null);
                                    window.scrollTo({ top: 0, behavior: "smooth" });
                                }}
                                className="inline-flex items-center gap-2 text-[13.5px] font-semibold text-zinc-500 hover:text-zinc-900 transition-colors mb-6 group"
                            >
                                <svg className="w-4 h-4 transform group-hover:-translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                                Back to Articles
                            </button>

                            {/* Article Header info */}
                            <div className="space-y-3 mb-6">
                                <div className="flex items-center gap-3">
                                    <span className="text-[10px] font-bold bg-[#E61E32]/10 text-[#E61E32] px-2.5 py-1 tracking-wide rounded-sm uppercase">
                                        {blogPosts[activePostIndex].tag}
                                    </span>
                                    <span className="text-[13px] font-medium text-zinc-400">
                                        {blogPosts[activePostIndex].date}
                                    </span>
                                </div>
                                <h1 className="text-[28px] sm:text-[34px] lg:text-[38px] font-bold text-zinc-900 leading-tight tracking-tight">
                                    {blogPosts[activePostIndex].title}
                                </h1>
                                <p className="text-[15px] sm:text-[16px] text-zinc-500 leading-relaxed font-light italic">
                                    {blogPosts[activePostIndex].description}
                                </p>
                            </div>

                            {/* Hero Image */}
                            <div className="w-full h-[220px] sm:h-[300px] overflow-hidden rounded-[20px] mb-6 border border-zinc-200/50">
                                <img
                                    src={blogPosts[activePostIndex].image}
                                    alt={blogPosts[activePostIndex].title}
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            {/* Article Content */}
                            <div className="prose prose-zinc max-w-none">
                                {blogPosts[activePostIndex].content}
                            </div>

                        </div>
                    </section>
                )}
            </main>
            <CorporateFooter />
        </div>
    );
}
