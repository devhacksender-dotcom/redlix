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
        title: "Dhasha Media",
        slug: "dhasha-media",
        link: "https://dhashamedia.com",
        category: "Internal Operations Engine",
        image: "https://ik.imagekit.io/dypkhqxip/ab%20(1).png",
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
        }
    },
    {
        title: "HSGA Telangana",
        slug: "hsga-telangana",
        link: "https://hsgatelangana.com",
        category: "Government Infrastructure",
        image: "https://ik.imagekit.io/dypkhqxip/Untitled%20design%20(1).png",
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
        }
    },
    {
        title: "SmartFit AI",
        slug: "smartfit",
        link: "https://smartfitai.com",
        category: "AI Fitness & Wellness",
        image: "https://ik.imagekit.io/dypkhqxip/smartfitai",
        description: "AI-powered fitness platform delivering custom training programs and real-time posture analysis.",
        clientInfo: { hq: "Bengaluru, Karnataka", industry: "AI & Wellness", size: "Startup (<50)" },
        services: ["AI Integration", "UI/UX Design", "Custom Fitness Engine"],
        quote: "AI training acceleration — Precise, Dynamic, Engagement-focused",
        founder: {
            name: "Jaswanth Sonti",
            role: "Founder, SmartFit AI",
            avatar: "https://res.cloudinary.com/dsqqrpzfl/image/upload/v1771184951/Screenshot_2026-02-16_at_01.18.59_yodn7t.png"
        },
        testimonial: {
            text: "Our user engagement doubled since launch. The platform Redlix built for us doesn't just track postures - it motivates and scales our user base effortlessly.",
            author: "Jaswanth Sonti",
            role: "Founder @ SmartFit AI"
        }
    },
    {
        title: "HUS System",
        slug: "hus-system",
        link: "https://hus.hsgatelangana.com",
        category: "Government Infrastructure",
        image: "https://ik.imagekit.io/dypkhqxip/Untitled%20design.png",
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
        }
    },
    {
        title: "NSS CMRIT Chapter",
        slug: "nss-cmrit",
        link: "https://nsscmritvolunteers.vercel.app",
        category: "Educational Organization",
        image: "https://ik.imagekit.io/dypkhqxip/ab%20(4).png",
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
        }
    },
    {
        title: "National E-Commerce Platform",
        slug: "national-ecommerce",
        link: "shop.hsgatelangana.com",
        category: "Retail & Commerce",
        image: "https://ik.imagekit.io/dypkhqxip/ab%20(2).png",
        description: "High-conversion online retail store with real-time inventory synchronization. Delivered seamless global checkout and multi-currency support.",
        clientInfo: { hq: "Telangana, India", industry: "E-Commerce", size: "Growing SME" },
        services: ["Retail Platform", "Inventory Engine", "Payment Integration"],
        quote: "Retail without borders — Resilient, Global, Optimized",
        founder: {
            name: "Harshith Sai Tunguntla",
            role: "CEO, SAS",
            avatar: "https://res.cloudinary.com/dsqqrpzfl/image/upload/v1771184658/Screenshot_2026-02-16_at_01.14.02_btxipo.png"
        },
        testimonial: {
            text: "Redlix has been an exceptional partner. The solution they delivered exceeded our expectations in every way. Truly elite engineering.",
            author: "Harshith Sai Tunguntla",
            role: "CEO @ SAS"
        }
    },
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
                <section className="max-w-[1500px] mx-auto px-6 lg:px-12 py-8 md:py-12 border-b border-gray-100">
                    <div className="flex flex-col md:flex-row items-center gap-8 lg:gap-14">
                        <div className="w-full lg:max-w-4xl">
                            <div className="flex items-center gap-2 text-[13px] text-gray-500 mb-6">
                                <Link href="/portfolio" className="hover:text-[#E61E32] transition-colors">Portfolio</Link>
                                <span>/</span>
                                <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider">{project.slug.split('-')[0]}</span>
                            </div>

                            <h1 className="text-[32px] md:text-[42px] lg:text-[48px] font-bold leading-[1.1] tracking-tight mb-8">
                                {project.title} — a bespoke digital experience, brought to life by Redlix
                            </h1>

                            <div className="mb-6">
                                <p className="text-[14px] text-gray-500 mb-4 uppercase tracking-[0.2em] font-semibold text-[10px]">A conversation with:</p>
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden shadow-sm">
                                        <img src={project.founder.avatar} alt={project.founder.name} className="w-full h-full object-cover grayscale" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-[15px]">{project.founder.name}</p>
                                        <p className="text-[13px] text-gray-400 font-medium uppercase tracking-widest">{project.founder.role}</p>
                                    </div>
                                </div>
                            </div>

                            <SocialActionsBar />
                        </div>


                    </div>
                </section>

                {/* Main Content Area */}
                <section className="max-w-[1500px] mx-auto px-6 lg:px-12 py-12 lg:py-16">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">

                        {/* Column 1: Metadata Sidebar */}
                        <div className="lg:col-span-3 space-y-12">
                            <div className="border-t border-gray-100 pt-10">
                                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-4">About</p>
                                <div className="flex items-center gap-2 mb-4">
                                    <h3 className="text-[20px] font-bold tracking-tight">{project.slug.toUpperCase().split('-')[0]}</h3>
                                    <a href={project.link} target="_blank" rel="noopener noreferrer" className="hover:opacity-60 transition-opacity">
                                        <Link2 className="w-4 h-4 text-gray-400" />
                                    </a>
                                </div>
                                <p className="text-[14px] text-gray-500 leading-relaxed font-light">
                                    {project.description}
                                </p>
                            </div>

                            <div className="border-t border-gray-100 pt-10 space-y-10">
                                <div>
                                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">HQ</p>
                                    <p className="text-[14px] font-medium text-black">{project.clientInfo.hq}</p>
                                </div>
                                <div>
                                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">Industry</p>
                                    <p className="text-[14px] font-medium text-black">{project.clientInfo.industry}</p>
                                </div>
                                <div>
                                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">Company Size</p>
                                    <p className="text-[14px] font-medium text-black">{project.clientInfo.size}</p>
                                </div>
                            </div>
                        </div>

                        {/* Column 2: Core Body Content */}
                        <div className="lg:col-span-6">
                            <h2 className="text-[24px] md:text-[30px] font-normal leading-tight tracking-tight mb-12 border-b border-gray-100 pb-8">
                                " {project.quote} "
                            </h2>

                            <div className="space-y-12">
                                <div>
                                    <h3 className="text-[20px] md:text-[24px] font-bold tracking-tight mb-4">The client — {project.title}</h3>
                                    <p className="text-[16px] text-gray-600 leading-relaxed font-light mb-6">
                                        Working with {project.title} meant building a bridge between visionary goals and technical execution. Our mission was to deliver a solution that doesn't just work, but dominates its niche through superior design and performance.
                                    </p>
                                    <p className="text-[16px] text-gray-600 leading-relaxed font-light">
                                        The mandate was clear: sustained momentum, high friction-reduction, and a digital infrastructure built for massive scale without compromising on visual fidelity.
                                    </p>
                                </div>

                                <div>
                                    <h3 className="text-[20px] md:text-[24px] font-bold tracking-tight mb-4">The Challenge</h3>
                                    <p className="text-[16px] text-gray-600 leading-relaxed font-light">
                                        Redefining complex workflows through a minimal, interactive interface while ensuring every micro-interaction feels intentional. We had to balance heavy background processing with a lightweight, 3D-heavy or data-heavy frontend, ensuring record-breaking page speeds.
                                    </p>
                                </div>

                                <div>
                                    <h3 className="text-[20px] md:text-[24px] font-bold tracking-tight mb-6">How Redlix delivered</h3>
                                    <ul className="space-y-6">
                                        {[
                                            "Built a custom high-performance engine utilizing latest Next.js architectures.",
                                            "Implemented a unified design system that scales across all user touchpoints.",
                                            "Optimized for sub-second response times even under enterprise-grade loads.",
                                            "Deployed a secure, scalable cloud infrastructure with zero-downtime promises.",
                                            "Continuous integration and delivery pipelines for rapid feature iteration."
                                        ].map((item, i) => (
                                            <li key={i} className="flex items-start gap-4 text-[15px] text-gray-600">
                                                <CheckCircle2 className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
                                                <span className="font-light">{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div>
                                    <h3 className="text-[20px] md:text-[24px] font-bold tracking-tight mb-4">Why Redlix?</h3>
                                    <p className="text-[16px] text-gray-600 leading-relaxed font-light">
                                        Because we don't just build websites; we engineer digital products that turn business challenges into competitive advantages. It's about precision, strategy, and execution without gaps.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Column 3: Services & Sharing */}
                        <div className="lg:col-span-3 space-y-8">
                            <div className="border-t border-gray-100 pt-6">
                                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-6">Services Offered</p>
                                <ul className="space-y-4">
                                    {project.services.map((service, i) => (
                                        <li key={i} className="text-[14px] font-medium text-black">
                                            {service}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="pt-6">
                                <SocialActionsBar />
                            </div>
                        </div>

                    </div>
                </section>

                {/* Custom Testimonial Section */}
                <section className="w-full bg-[#f9fafb] py-20 lg:py-28 border-y border-gray-100">
                    <div className="max-w-[1500px] mx-auto px-6 lg:px-12">
                        <div className="flex flex-col lg:flex-row gap-16 items-center">
                            <div className="w-full lg:w-1/3">
                                <h2 className="text-[32px] md:text-[40px] font-bold tracking-tight leading-tight text-black mb-6">
                                    Results that <br /> speak for <br /> themselves.
                                </h2>
                                <p className="text-[16px] text-gray-500 leading-relaxed max-w-sm">
                                    Direct feedback from our key stakeholders on how this specific solution transformed their digital operations.
                                </p>
                            </div>

                            <div className="w-full lg:w-2/3">
                                <div className="bg-white p-12 md:p-16 relative shadow-sm border border-gray-100">
                                    <Quote className="absolute top-8 right-8 w-12 h-12 text-[#E61E32]/10" />
                                    <p className="text-[20px] md:text-[24px] text-black leading-relaxed font-light mb-10 italic">
                                        "{project.testimonial.text}"
                                    </p>
                                    <div className="flex items-center gap-5">
                                        <img src={project.founder.avatar} alt={project.founder.name} className="w-16 h-16 object-cover rounded-none grayscale" />
                                        <div>
                                            <h4 className="font-bold text-[18px]">{project.testimonial.author}</h4>
                                            <p className="text-[14px] text-[#E61E32] font-semibold uppercase tracking-widest">{project.testimonial.role}</p>
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
