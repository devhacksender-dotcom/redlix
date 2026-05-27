"use client";

import React from "react";
import { ReactLenis } from 'lenis/react';
import { usePathname } from "next/navigation";

export default function SmoothScrolling({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isAdminPage = pathname?.startsWith("/admin") || pathname?.startsWith("/employee");

    if (isAdminPage) {
        return <>{children}</>;
    }

    return (
        <ReactLenis root options={{ lerp: 0.05, duration: 1.5, smoothWheel: true, wheelMultiplier: 0.8 }}>
            {children}
        </ReactLenis>
    );
}
