import type { NextConfig } from "next";

// Content Security Policy — controls what origins the browser is allowed to load
const ContentSecurityPolicy = `
  default-src 'self';
  script-src 'self' 'unsafe-inline' 'unsafe-eval'
    https://cdn.jsdelivr.net
    https://cal.com
    https://app.cal.com;
  style-src 'self' 'unsafe-inline'
    https://fonts.googleapis.com
    https://cdn.jsdelivr.net;
  font-src 'self'
    https://fonts.gstatic.com
    data:;
  img-src 'self' data: blob:
    https://res.cloudinary.com
    https://ik.imagekit.io
    https://lottie.host
    https://cal.com
    https://app.cal.com
    https://www.gstatic.com
    https://www.google.com
    https://cdn.jsdelivr.net
    https://upload.wikimedia.org;
  media-src 'self' blob: data:;
  frame-src
    https://cal.com
    https://*.cal.com
    https://app.cal.com;
  connect-src 'self'
    https://cal.com
    https://*.cal.com
    https://app.cal.com
    https://api.cal.com
    https://firestore.googleapis.com
    https://identitytoolkit.googleapis.com
    https://securetoken.googleapis.com
    https://lottie.host
    https://res.cloudinary.com
    https://ik.imagekit.io
    wss://firestore.googleapis.com;
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  frame-ancestors 'none';
  upgrade-insecure-requests;
`
    .replace(/\s{2,}/g, " ")
    .trim();

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            { protocol: "https", hostname: "res.cloudinary.com" },
            { protocol: "https", hostname: "ik.imagekit.io" },
            { protocol: "https", hostname: "upload.wikimedia.org" },
            { protocol: "https", hostname: "commons.wikimedia.org" },
            { protocol: "https", hostname: "encrypted-tbn0.gstatic.com" },
        ],
    },

    // Disable Next.js "powered-by" header
    poweredByHeader: false,

    // Redirect unbuilt pages to Coming Soon
    async redirects() {
        return [
            { source: "/careers",           destination: "/coming-soon", permanent: false },
            { source: "/careers/:path*",     destination: "/coming-soon", permanent: false },
            { source: "/wings",              destination: "/coming-soon", permanent: false },
            { source: "/wings/:path*",       destination: "/coming-soon", permanent: false },
            { source: "/product-wing",       destination: "/coming-soon", permanent: false },
            { source: "/product-wing/:path*",destination: "/coming-soon", permanent: false },
            { source: "/it-wing",            destination: "/coming-soon", permanent: false },
            { source: "/it-wing/:path*",     destination: "/coming-soon", permanent: false },
            { source: "/event-wing",         destination: "/coming-soon", permanent: false },
            { source: "/event-wing/:path*",  destination: "/coming-soon", permanent: false },
        ];
    },

    async headers() {
        return [
            {
                source: "/:path*",
                headers: [
                    // HTTPS enforcement for 2 years
                    {
                        key: "Strict-Transport-Security",
                        value: "max-age=63072000; includeSubDomains; preload",
                    },
                    // Prevent MIME sniffing
                    { key: "X-Content-Type-Options", value: "nosniff" },
                    // Block clickjacking
                    { key: "X-Frame-Options", value: "DENY" },
                    // Referrer control
                    {
                        key: "Referrer-Policy",
                        value: "strict-origin-when-cross-origin",
                    },
                    // Lock down unused browser APIs
                    {
                        key: "Permissions-Policy",
                        value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), bluetooth=(), serial=(), ambient-light-sensor=(), battery=(), display-capture=()",
                    },
                    // Disable old XSS filter (CSP handles this)
                    { key: "X-XSS-Protection", value: "0" },
                    // DNS prefetch
                    { key: "X-DNS-Prefetch-Control", value: "on" },
                    // Cross-origin opener policy (keeps window isolation)
                    // NOTE: Cross-Origin-Embedder-Policy is intentionally omitted
                    // because it blocks cross-origin iframes (e.g. Cal.com scheduler)
                    { key: "Cross-Origin-Opener-Policy", value: "same-origin-allow-popups" },
                    // Full Content Security Policy
                    {
                        key: "Content-Security-Policy",
                        value: ContentSecurityPolicy,
                    },
                ],
            },
            // Cache static assets aggressively, but ensure they are immutable
            {
                source: "/_next/static/:path*",
                headers: [
                    {
                        key: "Cache-Control",
                        value: "public, max-age=31536000, immutable",
                    },
                ],
            },
            // No caching for API routes
            {
                source: "/api/:path*",
                headers: [
                    {
                        key: "Cache-Control",
                        value: "no-store, no-cache, must-revalidate",
                    },
                ],
            },
        ];
    },
};

export default nextConfig;
