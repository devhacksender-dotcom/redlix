import type { LegalSection } from "@/components/legal/LegalDocLayout";

export const termsSections: LegalSection[] = [
    {
        id: "overview",
        title: "Overview & identity",
        content: (
            <>
                <p>
                    These Terms of Service govern the professional relationship and use of services provided by Redlix Studio. &quot;Redlix Studio&quot; functions solely as a brand name and professional identity for the freelance work of Rishi Rohan Kalapala, based in Hyderabad, India.
                </p>
                <p>
                    By engaging our services or using this website, you acknowledge that you are entering into a professional agreement with an independent freelancer and not a registered corporation or legal entity.
                </p>
            </>
        ),
    },
    {
        id: "services",
        title: "Professional services",
        content: (
            <>
                <p>
                    Redlix Studio provides bespoke digital services, including but not limited to web development, UI/UX design, and architectural management systems.
                </p>
                <p>
                    The scope of each project is defined in individual service proposals or support tickets. We reserve the right to refuse service or terminate engagements that violate our professional standards or ethical guidelines.
                </p>
            </>
        ),
    },
    {
        id: "intellectual-property",
        title: "Intellectual property",
        content: (
            <>
                <p>
                    Upon full payment of all fees, the ownership of final custom deliverables is transferred to the client. However, Redlix Studio retains ownership of all underlying methodologies, reusable architectural patterns, and our proprietary management framework.
                </p>
                <p>
                    Additionally, all brand assets, including logos, wordmarks, glyphs, color palettes, and typographic assets downloaded from this site are the exclusive intellectual property of Redlix Studio. These assets are protected by copyright laws and are provided for authorized media, partner, or client representation of Redlix Studio only. Any modifications (outside of authorized color palette usage), unauthorized commercial distribution, or use that misrepresents the brand is strictly prohibited.
                </p>
                <p>
                    Unauthorized distribution, reverse engineering, or resale of the platform&apos;s core architectural components is strictly prohibited.
                </p>
            </>
        ),
    },
    {
        id: "payment",
        title: "Payment terms",
        content: (
            <>
                <p>
                    Payments for services are structured according to the milestones defined in the project scope. Failure to meet payment deadlines may result in the suspension of service delivery and a temporary lockout from the project management interface.
                </p>
                <p>
                    All fees are non-refundable once the work on a specific milestone has commenced, reflecting the time-intensive nature of freelance engineering.
                </p>
            </>
        ),
    },
    {
        id: "liability",
        title: "Limitation of liability",
        content: (
            <>
                <p>
                    Redlix Studio and Rishi Rohan Kalapala shall not be held liable for any indirect, consequential, or punitive damages arising from the use of the platform or services.
                </p>
                <p>
                    While we implement rigorous security and performance standards across our internal systems, we do not guarantee that services will be entirely free of errors or interruptions, particularly those caused by third-party hosting, infrastructure, or API failures.
                </p>
            </>
        ),
    },
    {
        id: "client-responsibilities",
        title: "Client responsibilities",
        content: (
            <p>
                Clients are responsible for providing accurate project requirements, maintaining the confidentiality of their Client IDs and support ticket credentials, and ensuring they have the legal right to all materials provided for project use.
            </p>
        ),
    },
    {
        id: "governing-law",
        title: "Governing law",
        content: (
            <p>
                These terms are governed by the laws of India. Any legal actions or proceedings related to these terms shall be brought exclusively in the courts of Hyderabad, Telangana.
            </p>
        ),
    },
    {
        id: "contact",
        title: "Contact & notice",
        content: (
            <>
                <p>For any questions regarding these Terms of Service or to initiate a formal notice, please contact us:</p>
                <ul className="list-none pl-0 space-y-1">
                    <li><strong>Email:</strong> help.ckrdatapoint@gmail.com</li>
                    <li><strong>Website:</strong> www.redlix.co.in</li>
                    <li><strong>Founder:</strong> Rishi Rohan Kalapala</li>
                </ul>
                <p className="text-[13px] text-gray-500">
                    Redlix Studio is an independent freelance brand and not a legal entity or registered company. Usage of this site and its services constitutes acceptance of these terms.
                </p>
            </>
        ),
    },
];
