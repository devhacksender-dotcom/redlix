import { Metadata } from "next";
import CorporateFooter from "@/components/CorporateFooter";
import LegalDocLayout from "@/components/legal/LegalDocLayout";
import { privacySections } from "./privacy-sections";

export const metadata: Metadata = {
    title: "Privacy Policy",
    description:
        "Read the Redlix Studio Privacy Policy. Learn how we handle your data, protect your privacy, and comply with the DPDP Act, 2023 in our independent freelance operations.",
};

export default function PrivacyPolicy() {
    return (
        <>
            <LegalDocLayout
                title="Privacy Policy"
                description="How Redlix Studio collects, uses, stores, and protects personal information when you use our website and services."
                updated="June 26, 2026"
                effective="June 26, 2026"
                sections={privacySections}
            />
            <CorporateFooter />
        </>
    );
}
