import { Metadata } from "next";
import CorporateFooter from "@/components/CorporateFooter";
import {
    Shield,
    Zap,
    Database,
    Terminal,
    Layers,
    Layout,
    Code2,
    Lock,
    Users,
    Cpu,
    CheckCircle2
} from "lucide-react";

export const metadata: Metadata = {
    title: "Kiro",
    description: "Explore Kiro, Redlix Studio's high-performance management architecture designed for distributed development workflows, unified portal collaboration, and enterprise-grade deployment management.",
    keywords: ["Kiro Architecture", "Project Tracking System", "Distributed Development Workflow", "Enterprise Architectural Hub"],
};

export default function KiroOverview() {
    return (
        <div className="flex flex-col min-h-screen bg-white font-sans text-black">
            <main className="flex-grow">
                {/* Hero / Header Section */}
                <section className="bg-white pt-16 pb-12 border-b border-gray-100">
                    <div className="max-w-[1500px] mx-auto px-6 lg:px-12">
                        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
                            <div className="w-full lg:w-1/2">
                                <span className="text-[#E61E32] font-medium text-[11px] uppercase tracking-[0.3em] mb-4 block">System Overview</span>
                                <h1 className="text-[28px] md:text-[36px] lg:text-[42px] font-medium tracking-tight text-[#202124] leading-tight mb-6">
                                    Kiro — Precision Architectural Management Component
                                </h1>
                                <p className="text-[16px] md:text-[18px] text-[#5f6368] leading-relaxed font-light mb-8">
                                    Kiro is a high-performance management architecture designed for distributed development workflows. It provides a unified portal for developers, clients, and administrators to facilitate collaboration, project tracking, and deployment management through a centralized architectural hub.
                                </p>
                                <div className="flex gap-4">
                                    <a
                                        href="https://atlas.redlix.co.in/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="bg-[#E61E32] text-white px-8 py-3.5 text-[13px] font-medium uppercase tracking-widest hover:bg-[#CC192A] transition-colors"
                                    >
                                        Explore Kiro
                                    </a>
                                </div>
                            </div>
                            <div className="w-full lg:w-1/2 flex justify-center lg:justify-end">
                                <div className="relative">
                                    <img
                                        src="https://ik.imagekit.io/dypkhqxip/Online%20world-bro.svg"
                                        alt="Kiro Illustration"
                                        className="w-full max-w-[500px] lg:max-w-none h-auto lg:scale-[1.35] lg:translate-x-8 relative z-10"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* System Vision */}
                <section className="py-16 bg-[#E61E32] text-white">
                    <div className="max-w-[1500px] mx-auto px-6 lg:px-12">
                        <div className="flex flex-col md:flex-row gap-12 items-start text-left">
                            <div className="w-full md:w-1/3 pt-1">
                                <h2 className="text-[18px] font-medium tracking-tight uppercase tracking-widest text-white/40 border-l-2 border-white/20 pl-6">System Vision</h2>
                            </div>
                            <div className="w-full md:w-2/3">
                                <p className="text-[18px] md:text-[20px] text-white leading-relaxed font-light">
                                    Engineered for scale, Kiro optimizes the pipeline from initial project inquiry to production deployment. The system implements a minimalist design language coupled with a robust enterprise-grade security infrastructure.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Core Features */}
                <section className="py-12 border-b border-gray-100">
                    <div className="max-w-[1500px] mx-auto px-6 lg:px-12">
                        <h2 className="text-[20px] font-medium mb-10 tracking-tight uppercase tracking-wider">Core Features</h2>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                            {/* Developer Infrastructure */}
                            <div className="space-y-6">
                                <div className="flex items-center gap-3">
                                    <Terminal className="w-4 h-4 text-[#E61E32]" />
                                    <h3 className="font-medium text-[16px]">Developer Infrastructure</h3>
                                </div>
                                <ul className="space-y-4">
                                    <li className="flex gap-4">
                                        <div className="w-1.5 h-1.5 rounded-full bg-black/10 mt-2 shrink-0" />
                                        <p className="text-[14px] leading-relaxed"><span className="font-medium text-black">Authentication Protocol:</span> Implementation of Google OAuth 2.0 with a resilient client-side handshake and server-side session synchronization.</p>
                                    </li>
                                    <li className="flex gap-4">
                                        <div className="w-1.5 h-1.5 rounded-full bg-black/10 mt-2 shrink-0" />
                                        <p className="text-[14px] leading-relaxed"><span className="font-medium text-black">Node Monitoring:</span> Real-time telemetry for assigned client metadata, task status, and system performance metrics.</p>
                                    </li>
                                    <li className="flex gap-4">
                                        <div className="w-1.5 h-1.5 rounded-full bg-black/10 mt-2 shrink-0" />
                                        <p className="text-[14px] leading-relaxed"><span className="font-medium text-black">Asset Management:</span> Integrated tools for technical documentation versioning and task node administration.</p>
                                    </li>
                                </ul>
                            </div>

                            {/* Administrative & Client Interfaces */}
                            <div className="space-y-6">
                                <div className="flex items-center gap-3">
                                    <Users className="w-4 h-4 text-[#E61E32]" />
                                    <h3 className="font-medium text-[16px]">Administrative & Client Interfaces</h3>
                                </div>
                                <ul className="space-y-4">
                                    <li className="flex gap-4">
                                        <div className="w-1.5 h-1.5 rounded-full bg-black/10 mt-2 shrink-0" />
                                        <p className="text-[14px] leading-relaxed"><span className="font-medium text-black">Admin Control Center:</span> Global oversight of active project threads, developer resource allocation, and incoming inquiry streams.</p>
                                    </li>
                                    <li className="flex gap-4">
                                        <div className="w-1.5 h-1.5 rounded-full bg-black/10 mt-2 shrink-0" />
                                        <p className="text-[14px] leading-relaxed"><span className="font-medium text-black">Client Interface:</span> Dedicated portal for synchronous project tracking and cross-functional communication.</p>
                                    </li>
                                    <li className="flex gap-4">
                                        <div className="w-1.5 h-1.5 rounded-full bg-black/10 mt-2 shrink-0" />
                                        <p className="text-[14px] leading-relaxed"><span className="font-medium text-black">Project Intake Pipeline:</span> "Launchpad" directive flow for project proposals with integrated fiscal tracking and metadata capture.</p>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Security Protocol - Moved and Updated */}
                <section className="py-16 bg-[#E61E32] text-white">
                    <div className="max-w-[1500px] mx-auto px-6 lg:px-12">
                        <div className="flex flex-col md:flex-row gap-12 items-center">
                            <div className="w-full md:w-1/3 text-center md:text-left">
                                <Lock className="w-12 h-12 mb-6 opacity-30 mx-auto md:mx-0" />
                                <h2 className="text-[20px] font-medium tracking-tight uppercase tracking-widest">Enterprise-Grade Security</h2>
                                <div className="h-1 w-20 bg-white/20 mt-4 mx-auto md:mx-0" />
                            </div>
                            <div className="w-full md:w-2/3 space-y-6">
                                <p className="text-[18px] md:text-[20px] leading-relaxed opacity-90 font-light italic">
                                    "Security is not a feature, but a fundamental architectural requirement for modern distributed systems."
                                </p>
                                <p className="text-[16px] leading-relaxed opacity-80 font-light">
                                    Kiro implements a rigorous Role-Based Access Control (RBAC) model. Session integrity is maintained via HTTP-only, secure, same-site cookies, enforced at the Edge through Next.js middleware to ensure complete isolation between Admin, Developer, and Client segments.
                                </p>
                                <div className="bg-white/10 p-6 border-l-4 border-white/30">
                                    <h4 className="text-[14px] font-medium uppercase tracking-widest mb-2">Technical Note:</h4>
                                    <p className="text-[14px] opacity-70 leading-relaxed font-light">
                                        The implementation leverage's Next.js Edge Middleware for zero-latency authorization checks. By neutralizing threats at the edge, Kiro prevents unauthorized access to the application layer, ensuring that sensitive project metadata remains encrypted and isolated within the enterprise perimeter.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Design System & Tech Stack */}
                <section className="py-12 bg-[#202124] text-white border-t border-white/5">
                    <div className="max-w-[1500px] mx-auto px-6 lg:px-12">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                            {/* Design System */}
                            <div className="space-y-8">
                                <h2 className="text-[18px] font-medium uppercase tracking-widest text-[#E61E32]">Design System</h2>
                                <div className="space-y-6">
                                    <div className="flex gap-6">
                                        <Layout className="w-6 h-6 shrink-0 opacity-50" />
                                        <div>
                                            <h4 className="font-medium mb-2">Visual Framework</h4>
                                            <p className="text-white/60 text-[14px]">High-fidelity UI with dynamic light/dark mode support and glassmorphic aesthetic properties.</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-6">
                                        <Cpu className="w-6 h-6 shrink-0 opacity-50" />
                                        <div>
                                            <h4 className="font-medium mb-2">Component Library</h4>
                                            <p className="text-white/60 text-[14px]">Custom-engineered input modules and interactive UI primitives optimized for low-latency user interaction.</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-6">
                                        <Layers className="w-6 h-6 shrink-0 opacity-50" />
                                        <div>
                                            <h4 className="font-medium mb-2">Responsive Layout Engine</h4>
                                            <p className="text-white/60 text-[14px]">Multi-breakpoint optimization for cross-platform compatibility across various viewport dimensions.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Technical Stack */}
                            <div className="space-y-8">
                                <h2 className="text-[18px] font-medium uppercase tracking-widest text-[#E61E32]">Technical Stack</h2>
                                <div className="grid grid-cols-2 gap-y-6 gap-x-8">
                                    <div>
                                        <p className="text-[11px] font-medium mb-1 opacity-40 uppercase tracking-widest">Framework</p>
                                        <p className="text-[14px]">Next.js 14+ (App Router)</p>
                                    </div>
                                    <div>
                                        <p className="text-[11px] font-medium mb-1 opacity-40 uppercase tracking-widest">ORM</p>
                                        <p className="text-[14px]">Prisma</p>
                                    </div>
                                    <div>
                                        <p className="text-[11px] font-medium mb-1 opacity-40 uppercase tracking-widest">Data Persistence</p>
                                        <p className="text-[14px]">MySQL / PostgreSQL</p>
                                    </div>
                                    <div>
                                        <p className="text-[11px] font-medium mb-1 opacity-40 uppercase tracking-widest">Infrastructure</p>
                                        <p className="text-[14px]">Supabase (Auth & SSR)</p>
                                    </div>
                                    <div>
                                        <p className="text-[11px] font-medium mb-1 opacity-40 uppercase tracking-widest">Styling</p>
                                        <p className="text-[14px]">Tailwind CSS</p>
                                    </div>
                                    <div>
                                        <p className="text-[11px] font-medium mb-1 opacity-40 uppercase tracking-widest">Deployment</p>
                                        <p className="text-[14px]">Vercel Edge Runtime</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Installation & Deployment */}
                <section className="py-12 bg-white">
                    <div className="max-w-[1500px] mx-auto px-6 lg:px-12">
                        <div className="flex flex-col lg:flex-row gap-16">
                            <div className="w-full lg:w-1/3">
                                <h2 className="text-[20px] font-medium tracking-tight mb-4">Installation & Deployment</h2>
                                <p className="text-[14px] text-[#5f6368] font-light mb-8">
                                    Local environment setup and cloud configuration requirements for production readiness.
                                </p>
                                <img
                                    src="https://ik.imagekit.io/dypkhqxip/Coding%20workshop-bro.svg"
                                    alt="Technical Setup Illustration"
                                    className="w-full max-w-[450px] h-auto"
                                />
                            </div>
                            <div className="w-full lg:w-2/3 bg-[#f8f9fa] border border-gray-100 p-8 space-y-8">
                                <div>
                                    <h4 className="text-[13px] font-medium uppercase tracking-widest text-[#E61E32] mb-4">Prerequisites</h4>
                                    <div className="flex gap-4 flex-wrap text-[14px] text-gray-600">
                                        <span>Node.js v18.x+</span>
                                        <span className="opacity-20">|</span>
                                        <span>NPM / PNPM / Bun</span>
                                        <span className="opacity-20">|</span>
                                        <span>Supabase Instance</span>
                                    </div>
                                </div>
                                <div>
                                    <h4 className="text-[13px] font-medium uppercase tracking-widest text-black mb-4 underline decoration-[#E61E32] decoration-2 underline-offset-8">Environment Setup</h4>
                                    <div className="bg-[#1E1E1E] text-[#D4D4D4] p-6 font-mono text-[13px] leading-relaxed overflow-x-auto rounded-sm shadow-inner">
                                        <p className="mb-2"><span className="text-[#6A9955]"># Clone the repository</span></p>
                                        <p className="mb-4"><span className="text-[#569CD6]">git</span> <span className="text-[#9CDCFE]">clone</span> <span className="text-[#CE9178]">[repository-url]</span></p>

                                        <p className="mb-2"><span className="text-[#6A9955]"># Install dependencies</span></p>
                                        <p className="mb-4"><span className="text-[#569CD6]">npm</span> <span className="text-[#9CDCFE]">install</span></p>

                                        <p className="mb-2"><span className="text-[#6A9955]"># Env Configuration (.env.local)</span></p>
                                        <p className="mb-1"><span className="text-[#9CDCFE]">NEXT_PUBLIC_SUPABASE_URL</span><span className="text-[#D4D4D4]">=</span><span className="text-[#CE9178]">your-supabase-url</span></p>
                                        <p className="mb-1"><span className="text-[#9CDCFE]">NEXT_PUBLIC_SUPABASE_ANON_KEY</span><span className="text-[#D4D4D4]">=</span><span className="text-[#CE9178]">your-supabase-key</span></p>
                                        <p className="mb-4"><span className="text-[#9CDCFE]">DATABASE_URL</span><span className="text-[#D4D4D4]">=</span><span className="text-[#CE9178]">your-db-string</span></p>

                                        <p className="mb-2"><span className="text-[#6A9955]"># Sync Database & Run</span></p>
                                        <p className="mb-1"><span className="text-[#569CD6]">npx</span> <span className="text-[#4EC9B0]">prisma</span> <span className="text-[#D4D4D4]">generate</span> <span className="text-[#D4D4D4]">&&</span> <span className="text-[#569CD6]">npx</span> <span className="text-[#4EC9B0]">prisma</span> <span className="text-[#D4D4D4]">db</span> <span className="text-[#D4D4D4]">push</span></p>
                                        <p><span className="text-[#569CD6]">npm</span> <span className="text-[#9CDCFE]">run</span> <span className="text-[#CE9178]">dev</span></p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <CorporateFooter />
        </div>
    );
}
