import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Coming Soon | Redlix Studio",
    description: "Something exciting is being built. Stay tuned — Redlix Studio is launching something new very soon.",
};

export default function ComingSoonPage() {
    return (
        <main
            style={{
                minHeight: "100vh",
                backgroundColor: "#fff",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "'Poppins', sans-serif",
                padding: "24px",
                textAlign: "center",
            }}
        >
            {/* Logo */}
            <Link href="/" style={{ display: "inline-block", marginBottom: "48px" }}>
                <img
                    src="https://ik.imagekit.io/dypkhqxip/redlix%20new?updatedAt=1781042212493"
                    alt="Redlix Studio"
                    style={{ height: "32px", width: "auto" }}
                />
            </Link>

            {/* Heading */}
            <h1
                style={{
                    fontSize: "clamp(36px, 6vw, 64px)",
                    fontWeight: 700,
                    color: "#111",
                    lineHeight: 1.1,
                    marginBottom: "16px",
                    letterSpacing: "-0.02em",
                }}
            >
                Coming Soon
            </h1>

            {/* Sub-text */}
            <p
                style={{
                    color: "#666",
                    fontSize: "16px",
                    lineHeight: 1.7,
                    maxWidth: "420px",
                    marginBottom: "40px",
                }}
            >
                This page is under construction. Check back soon or head back home.
            </p>

            {/* CTA */}
            <Link
                href="/"
                style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "12px 28px",
                    backgroundColor: "#111",
                    color: "#fff",
                    borderRadius: "100px",
                    fontSize: "14px",
                    fontWeight: 600,
                    textDecoration: "none",
                    transition: "opacity 0.2s",
                }}
            >
                ← Back to Home
            </Link>

            {/* Footer */}
            <p
                style={{
                    color: "#bbb",
                    fontSize: "12px",
                    marginTop: "64px",
                }}
            >
                © {new Date().getFullYear()} Redlix Studio
            </p>
        </main>
    );
}
