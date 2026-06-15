import { Metadata } from "next";
import Link from "next/link";
import CorporateFooter from "@/components/CorporateFooter";
import LegalDocLayout, { LegalSection } from "@/components/legal/LegalDocLayout";

export const metadata: Metadata = {
    title: "Sitemap",
    description: "Navigate through the pages, case studies, internal portals, and agreements of Redlix Studio.",
};

const sitemapSections: LegalSection[] = [
    {
        id: "core-directory",
        title: "Core Directory",
        content: (
            <>
                <p>Access the primary pages of the Redlix Studio marketing and service site:</p>
                <ul>
                    <li>
                        <Link href="/">Home Page</Link> — Welcome to Redlix Studio, detailing our core IT services and digital craft.
                    </li>
                    <li>
                        <Link href="/about-us">About Us</Link> — Learn about our freelance studio mission, team details, and client commitments.
                    </li>
                    <li>
                        <Link href="/resources">Resources</Link> — Discover tools, code blocks, templates, and reference assets created by the studio.
                    </li>
                </ul>
            </>
        )
    },
    {
        id: "case-studies",
        title: "Case Studies (Our Work)",
        content: (
            <>
                <p>Browse our digital product cases, web engineering outcomes, and infrastructure solutions:</p>
                <ul>
                    <li>
                        <Link href="/portfolio">Our Portfolio</Link> — Explore the full showcase of our launch history and client work.
                    </li>
                    <li>
                        <Link href="/portfolio/piscidrop">PisciDrop</Link> — Full-stack platform case study.
                    </li>
                    <li>
                        <Link href="/portfolio/dhasha-media">Dhasha Media</Link> — Web application architecture case study.
                    </li>
                    <li>
                        <Link href="/portfolio/hsga-telangana">HSGA Telangana</Link> — IT infrastructure and deployment case study.
                    </li>
                    <li>
                        <Link href="/portfolio/forge-digital">Forge Digital</Link> — Enterprise partner portal case study.
                    </li>
                    <li>
                        <Link href="/portfolio/hus-system">HUS System</Link> — Custom database management systems case study.
                    </li>
                    <li>
                        <Link href="/portfolio/nss-cmrit">NSS CMRIT Chapter</Link> — Community web platform case study.
                    </li>
                    <li>
                        <Link href="/portfolio/stories-at-scale">Stories At Scale</Link> — Enterprise content engine case study.
                    </li>
                    <li>
                        <Link href="/portfolio/national-ecommerce">National E-Commerce</Link> — High-performance retail architecture case study.
                    </li>
                </ul>
            </>
        )
    },
    {
        id: "portals",
        title: "Internal Portals & Apps",
        content: (
            <>
                <p>Secure administrative and workflow access portals for our team, clients, and partners:</p>
                <ul>
                    <li>
                        <Link href="/employee/login">Employee Portal</Link> — Internal workspace for punch-in/out, logs, and task submissions.
                    </li>
                    <li>
                        <Link href="/admin/login">Admin Dashboard</Link> — Administrative dashboard for workflow control, meetings, and payroll.
                    </li>
                    <li>
                        <Link href="/department/login">Department Portal</Link> — Specialized system access tailored to distinct operating departments.
                    </li>
                    <li>
                        <a href="https://app.redlix.co.in" target="_blank" rel="noopener noreferrer">
                            Redlix App (PWA) <span className="text-[11px] text-zinc-400 font-mono font-normal">↗</span>
                        </a> — Enterprise systems, exams, and candidate management platform.
                    </li>
                </ul>
            </>
        )
    },
    {
        id: "legal-compliance",
        title: "Legal & Compliance",
        content: (
            <>
                <p>Essential agreements, terms, policies, and cookie setting guidelines for our site visitors:</p>
                <ul>
                    <li>
                        <Link href="/privacy">Privacy Policy</Link> — Guidelines and rules detailing how we collect, process, and protect your data.
                    </li>
                    <li>
                        <Link href="/terms">Terms of Service</Link> — Standard agreement, client responsibilities, and contract terms.
                    </li>
                    <li>
                        <Link href="/cookies">Cookies Policy</Link> — Breakdown of cookie usage, local storage preferences, and Google Analytics.
                    </li>
                </ul>
            </>
        )
    }
];

export default function SitemapPage() {
    return (
        <>
            <LegalDocLayout
                title="Sitemap"
                description="Use this page directory to navigate all public sections, case studies, internal portal logins, and policy files of www.redlix.co.in."
                updated="June 15, 2026"
                effective="June 15, 2026"
                sections={sitemapSections}
            />
            <CorporateFooter />
        </>
    );
}
