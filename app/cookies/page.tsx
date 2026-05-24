import { Metadata } from "next";
import CorporateFooter from "@/components/CorporateFooter";
import LegalDocLayout from "@/components/legal/LegalDocLayout";
import { cookiesSections } from "./cookies-sections";

export const metadata: Metadata = {
    title: "Cookies Policy | Redlix Studio",
    description:
        "Understand how Redlix Studio uses cookies to improve your experience, maintain system security, and provide personalized IT services as an independent freelance studio.",
};

export default function CookiesPolicy() {
    return (
        <>
            <LegalDocLayout
                title="Cookies Policy"
                description="How we use cookies, local storage, and similar technologies on www.redlix.co.in, including analytics and security tools."
                updated="May 23, 2026"
                effective="May 23, 2026"
                sections={cookiesSections}
            />
            <CorporateFooter />
        </>
    );
}
