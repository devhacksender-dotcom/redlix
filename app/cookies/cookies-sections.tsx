import Link from "next/link";
import type { LegalSection } from "@/components/legal/LegalDocLayout";

export const cookiesSections: LegalSection[] = [
    {
        id: "introduction",
        title: "Introduction",
        content: (
            <>
                <p>
                    This Cookies Policy explains how Redlix Studio uses cookies and similar tracking technologies when you visit www.redlix.co.in.
                </p>
                <p>
                    Redlix Studio operates as an independent freelance studio based in Hyderabad, Telangana, India. This policy should be read together with our{" "}
                    <Link href="/privacy">Privacy Policy</Link> and <Link href="/terms">Terms of Service</Link>.
                </p>
                <p>
                    When you first visit, a cookie consent banner lets you accept or decline optional analytics cookies. Essential cookies required for security and core functionality may still be used to operate the site. You can change your choice at any time by clearing site data in your browser or using the settings control in the consent banner (when shown).
                </p>
                <p>
                    This policy covers visitors from India and internationally. If local law grants you additional rights regarding cookies or tracking, we aim to honour those rights where applicable.
                </p>
            </>
        ),
    },
    {
        id: "what-are-cookies",
        title: "What are cookies",
        content: (
            <>
                <p>
                    Cookies are small text files stored on your device (computer, mobile phone, or tablet) when you visit a website. They help websites function efficiently and improve user experience.
                </p>
                <p>Cookies may collect information such as:</p>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-y-1">
                    <li>Browser type</li>
                    <li>Device type</li>
                    <li>IP address</li>
                    <li>Pages visited</li>
                    <li>Time spent on pages</li>
                    <li>Referring website</li>
                </ul>
                <p>
                    Cookies do not typically contain personally identifiable information on their own, but they may be linked to personal data if you voluntarily provide it through contact forms, support requests, or client enquiries.
                </p>
                <p>
                    We also use similar technologies, including <strong>local storage</strong> (to remember your cookie preferences), <strong>session storage</strong> (for temporary in-browser state), and <strong>pixels or tags</strong> embedded by analytics providers. References to &quot;cookies&quot; in this policy include these technologies where relevant.
                </p>
            </>
        ),
    },
    {
        id: "consent",
        title: "Cookie consent",
        content: (
            <>
                <p>Redlix Studio displays a cookie consent bar when you have not yet saved a preference. You may:</p>
                <ul>
                    <li><strong>Accept all</strong> — enables performance and analytics cookies (e.g. Google Analytics) in addition to essential cookies.</li>
                    <li><strong>Decline</strong> — stores your choice and keeps optional analytics disabled; essential cookies still apply.</li>
                    <li><strong>Settings</strong> — open a panel to toggle the analytics/telemetry category before saving.</li>
                </ul>
                <p>
                    Your selection is stored in your browser under the key <code>redlix_cookie_prefs</code> as a JSON object containing whether essential cookies are always on and whether performance/analytics cookies are enabled, along with a timestamp. This preference is not shared with third parties except as needed to apply your choice to Google consent mode (when analytics is enabled or denied).
                </p>
            </>
        ),
    },
    {
        id: "types",
        title: "Types of cookies",
        content: (
            <>
                <h4>Essential cookies (strictly necessary)</h4>
                <p>
                    These cookies are required for the website to operate. They support page delivery, load balancing, security checks, spam prevention, and authenticated admin access. They include cookies set when you submit the contact form or support requests protected by Google reCAPTCHA Enterprise, which helps distinguish human users from automated abuse.
                </p>
                <p>
                    Essential cookies do not require marketing consent, but you may still block them in your browser at the cost of broken functionality (e.g. forms may not submit, admin login may fail).
                </p>
                <h4>Performance and analytics cookies (optional)</h4>
                <p>
                    These cookies are placed only if you accept optional cookies. We use Google Analytics (measurement ID G-MB42FW3TGE) to collect aggregated statistics such as page views, session duration, device category, approximate geography, and referral source.
                </p>
                <p>
                    Analytics data is processed by Google as a service provider. We configure consent mode so analytics storage remains denied until you accept optional cookies.
                </p>
                <h4>Functional and preference cookies</h4>
                <p>
                    These remember choices that improve convenience, such as your cookie consent decision stored in local storage, and temporary UI state while you browse. They are not used for advertising profiling on this public marketing site.
                </p>
                <h4>Third-party cookies</h4>
                <p>
                    Third parties may set cookies when their scripts load on our pages—for example Google (Analytics, reCAPTCHA) and our hosting or CDN providers. We do not sell cookie data to data brokers.
                </p>
            </>
        ),
    },
    {
        id: "inventory",
        title: "Cookie inventory",
        content: (
            <>
                <p>
                    The table below summarises the main technologies we use. Names and lifetimes may change when providers update their services; check this page for the latest version.
                </p>
                <div className="overflow-x-auto">
                    <table>
                        <thead>
                            <tr>
                                <th>Name / provider</th>
                                <th>Purpose</th>
                                <th>Type</th>
                                <th>Duration</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="font-medium text-[#202124]">redlix_cookie_prefs (Redlix)</td>
                                <td>Stores your cookie consent choice</td>
                                <td>Local storage</td>
                                <td>Until cleared</td>
                            </tr>
                            <tr>
                                <td className="font-medium text-[#202124]">_ga, _ga_* (Google)</td>
                                <td>Distinguishes users for Analytics</td>
                                <td>Analytics (optional)</td>
                                <td>Up to 2 years</td>
                            </tr>
                            <tr>
                                <td className="font-medium text-[#202124]">Google Analytics (G-MB42FW3TGE)</td>
                                <td>Site usage measurement</td>
                                <td>Analytics (optional)</td>
                                <td>Per Google policy</td>
                            </tr>
                            <tr>
                                <td className="font-medium text-[#202124]">reCAPTCHA Enterprise (Google)</td>
                                <td>Bot detection on contact/support forms</td>
                                <td>Essential / security</td>
                                <td>Session / persistent</td>
                            </tr>
                            <tr>
                                <td className="font-medium text-[#202124]">admin_token (Redlix)</td>
                                <td>Authenticated admin session only</td>
                                <td>HTTP cookie (admin area)</td>
                                <td>Session</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <p className="text-[14px]">
                    For Google&apos;s practices, see{" "}
                    <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">
                        Google Privacy Policy
                    </a>{" "}
                    and{" "}
                    <a href="https://policies.google.com/technologies/cookies" target="_blank" rel="noopener noreferrer">
                        How Google uses cookies
                    </a>.
                </p>
            </>
        ),
    },
    {
        id: "retention",
        title: "How long cookies are stored",
        content: (
            <>
                <p>Cookies may be:</p>
                <ul className="list-none pl-0 space-y-3">
                    <li>
                        <strong className="text-[#202124] block mb-1">Session cookies</strong>
                        Automatically deleted when you close your browser.
                    </li>
                    <li>
                        <strong className="text-[#202124] block mb-1">Persistent cookies</strong>
                        Stored on your device for a defined period or until manually deleted.
                    </li>
                </ul>
                <p>Retention periods vary depending on the purpose of the cookie. Examples:</p>
                <ul>
                    <li>Session cookies expire when you close your browser.</li>
                    <li>Consent preferences persist until you clear local storage or reset via the banner.</li>
                    <li>Google Analytics cookies may remain for months unless deleted manually.</li>
                    <li>Admin authentication cookies are limited to active staff sessions on /admin routes.</li>
                </ul>
            </>
        ),
    },
    {
        id: "manage",
        title: "Managing cookies",
        content: (
            <>
                <p>
                    You can control or disable cookies through your browser settings. Most browsers allow you to view, delete, or block cookies globally or for specific sites.
                </p>
                <p>
                    On our site, use the cookie banner to decline optional analytics. To withdraw consent later, clear cookies and site data for www.redlix.co.in in your browser, then revisit the site and choose Decline or adjust settings.
                </p>
                <p>
                    Please note that disabling essential cookies may affect website functionality, including contact form submission, reCAPTCHA verification, and secure admin access.
                </p>
                <p className="font-medium text-[#202124]">Browser cookie management guides:</p>
                <ul className="list-none pl-0 flex flex-wrap gap-x-6 gap-y-2">
                    <li>
                        <a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer">
                            Google Chrome
                        </a>
                    </li>
                    <li>
                        <a href="https://support.mozilla.org/en-US/kb/enhanced-tracking-protection-firefox-desktop" target="_blank" rel="noopener noreferrer">
                            Mozilla Firefox
                        </a>
                    </li>
                    <li>
                        <a href="https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noopener noreferrer">
                            Microsoft Edge
                        </a>
                    </li>
                    <li>
                        <a href="https://support.apple.com/guide/safari/manage-cookies-sfri11471/mac" target="_blank" rel="noopener noreferrer">
                            Safari
                        </a>
                    </li>
                </ul>
            </>
        ),
    },
    {
        id: "legal-basis",
        title: "Consent and legal basis",
        content: (
            <>
                <p>
                    Under the Digital Personal Data Protection (DPDP) Act, 2023 and the Information Technology Act, 2000, we process data collected via cookies as follows:
                </p>
                <ul>
                    <li><strong>Consent</strong> — for optional analytics and similar non-essential tracking, obtained through our cookie banner.</li>
                    <li><strong>Legitimate uses</strong> — for strictly necessary cookies that enable security, fraud prevention, and core site operation.</li>
                    <li><strong>Contractual necessity</strong> — where cookies are required to respond to enquiries you initiate via our forms.</li>
                </ul>
                <p>
                    You may withdraw consent for optional cookies at any time without affecting your ability to browse public pages. If you believe your data protection rights have not been respected, contact us using the details below.
                </p>
            </>
        ),
    },
    {
        id: "transfers",
        title: "International transfers",
        content: (
            <>
                <p>
                    Cookie-related data may be processed by service providers located outside India, including Google LLC in the United States, when you use analytics or reCAPTCHA. Those providers act as processors or independent controllers under their own terms.
                </p>
                <p>
                    We share only what is necessary for the stated purpose. We do not use cookies on this public site to sell personal information. Client project portals or admin tools may use additional cookies governed by separate agreements where applicable.
                </p>
            </>
        ),
    },
    {
        id: "your-rights",
        title: "Your rights",
        content: (
            <>
                <p>Depending on applicable law, you may have the right to:</p>
                <ul>
                    <li>Know what cookies and similar technologies we use and why;</li>
                    <li>Access or correct personal data linked to cookie identifiers where we hold it;</li>
                    <li>Withdraw consent for optional cookies;</li>
                    <li>Request erasure of personal data, subject to legal and operational limits;</li>
                    <li>Nominate a person to exercise rights on your behalf in defined circumstances under the DPDP Act.</li>
                </ul>
                <p>
                    To exercise these rights, email us with the subject line &quot;Cookie Policy Request&quot; and describe your request. We may need to verify your identity before responding.
                </p>
            </>
        ),
    },
    {
        id: "updates",
        title: "Policy updates",
        content: (
            <p>
                Redlix Studio may update this Cookies Policy periodically. Any changes will be reflected with a revised last updated date. Continued use of the website after updates constitutes acceptance of the revised policy.
            </p>
        ),
    },
    {
        id: "contact",
        title: "Contact",
        content: (
            <>
                <p>For questions regarding this Cookies Policy:</p>
                <ul className="list-none pl-0 space-y-1">
                    <li><strong>Email:</strong> help.ckrdatapoint@gmail.com</li>
                    <li><strong>Website:</strong> www.redlix.co.in</li>
                    <li><strong>Location:</strong> Hyderabad, Telangana, India</li>
                    <li><strong>Founder:</strong> Rishi Rohan Kalapala</li>
                </ul>
                <p className="text-[13px] text-gray-500">
                    Redlix Studio operates as an independent freelance studio and is not a registered company or legal entity.
                </p>
            </>
        ),
    },
];
