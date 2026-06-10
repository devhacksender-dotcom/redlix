import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import CorporateFooter from "@/components/CorporateFooter";
import CallToAction from "@/components/CallToAction";
import {
    ExternalLink,
    Link2,
    ArrowLeft,
    ArrowRight,
    Twitter,
    Linkedin,
    Facebook,
    Send,
    Share2,
    CheckCircle2,
    Quote
} from "lucide-react";

export async function generateMetadata(
    { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
    const { slug } = await params;
    const project = projects.find(p => p.slug === slug);

    if (!project) return { title: "Project Not Found" };

    return {
        title: `${project.title} | Redlix Studio Project`,
        description: project.description,
        openGraph: {
            images: [project.image],
        },
    };
}

// Custom SVG Icons for the exact brand look in the social bar
const XIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="black" {...props}>
        <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932 6.064-6.932zm-1.292 19.494h2.039L6.486 3.24H4.298l13.311 17.407z" />
    </svg>
);

const LinkedinIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="black" {...props}>
        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
    </svg>
);

// Updated project data with more metadata to support the new UI
const projects = [
    {
        title: "PisciDrop",
        slug: "piscidrop",
        link: "https://piscidrop.com",
        category: "Logistics & Supply Chain",
        image: "https://ik.imagekit.io/dypkhqxip/picsi",
        description: "Redlix built our end-to-end aquaculture logistics platform with real-time tracking, automated dispatch, and supply chain analytics that transformed our delivery operations.",
        clientInfo: { hq: "Hyderabad, India", industry: "Logistics & Supply Chain", size: "Mid-size (50-100)" },
        services: ["Logistics Dashboard", "Route Tracking API", "Supply Chain Analytics"],
        quote: "Cold-chain optimization at scale — Precise, Automated, Real-time",
        founder: {
            name: "Pavan Reddy Pateel",
            role: "Founder, PisciDrop",
            avatar: "https://ik.imagekit.io/dypkhqxip/Pavan%20Reddy%20Pateel?updatedAt=1780238997511"
        },
        testimonial: {
            text: "Redlix built our end-to-end aquaculture logistics platform with real-time tracking, automated dispatch, and supply chain analytics that transformed our delivery operations.",
            author: "Pavan Reddy Pateel",
            role: "Founder @ PisciDrop"
        },
        clientDetail: "PisciDrop is a modern supply chain and logistics company specializing in fresh aquaculture distribution. They connect local fish farms and harvesters directly to urban retail distributors and processing plants, ensuring cold-chain integrity and rapid delivery schedules.",
        challenge: "Aquaculture logistics requires precise timing and temperature management to prevent spoilage. The team lacked unified route tracking, automated dispatch notifications, and real-time fleet analytics, relying instead on manual phone calls and paper logs.",
        delivered: [
            "Built an end-to-end aquaculture logistics dashboard with real-time GPS tracking of active transit routes.",
            "Developed an automated driver dispatch and delivery scheduling engine with auto-notifications.",
            "Integrated IoT sensor APIs to monitor temperature variables inside transit compartments.",
            "Created a driver mobile app interface for seamless receipt logging and delivery confirmations.",
            "Structured a custom supply chain analytics dashboard tracking transit times and efficiency metrics."
        ],
        whyRedlix: "Redlix delivered a robust logistics application combining complex real-time tracking with an intuitive, mobile-optimized interface. Our technical execution minimized route planning overheads and improved delivery fulfillment."
    },
    {
        title: "Dhasha Media",
        slug: "dhasha-media",
        link: "https://dhashamedia.com",
        category: "Internal Operations Engine",
        image: "https://ik.imagekit.io/dypkhqxip/dhashamedia",
        description: "Custom internal operations system for media agency workflows. Automated bookings and complex workflows, improving efficiency.",
        clientInfo: { hq: "Hyderabad, India", industry: "Media & Advertising", size: "Mid-size (50-100)" },
        services: ["Internal System Design", "Process Automation", "Backend Architecture"],
        quote: "Digital efficiency — Seamless, Automated, Scalable",
        founder: {
            name: "Dhanush Reddy",
            role: "Founder, Dhasha Media",
            avatar: "https://res.cloudinary.com/dsqqrpzfl/image/upload/v1770931011/Screenshot_2026-02-13_at_02.45.59_kw8pih.png"
        },
        testimonial: {
            text: "Working with Redlix was a total game-changer for our agency operations. They built us a custom client management system that streamlined our entire workflow.",
            author: "Dhanush Reddy",
            role: "Founder @ Dhasha Media"
        },
        clientDetail: "Dhasha Media is a premier creative media and digital advertising agency managing complex advertising campaigns, talent bookings, and multi-channel production workflows. With a growing roster of high-profile creators, brands, and production teams, they required a robust, scalable internal operations engine to replace fragmented communication tools, spreadsheets, and manual tracking databases. Partnering with Redlix allowed them to establish a high-fidelity internal system that unifies booking workflows, asset pipelines, and client project management under a single administrative umbrella.",
        challenge: "The agency struggled with tracking talent booking schedules, media asset approvals, and client billing across different departments. Manual coordination led to booking conflicts, delayed campaign launches, and lack of transparency. They needed a unified, high-performance dashboard that could automate schedules, manage digital assets with instant previews, and provide real-time financial reporting for active projects.",
        delivered: [
            "Built a custom task orchestration dashboard with Next.js and Tailwind CSS for streamlined task allocation and status updates.",
            "Implemented an automated calendar booking system with conflict detection, recurring schedule supports, and Google Calendar sync.",
            "Integrated a secure digital asset management system supporting instant media previews and secure cloud storage.",
            "Engineered an automated invoicing and billing module that dynamically calculates rates based on campaign scale and duration.",
            "Established real-time performance analytics dashboards to track active campaign timelines and agent productivity."
        ],
        whyRedlix: "Redlix was chosen because of our deep expertise in business process automation and our ability to design highly intuitive, bespoke internal tools that map precisely to operational workflows rather than forcing generic software templates. Our execution ensured that their team adapted to the system within days, resulting in immediate efficiency gains."
    },
    {
        title: "HSGA Telangana",
        slug: "hsga-telangana",
        link: "https://hsgatelangana.com",
        category: "Government Infrastructure",
        image: "https://ik.imagekit.io/dypkhqxip/hsga",
        description: "Designed and developed the official HSGA Telangana landing page. Elevated digital presence with fast, accessible design.",
        clientInfo: { hq: "Hyderabad, India", industry: "Government", size: "Large Scale" },
        services: ["Web Development", "Landing Page", "UI/UX"],
        quote: "State-wide accessibility — Modern, Fast, Inclusive and Modern",
        founder: {
            name: "HSGA Telangana",
            role: "Government Infrastructure",
            avatar: "https://res.cloudinary.com/dq2suftps/image/upload/v1722516854/logo_bivaq2.jpg"
        },
        testimonial: {
            text: "Redlix delivered a modern, fast, and accessible digital platform for our state initiatives. They understood the unique challenges of government infrastructure.",
            author: "HSGA Telangana",
            role: "Digital Initiative"
        },
        clientDetail: "The HSGA Telangana represents a vital public-facing department representing community-level and state initiatives. Serving millions of citizens across Telangana, the organization needed a modern, highly accessible web platform to publish official updates, community events, and state infrastructure projects. To bridge the gap between citizens and state services, the portal needed to offer unmatched reliability, high performance on low-end mobile devices, and strict compliance with national digital standards.",
        challenge: "The previous state portal was slow, visually outdated, and failed basic web accessibility (a11y) standards, making it difficult for rural and disabled populations to access essential resources. The site also struggled under sudden traffic spikes during major policy announcements, leading to high latency and intermittent downtime.",
        delivered: [
            "Developed a lightweight, modern web architecture optimized for 100% Core Web Vitals score across mobile and desktop devices.",
            "Implemented strict compliance with WCAG 2.1 AA accessibility standards including full ARIA support and high-contrast styling options.",
            "Built an intuitive translation system allowing users to switch between English and regional languages effortlessly.",
            "Integrated a headless content management system (CMS) allowing department officials to publish news and alerts securely.",
            "Leveraged server-side rendering (SSR) and edge caching to guarantee sub-second load times under heavy public traffic spikes."
        ],
        whyRedlix: "Our technical rigor in building high-speed, secure, and accessible digital portals was a perfect fit for state-level infrastructure where reliability and accessibility are non-negotiable. Redlix ensured that the transition was seamless, secure, and fully aligned with the state's technical parameters."
    },
    {
        title: "Forge Digital Technologies",
        slug: "forge-digital",
        link: "https://forgedigital.com",
        category: "Fintech Operations Architecture",
        image: "https://ik.imagekit.io/dypkhqxip/fdt",
        description: "Next-generation software systems and custom API architectures built for global financial enterprises. Streamlining asset management and scaling transaction volumes.",
        clientInfo: { hq: "New York, USA", industry: "Fintech & Enterprise Systems", size: "Enterprise (500+)" },
        services: ["B2B Operations Design", "API Orchestration", "Enterprise Architecture"],
        quote: "Financial automation at scale — Secure, Performant, Interoperable",
        founder: {
            name: "Jaswanth Sonti",
            role: "CEO, Forge Digital Technologies",
            avatar: "https://res.cloudinary.com/dsqqrpzfl/image/upload/v1771184951/Screenshot_2026-02-16_at_01.18.59_yodn7t.png"
        },
        testimonial: {
            text: "Forge Digital Technologies partnered with Redlix to engineer our core payment processing engine. The resulting architecture handles billions of requests with zero latency. Truly elite engineering.",
            author: "Jaswanth Sonti",
            role: "CEO @ Forge Digital Technologies"
        },
        clientDetail: "Forge Digital Technologies is an enterprise financial technology provider specializing in high-throughput payment orchestration and asset management systems. Processing millions of secure transactions daily for global financial clients, their operations require elite-grade scalability, banking-grade security protocols, and extremely low-latency API performance. Redlix partnered with their engineering team to overhaul their core B2B processing layers and establish a modern, scalable microservices infrastructure.",
        challenge: "As transaction volumes grew, their legacy payment gateway experienced latency bottlenecks and occasional connection drops. They needed to modernize their core API architecture, integrate multiple global banking gateways, and maintain absolute security compliance (PCI-DSS) while scaling transaction capacities to support enterprise expansion.",
        delivered: [
            "Engineered a highly-available, low-latency API gateway utilizing robust Go and Node.js microservices.",
            "Re-architected database schemas and implemented distributed Redis caching layers to optimize query response times.",
            "Built a centralized financial reconciliation dashboard with real-time audit logging and anomaly detection.",
            "Integrated multiple external banking APIs under a unified, developer-friendly SDK abstraction.",
            "Conducted rigorous stress testing, simulating up to 50k concurrent requests to ensure sub-millisecond database queries."
        ],
        whyRedlix: "Redlix brought elite systems engineering, financial data security protocols, and an uncompromising attitude toward microsecond-level performance optimization. Our ability to collaborate with existing enterprise developers made the integration seamless and low-risk."
    },
    {
        title: "HUS System",
        slug: "hus-system",
        link: "https://hus.hsgatelangana.com",
        category: "Government Infrastructure",
        image: "https://ik.imagekit.io/dypkhqxip/hus",
        description: "Robust system engineered for large-scale state digital infrastructure. Precision engineering for complex governance use cases.",
        clientInfo: { hq: "Telangana, India", industry: "Infrastructure", size: "State-wide" },
        services: ["Enterprise Software", "Security Architecture", "Cloud Infrastructure"],
        quote: "Execution Without Gaps — Precise, Secure, Reliable",
        founder: {
            name: "HSGA Telangana",
            role: "Infrastructure Oversight",
            avatar: "https://res.cloudinary.com/dq2suftps/image/upload/v1722516854/logo_bivaq2.jpg"
        },
        testimonial: {
            text: "The precision engineering and attention to detail in our digital platform is remarkable. It's exactly what modern governance needs.",
            author: "HSGA Telangana",
            role: "Infrastructure Unit"
        },
        clientDetail: "HUS System is a state-governed digital infrastructure module designed for the tracking, allocation, and monitoring of large-scale infrastructure projects, resource management, and regional development programs across Telangana. The system coordinates operations between municipal offices, state engineers, and financial oversight boards, requiring robust security permissions and data integrity.",
        challenge: "Government administrators lacked unified visibility into project funding and milestones across dozens of active municipal regions. Information was siloed in local systems, reporting took weeks to compile, and resource allocation was difficult to verify in real-time. They needed an audit-ready, secure portal with complex role-based access control.",
        delivered: [
            "Designed a comprehensive geographical visualization dashboard mapping project completion rates across municipal districts.",
            "Implemented strict role-based access control (RBAC) ensuring data protection and strict administrative compliance.",
            "Built a dynamic report generation tool compiling budgets, expenses, and timeline updates automatically.",
            "Integrated secure RESTful APIs to ingest real-time project metrics from local municipal offices.",
            "Implemented cloud-native data archiving to store years of state project history with high availability and integrity check systems."
        ],
        whyRedlix: "We were selected because we specialize in building highly structured, reliable database systems and secure administration panels that bring absolute transparency and operational control to large institutions. Our focus on secure data-flow architectures was essential for government compliance."
    },
    {
        title: "NSS CMRIT Chapter",
        slug: "nss-cmrit",
        link: "https://nsscmritvolunteers.vercel.app",
        category: "Educational Organization",
        image: "https://ik.imagekit.io/dypkhqxip/nss",
        description: "Website built for the student chapter with improved design and UX. Boosted interaction and conversion with fast loading and intuitive UX.",
        clientInfo: { hq: "Bangalore, India", industry: "Education", size: "Community-led" },
        services: ["Static Web Design", "Volunteer Management UI", "UX Audit"],
        quote: "Community engagement — Interactive, Vivid, Functional",
        founder: {
            name: "NSS CMRIT",
            role: "Student Chapter",
            avatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSiY63DjvYa-bL8ci8s5_KTiLm_9Mw_Wy0Xdw&s"
        },
        testimonial: {
            text: "An incredible collaboration that delivered beyond expectations. They transformed our vision into a beautiful, functional platform.",
            author: "NSS CMRIT",
            role: "Student Body"
        },
        clientDetail: "The National Service Scheme (NSS) chapter at CMRIT is a student-run community service organization coordinating volunteer activities, blood donation drives, environmental cleanups, and literacy programs across the region. To organize hundreds of students and drive civic participation, the chapter required an engaging digital hub to coordinate events, publish announcements, and log active volunteer contributions.",
        challenge: "The chapter relied on disjointed chat groups and paper forms to recruit volunteers and track hours. This led to poor student engagement, administrative overhead, and difficulty coordinating large-scale volunteer campaigns. There was no single source of truth for volunteer credits or event signups.",
        delivered: [
            "Developed a modern, mobile-first volunteer engagement portal with student dashboards.",
            "Built an automated registration system for volunteering events, social drives, and local cleanup initiatives.",
            "Implemented a gamified points tracking system showing leaderboards to boost student participation.",
            "Integrated email and SMS notification modules to keep volunteers updated on upcoming schedules.",
            "Structured an admin dashboard for organizers to monitor event turnout and volunteer impact statistics."
        ],
        whyRedlix: "Redlix partnered with the student-led body to deliver clean, engaging, and modern UI/UX design that resonates with college students and simplifies operational coordination. Our commitment to supporting community initiatives ensured an elite-grade design for a non-profit organization."
    },
    {
        title: "Stories At Scale",
        slug: "stories-at-scale",
        link: "https://storiesatscale.com",
        category: "Social Media Marketing Agency",
        image: "https://ik.imagekit.io/dypkhqxip/sas",
        description: "High-performance marketing optimization dashboard and client campaign engine. Streamlining digital asset tracking and scaling multi-channel workflows.",
        clientInfo: { hq: "Telangana, India", industry: "Social Media & Advertising", size: "Growing Agency" },
        services: ["Campaign Operations Design", "Asset Orchestration Engine", "Analytics Dashboard"],
        quote: "Creative intelligence at scale — High-performance, Automated, Scalable",
        founder: {
            name: "Harshith Sai Tunguntla",
            role: "CEO, SAS",
            avatar: "https://res.cloudinary.com/dsqqrpzfl/image/upload/v1771184658/Screenshot_2026-02-16_at_01.14.02_btxipo.png"
        },
        testimonial: {
            text: "Redlix has been an exceptional partner. The custom content and tracking analytics engine they delivered exceeded our expectations in every way. Truly elite systems engineering.",
            author: "Harshith Sai Tunguntla",
            role: "CEO @ SAS"
        },
        clientDetail: "Stories At Scale (SAS) is a fast-growing creative and social media marketing agency facilitating high-throughput advertising campaigns, digital asset management, and creator partnership trackers for a global brand portfolio. They required a robust, highly interactive campaign intelligence engine to automate digital assets pipelines, coordinate creator posts, and deliver real-time performance analytics under a single unified ecosystem.",
        challenge: "The agency faced bottlenecks in manual campaign tracking and content verification across diverse channels. Compiling analytics reports for clients took days, and delayed asset reviews led to launch frictions. They needed an interface that could ingest real-time engagement metrics, check creator posting schedules, and streamline digital asset approvals.",
        delivered: [
            "Built a custom real-time campaign dashboard utilizing Next.js and high-frequency database triggers.",
            "Integrated social media analytics APIs to aggregate views, clicks, and conversion metrics in real-time.",
            "Developed an interactive media asset review pipeline with instant annotation and client approval workflows.",
            "Engineered an automated creator invoice generation engine scaling partner payouts and campaign tracking.",
            "Implemented edge-cached analytics pages providing clients with instant access to campaign performance metrics."
        ],
        whyRedlix: "Redlix specializes in high-throughput digital systems and campaign tracking pipelines. Our execution allowed SAS to reduce campaign turnaround times by 40% while delivering a modern, high-fidelity experience to their global brand clients."
    },
    {
        title: "National E-Commerce Platform",
        slug: "national-ecommerce",
        link: "https://shop.hsgatelangana.com",
        category: "Retail & Commerce",
        image: "https://ik.imagekit.io/dypkhqxip/shop",
        description: "High-conversion online retail store with real-time inventory synchronization. Delivered seamless global checkout and multi-currency support.",
        clientInfo: { hq: "Telangana, India", industry: "Government & Commerce", size: "State-wide" },
        services: ["Retail Platform Development", "Inventory Sync Engine", "Payment Gateways Integration"],
        quote: "Empowering regional trade — Seamless, Secure, Scalable",
        founder: {
            name: "HSGA Telangana",
            role: "Digital Initiative",
            avatar: "https://res.cloudinary.com/dq2suftps/image/upload/v1722516854/logo_bivaq2.jpg"
        },
        testimonial: {
            text: "The e-commerce platform developed by Redlix has bridged the gap between regional artisans and the global consumer base. An exceptional state initiative.",
            author: "HSGA Telangana",
            role: "Digital Initiative"
        },
        clientDetail: "The National E-Commerce Platform is a state-sponsored retail initiative by HSGA Telangana. Designed to empower local weavers, craftsmen, and small-scale cooperative industries across the state of Telangana, the platform provides a unified digital storefront to market and sell premium traditional goods directly to national and global consumers.",
        challenge: "Local cooperative societies and traditional artisans lacked direct digital marketing access and transaction infrastructures. The state required an automated commerce engine capable of real-time inventory synchronization across hundreds of distributed artisan hubs, high-capacity traffic resilience, and regional payment integration.",
        delivered: [
            "Engineered a lightweight React-based headless storefront optimized for rural and mobile networks.",
            "Developed a custom single-page checkout flow reducing purchase friction and cart drop-offs.",
            "Integrated regional logistics APIs with state transit networks for automated delivery updates.",
            "Embedded secure transaction modules supporting multiple local payment modes and UPI.",
            "Structured an easy-to-use seller administration dashboard translated into regional languages."
        ],
        whyRedlix: "Redlix was selected due to our expertise in constructing robust public infrastructure portals and our commitment to high-performance, responsive design that highlights Telangana's premium handcraft heritage in an elegant, state-of-the-art interface."
    }
];

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const project = projects.find(p => p.slug === slug);

    if (!project) {
        notFound();
    }

    const currentIndex = projects.findIndex(p => p.slug === slug);
    const prevProject = projects[(currentIndex - 1 + projects.length) % projects.length];
    const nextProject = projects[(currentIndex + 1) % projects.length];

    const SocialActionsBar = () => (
        <div className="flex items-center bg-[#f3f4f6] px-5 py-3 rounded-full w-fit gap-5 shadow-sm border border-gray-100/50">
            <a href={project.link} target="_blank" rel="noopener noreferrer" className="text-black hover:opacity-60 transition-opacity">
                <Link2 className="w-4 h-4" strokeWidth={3} />
            </a>
            <div className="w-[1px] h-4 bg-gray-300/60" />
            <div className="flex items-center gap-4">
                <a href={`/portfolio/${prevProject.slug}`} className="text-black hover:opacity-60 transition-opacity">
                    <ArrowLeft className="w-4 h-4 text-black" strokeWidth={3} />
                </a>
                <a href={`/portfolio/${nextProject.slug}`} className="text-black hover:opacity-60 transition-opacity">
                    <ArrowRight className="w-4 h-4 text-black" strokeWidth={3} />
                </a>
            </div>
            <div className="w-[1px] h-4 bg-gray-300/60" />
            <div className="flex items-center gap-4 text-black">
                <a href="#" className="hover:opacity-60 transition-opacity"><XIcon className="w-4 h-4" /></a>
                <a href="#" className="hover:opacity-60 transition-opacity"><LinkedinIcon className="w-4 h-4" /></a>
            </div>
        </div>
    );

    return (
        <div className="flex flex-col min-h-screen bg-white font-sans text-black pt-20 lg:pt-24">
            <main className="flex-grow">
                {/* Hero Header */}
                <section className="max-w-[1500px] mx-auto px-6 lg:px-12 py-6 md:py-8 border-b border-gray-100">
                    <div className="flex flex-col md:flex-row items-center gap-8 lg:gap-14">
                        <div className="w-full lg:max-w-4xl">
                            <div className="flex items-center gap-2 text-[13px] text-gray-500 mb-4">
                                <Link href="/portfolio" className="hover:text-[#E61E32] transition-colors">Portfolio</Link>
                                <span>/</span>
                                <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded text-[11px] font-bold capitalize">{project.slug.split('-')[0]}</span>
                            </div>

                            <h1 className="text-[20px] md:text-[26px] lg:text-[30px] font-bold leading-[1.2] tracking-tight mb-6">
                                {project.title} — a bespoke digital experience, brought to life by Redlix
                            </h1>

                            <div className="mb-4">
                                <p className="text-[13px] text-gray-500 mb-2 font-semibold">A conversation with:</p>
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden">
                                        <img src={project.founder.avatar} alt={project.founder.name} className="w-full h-full object-cover" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-[15px]">{project.founder.name}</p>
                                        <p className="text-[13px] text-[#E61E32] font-semibold">{project.founder.role}</p>
                                    </div>
                                </div>
                            </div>

                            <SocialActionsBar />
                        </div>


                    </div>
                </section>

                {/* Main Content Area */}
                <section className="max-w-[1500px] mx-auto px-6 lg:px-12 py-8 lg:py-12">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">

                        {/* Column 1: Metadata Sidebar */}
                        <div className="lg:col-span-3 space-y-12">
                            <div className="border-t border-gray-100 pt-8">
                                <p className="text-[11px] font-bold text-gray-400 tracking-wider mb-3">About</p>
                                <div className="flex items-center gap-2 mb-3">
                                    <h3 className="text-[20px] font-bold tracking-tight">{project.title}</h3>
                                    <a href={project.link} target="_blank" rel="noopener noreferrer" className="hover:opacity-60 transition-opacity">
                                        <Link2 className="w-4 h-4 text-gray-400" />
                                    </a>
                                </div>
                                <p className="text-[14px] text-gray-500 leading-relaxed">
                                    {project.clientDetail}
                                </p>
                            </div>

                            <div className="border-t border-gray-100 pt-8 space-y-8">
                                <div>
                                    <p className="text-[11px] font-bold text-gray-400 tracking-wider mb-2">HQ</p>
                                    <p className="text-[14px] font-medium text-black">{project.clientInfo.hq}</p>
                                </div>
                                <div>
                                    <p className="text-[11px] font-bold text-gray-400 tracking-wider mb-2">Industry</p>
                                    <p className="text-[14px] font-medium text-black">{project.clientInfo.industry}</p>
                                </div>
                                <div>
                                    <p className="text-[11px] font-bold text-gray-400 tracking-wider mb-2">Company Size</p>
                                    <p className="text-[14px] font-medium text-black">{project.clientInfo.size}</p>
                                </div>
                            </div>
                        </div>

                        {/* Column 2: Core Body Content */}
                        <div className="lg:col-span-6">
                            <h2 className="text-[24px] md:text-[30px] font-normal leading-tight tracking-tight mb-8 border-b border-gray-100 pb-6">
                                " {project.quote} "
                            </h2>

                            <div className="mb-8 overflow-hidden border border-gray-100 bg-gray-50 aspect-video flex items-center justify-center">
                                <img 
                                    src={project.image} 
                                    alt={project.title} 
                                    className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500" 
                                />
                            </div>

                            <div className="space-y-8">
                                <div>
                                    <h3 className="text-[18px] md:text-[20px] font-bold tracking-tight mb-3 text-[#202124]">The client — {project.title}</h3>
                                    <p className="text-[15px] text-gray-600 leading-relaxed">
                                        {project.clientDetail}
                                    </p>
                                </div>

                                <div>
                                    <h3 className="text-[18px] md:text-[20px] font-bold tracking-tight mb-3 text-[#202124]">The Challenge</h3>
                                    <p className="text-[15px] text-gray-600 leading-relaxed">
                                        {project.challenge}
                                    </p>
                                </div>

                                <div>
                                    <h3 className="text-[18px] md:text-[20px] font-bold tracking-tight mb-4 text-[#202124]">How Redlix delivered</h3>
                                    <ul className="space-y-4">
                                        {project.delivered.map((item, i) => (
                                            <li key={i} className="flex items-start gap-3.5 text-[15px] text-gray-600">
                                                <CheckCircle2 className="w-5 h-5 text-[#E61E32] mt-0.5 shrink-0" />
                                                <span className="font-normal">{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div>
                                    <h3 className="text-[18px] md:text-[20px] font-bold tracking-tight mb-3 text-[#202124]">Why Redlix?</h3>
                                    <p className="text-[15px] text-gray-600 leading-relaxed">
                                        {project.whyRedlix}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Column 3: Services & Sharing */}
                        <div className="lg:col-span-3 space-y-8">
                            <div className="border-t border-gray-100 pt-6">
                                <p className="text-[11px] font-bold text-gray-400 tracking-wider mb-4">Services offered</p>
                                <ul className="space-y-3">
                                    {project.services.map((service, i) => (
                                        <li key={i} className="text-[14px] font-medium text-black">
                                            {service}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="pt-4">
                                <SocialActionsBar />
                            </div>
                        </div>

                    </div>
                </section>

                {/* Custom Testimonial Section */}
                <section className="w-full bg-[#f9fafb] py-12 lg:py-16 border-y border-gray-100">
                    <div className="max-w-[1500px] mx-auto px-6 lg:px-12">
                        <div className="flex flex-col lg:flex-row gap-12 items-center">
                            <div className="w-full lg:w-1/3">
                                <h2 className="text-[28px] md:text-[34px] font-bold tracking-tight leading-tight text-black mb-4">
                                    Results that <br /> speak for <br /> themselves.
                                </h2>
                                <p className="text-[15px] text-gray-500 leading-relaxed max-w-sm">
                                    Direct feedback from our key stakeholders on how this specific solution transformed their digital operations.
                                </p>
                            </div>

                            <div className="w-full lg:w-2/3">
                                <div className="bg-white p-8 md:p-10 relative shadow-sm border border-gray-100">
                                    <Quote className="absolute top-6 right-6 w-10 h-10 text-[#E61E32]/10" />
                                    <p className="text-[18px] md:text-[20px] text-black leading-relaxed mb-6 italic">
                                        "{project.testimonial.text}"
                                    </p>
                                    <div className="flex items-center gap-4">
                                        <img src={project.founder.avatar} alt={project.founder.name} className="w-14 h-14 object-cover rounded-none" />
                                        <div>
                                            <h4 className="font-bold text-[16px]">{project.testimonial.author}</h4>
                                            <p className="text-[13px] text-[#E61E32] font-semibold tracking-wider">{project.testimonial.role}</p>
                                        </div>
                                    </div>
                                </div>
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

export function generateStaticParams() {
    return projects.map((project) => ({
        slug: project.slug,
    }));
}
