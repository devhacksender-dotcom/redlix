import { Metadata } from "next";
import CorporateFooter from "@/components/CorporateFooter";
import LegalDocLayout from "@/components/legal/LegalDocLayout";
import { termsSections } from "./terms-sections";

export const metadata: Metadata = {
    title: "Terms of Service | Redlix Studio",
    description:
        "Review the Redlix Studio Terms of Service. Understand the professional engagement guidelines, intellectual property policies, and service standards of our independent freelance studio.",
};

export default function TermsAndConditions() {
    return (
        <>
            <LegalDocLayout
                title="Terms of Service"
                description="Professional engagement guidelines for services provided by Redlix Studio, an independent freelance studio operated by Rishi Rohan Kalapala in Hyderabad, India."
                updated="May 23, 2026"
                effective="May 23, 2026"
                sections={termsSections}
            />
            <CorporateFooter />
        </>
    );
}
