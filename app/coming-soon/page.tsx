import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Coming Soon | Redlix Studio",
    description: "Something exciting is being built. Stay tuned — Redlix Studio is launching something new very soon.",
};

export default function ComingSoonPage() {
    return (
        <main className="min-h-screen bg-[#0E0F11] flex flex-col items-center justify-center relative overflow-hidden font-sans px-6">

            {/* ── Ambient background glows ─────────────────────────── */}
            <div className="pointer-events-none absolute inset-0" aria-hidden="true">
                {/* Red glow top-left */}
                <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-[#E61E32]/10 blur-[120px]" />
                {/* Subtle red glow bottom-right */}
                <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full bg-[#E61E32]/8 blur-[100px]" />
                {/* Grid overlay */}
                <div
                    className="absolute inset-0 opacity-[0.025]"
                    style={{
                        backgroundImage:
                            "linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)",
                        backgroundSize: "60px 60px",
                    }}
                />
            </div>

            {/* ── Content ──────────────────────────────────────────── */}
            <div className="relative z-10 flex flex-col items-center text-center max-w-2xl mx-auto">

                {/* Logo */}
                <Link href="/" className="inline-block mb-10 group">
                    <img
                        src="https://ik.imagekit.io/dypkhqxip/redlix%20new?updatedAt=1781042212493"
                        alt="Redlix Studio"
                        className="h-10 w-auto brightness-0 invert opacity-90 transition-opacity duration-300 group-hover:opacity-100"
                    />
                </Link>

                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#E61E32]/30 bg-[#E61E32]/10 mb-8">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E61E32] opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-[#E61E32]" />
                    </span>
                    <span className="text-[#E61E32] text-xs font-semibold tracking-widest uppercase">
                        In the works
                    </span>
                </div>

                {/* Heading */}
                <h1 className="text-[48px] sm:text-[64px] lg:text-[72px] font-bold text-white leading-[1.05] tracking-tight mb-5">
                    Coming
                    <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#E61E32] to-[#FF6B7A]">
                        Soon.
                    </span>
                </h1>

                {/* Sub-text */}
                <p className="text-zinc-400 text-[15px] sm:text-[17px] leading-relaxed max-w-lg mb-10">
                    We&apos;re crafting something exceptional. This page is currently
                    under construction — check back soon or reach out to us directly.
                </p>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row items-center gap-3 mb-14">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#E61E32] hover:bg-[#FF2E44] text-white font-semibold text-[14px] transition-all duration-300 hover:-translate-y-0.5 shadow-lg shadow-[#E61E32]/20"
                    >
                        ← Back to Home
                    </Link>
                    <a
                        href="mailto:help@redlix.co.in"
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-white/10 hover:border-white/25 text-zinc-300 hover:text-white font-semibold text-[14px] transition-all duration-300 hover:-translate-y-0.5 bg-white/[0.03] hover:bg-white/[0.07]"
                    >
                        Contact Us
                    </a>
                </div>

                {/* Divider */}
                <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-8" />

                {/* Footer note */}
                <p className="text-zinc-600 text-[12px] tracking-wide">
                    © {new Date().getFullYear()} Redlix Studio. All rights reserved.
                </p>
            </div>
        </main>
    );
}
