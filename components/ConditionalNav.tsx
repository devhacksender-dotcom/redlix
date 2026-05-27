"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import CookieButton from "./CookieButton";
import ContactPopup from "./ContactPopup";

export default function ConditionalNav({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isAdminPage = pathname?.startsWith("/admin") || pathname?.startsWith("/employee");
    const isInternSupport = pathname === "/intern-support";

    if (isAdminPage || isInternSupport) {
        return <>{children}</>;
    }

    return (
        <>
            <Navbar />
            <main>
                {children}
            </main>
            <CookieButton />
            <ContactPopup />
        </>
    );
}
