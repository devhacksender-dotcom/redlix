import Link from "next/link";
import type { LegalSection } from "@/components/legal/LegalDocLayout";

export const privacySections: LegalSection[] = [
    {
        id: "overview",
        title: "Overview",
        content: (
            <>
                <p>
                    This Privacy Policy sets out how Redlix Studio, operating as an independent freelance studio under the brand name &quot;Redlix Studio,&quot; collects, uses, stores, and protects personal and professional information shared through its website and service channels.
                </p>
                <p>
                    Redlix Studio is not a registered company or legal entity. It functions solely as a freelance brand operated by Rishi Rohan Kalapala, based in Hyderabad, Telangana, India. This policy is governed by the Information Technology Act, 2000 and the Digital Personal Data Protection (DPDP) Act, 2023.
                </p>
                <p>
                    By accessing our website or engaging our services, you acknowledge and agree to the practices described in this policy.
                </p>
            </>
        ),
    },
    {
        id: "scope",
        title: "Scope of this policy",
        content: (
            <>
                <p>This policy applies to all personal data collected through:</p>
                <ul>
                    <li>The Redlix Studio website (www.redlix.co.in)</li>
                    <li>Email correspondence and inquiry forms</li>
                    <li>The Support Ticketing System (Raise a Ticket / Track Ticket)</li>
                    <li>Any other communication channel used in connection with freelance services</li>
                </ul>
            </>
        ),
    },
    {
        id: "information-collected",
        title: "Information we collect",
        content: (
            <>
                <p>We collect only information voluntarily provided by you in the course of using our services or contacting us. This may include:</p>
                <h4>Identity & contact information</h4>
                <p>Full name, email address, phone number (if provided).</p>
                <h4>Project & service information</h4>
                <p>Project requirements and scope details, target URLs and change descriptions, Client Identifiers (Client IDs), support ticket details and references.</p>
                <h4>Technical information</h4>
                <p>Browser type and IP address (collected automatically via server logs), pages visited and time of access.</p>
                <p>
                    We do not intentionally collect sensitive personal data (e.g., financial information, government IDs, health records) unless strictly required for a specific engagement and with your explicit consent.
                </p>
            </>
        ),
    },
    {
        id: "how-we-use",
        title: "How we use your information",
        content: (
            <>
                <p>All information collected is used solely for legitimate freelance business purposes, including:</p>
                <ul>
                    <li>Responding to your inquiries and communications</li>
                    <li>Managing and delivering agreed freelance services</li>
                    <li>Processing and tracking support tickets</li>
                    <li>Maintaining project records and internal coordination</li>
                    <li>Complying with applicable legal obligations</li>
                </ul>
                <p>
                    We do not use your data for advertising, profiling, automated decision-making, or any commercial purpose beyond the services you have engaged us for. Redlix Studio does not monetize or sell personal information under any circumstances.
                </p>
            </>
        ),
    },
    {
        id: "lawful-basis",
        title: "Lawful basis for processing",
        content: (
            <>
                <p>We process your personal data on the following lawful bases under the DPDP Act, 2023:</p>
                <ul>
                    <li><strong>Consent:</strong> Where you have given us clear, affirmative consent to process your data for a specific purpose.</li>
                    <li><strong>Contractual necessity:</strong> Where processing is necessary to perform a freelance service you have requested.</li>
                    <li><strong>Legal obligation:</strong> Where processing is required to comply with applicable Indian laws.</li>
                    <li><strong>Legitimate interest:</strong> Where processing is necessary for our legitimate business interests, provided these are not overridden by your rights.</li>
                </ul>
            </>
        ),
    },
    {
        id: "support-tickets",
        title: "Support ticketing system",
        content: (
            <>
                <p>When you use the Raise a Ticket or Track Ticket features on our website, we collect specific data required to process your request, including:</p>
                <ul>
                    <li>Authorized submitter name</li>
                    <li>Client Identifier (Client ID)</li>
                    <li>Target URL(s) and detailed change descriptions</li>
                    <li>Ticket submission timestamp</li>
                </ul>
                <p>
                    This information is securely logged into our internal dashboard strictly to monitor, execute, and track service changes. A unique Ticket ID is generated for each request to enable transparent progress tracking. All ticket data is handled under strict confidentiality.
                </p>
            </>
        ),
    },
    {
        id: "data-storage",
        title: "Data storage and internal tools",
        content: (
            <>
                <p>
                    Client information may be stored within internal project management and collaboration tools used to plan, coordinate, and deliver freelance services. Access to such tools is strictly limited to the freelancer(s) directly engaged on your project.
                </p>
                <p>
                    Where third-party software-as-a-service (SaaS) tools are used (e.g., project management platforms, cloud storage, communication tools), data may be processed on their servers. Such tools are selected for their compliance with reasonable data security standards. We do not share your data with third-party tools beyond what is operationally necessary.
                </p>
            </>
        ),
    },
    {
        id: "data-security",
        title: "Data security",
        content: (
            <>
                <p>We implement industry-standard security practices across our freelance operations and our internal management systems, including:</p>
                <ul>
                    <li>Secure access controls and role-based permissions</li>
                    <li>Restricted access to client data on a need-to-know basis</li>
                    <li>Use of encrypted communication channels where applicable</li>
                    <li>Regular review of data handling practices</li>
                </ul>
                <p>
                    While we take reasonable steps to protect your information, no method of transmission or storage over the internet is completely secure. We cannot guarantee absolute security, and you provide your information at your own risk.
                </p>
            </>
        ),
    },
    {
        id: "data-retention",
        title: "Data retention",
        content: (
            <>
                <p>
                    We retain personal and project data only for as long as is necessary to fulfill the purposes for which it was collected, or as required by applicable law. Our standard retention schedule is as follows:
                </p>
                <ul>
                    <li><strong>Active project data:</strong> Retained for the duration of the project engagement plus 12 months.</li>
                    <li><strong>Support ticket records:</strong> Retained for 24 months from ticket closure, unless contractually extended.</li>
                    <li><strong>General correspondence:</strong> Retained for 12 months from last communication.</li>
                </ul>
                <p>Upon expiry of the applicable retention period, data will be securely deleted or anonymized unless retention is contractually or legally mandated.</p>
            </>
        ),
    },
    {
        id: "third-party",
        title: "Third-party disclosure",
        content: (
            <>
                <p>We do not share, sell, rent, or trade your personal information with third parties, except in the following limited circumstances:</p>
                <ul>
                    <li><strong>Service delivery:</strong> Where a third party is engaged solely to assist in fulfilling a service explicitly requested by you (e.g., domain registration, hosting), and only to the extent necessary.</li>
                    <li><strong>Legal compliance:</strong> Where disclosure is required by law, court order, or regulatory authority under applicable Indian law.</li>
                </ul>
                <p>In all cases, third parties are engaged under confidentiality obligations and are prohibited from using your data for any other purpose.</p>
            </>
        ),
    },
    {
        id: "portfolio",
        title: "Portfolio and case studies",
        content: (
            <p>
                This website functions as a professional portfolio. Any projects, outcomes, or case studies displayed are shared in a generalized or anonymized manner. Proprietary client credentials, sensitive project data, or private materials are never disclosed publicly without your explicit prior written consent.
            </p>
        ),
    },
    {
        id: "your-rights",
        title: "Your rights",
        content: (
            <>
                <p>As a data principal under the Digital Personal Data Protection (DPDP) Act, 2023 and the Information Technology Act, 2000, you have the following rights:</p>
                <ul>
                    <li><strong>Right to access:</strong> Request access to the personal data we hold about you.</li>
                    <li><strong>Right to correction:</strong> Request correction of inaccurate or incomplete personal data.</li>
                    <li><strong>Right to erasure:</strong> Request deletion of your personal data, subject to legal or contractual obligations.</li>
                    <li><strong>Right to withdraw consent:</strong> Withdraw consent for data processing at any time, where processing is consent-based.</li>
                    <li><strong>Right to data portability:</strong> Request a copy of your data in a structured, commonly used format, where applicable.</li>
                    <li><strong>Right to grievance redressal:</strong> File a grievance regarding the processing of your personal data.</li>
                </ul>
                <p>
                    To exercise any of these rights, please contact our Grievance Officer at{" "}
                    <a href="mailto:help.ckrdatapoint@gmail.com">help.ckrdatapoint@gmail.com</a>. We will acknowledge your request within 72 hours and respond fully within 30 days, in accordance with applicable Indian law.
                </p>
            </>
        ),
    },
    {
        id: "grievance-officer",
        title: "Grievance officer",
        content: (
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-6 space-y-3">
                <p>In accordance with the Information Technology Act, 2000, and the DPDP Act, 2023, the following individual has been designated as the Grievance Officer for Redlix Studio:</p>
                <ul className="list-none pl-0 space-y-1">
                    <li><strong>Name:</strong> Rishi Rohan Kalapala</li>
                    <li><strong>Role:</strong> Founder & Grievance Officer</li>
                    <li>
                        <strong>Email:</strong>{" "}
                        <a href="mailto:help.ckrdatapoint@gmail.com">help.ckrdatapoint@gmail.com</a>
                    </li>
                </ul>
                <p className="text-[13px] text-gray-500 italic">
                    Response time: Grievances will be acknowledged within 72 hours and resolved within 30 days of receipt.
                </p>
            </div>
        ),
    },
    {
        id: "cookies",
        title: "Cookies and tracking",
        content: (
            <>
                <p>
                    Our website may use cookies and similar tracking technologies to improve user experience and analyze site traffic. Cookies are small data files stored on your device. You may configure your browser to refuse cookies, though this may affect certain site functionality.
                </p>
                <p>
                    Details of cookies used, their purpose, and duration are provided in our separate{" "}
                    <Link href="/cookies">Cookies Policy</Link>.
                </p>
            </>
        ),
    },
    {
        id: "governing-law",
        title: "Legal compliance",
        content: (
            <>
                <p>This Privacy Policy is governed by the laws of India, including but not limited to:</p>
                <ul>
                    <li>The Digital Personal Data Protection (DPDP) Act, 2023</li>
                    <li>The Information Technology Act, 2000 and its associated rules and regulations</li>
                    <li>Any other applicable Indian data protection and privacy legislation</li>
                </ul>
                <p>
                    Users accessing our website or services from outside India acknowledge that their information may be transferred to, and processed in, India in accordance with Indian law.
                </p>
            </>
        ),
    },
    {
        id: "changes",
        title: "Changes to this policy",
        content: (
            <p>
                We reserve the right to update or modify this Privacy Policy at any time. Any changes will be reflected on this page with a revised &quot;Last updated&quot; date. We encourage you to review this policy periodically. Your continued use of our services after changes are posted constitutes acceptance of the revised policy.
            </p>
        ),
    },
    {
        id: "contact",
        title: "Contact us",
        content: (
            <>
                <p>For any questions, concerns, or requests related to this Privacy Policy or our data handling practices, please contact us:</p>
                <ul className="list-none pl-0 space-y-1">
                    <li><strong>Email:</strong> help.ckrdatapoint@gmail.com</li>
                    <li><strong>Website:</strong> www.redlix.co.in</li>
                    <li><strong>Location:</strong> Hyderabad, Telangana, India</li>
                    <li><strong>Founder:</strong> Rishi Rohan Kalapala</li>
                </ul>
                <p className="text-[13px] text-gray-500">
                    This Privacy Policy forms part of the Redlix Studio Terms of Service and Cookies Policy. Redlix Studio operates as an independent freelance studio and is not a registered company or legal entity.
                </p>
            </>
        ),
    },
];
