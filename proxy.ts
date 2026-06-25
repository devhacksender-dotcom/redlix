import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

// ─── In-Memory Rate Limiter (sliding window) ──────────────────────────────────
// NOTE: Works per-instance. For multi-region DDoS protection use Vercel WAF /
// Cloudflare, which sits in front of this and handles distributed limits.
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

function getRateLimitKey(req: NextRequest): string {
    const forwarded = req.headers.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(",")[0].trim() : "unknown";
    return ip;
}

function isRateLimited(
    key: string,
    limit: number,
    windowMs: number
): boolean {
    const now = Date.now();
    const entry = rateLimitStore.get(key);

    if (!entry || now > entry.resetAt) {
        rateLimitStore.set(key, { count: 1, resetAt: now + windowMs });
        return false;
    }

    entry.count++;
    if (entry.count > limit) return true;
    return false;
}

// Periodically clean up expired entries to prevent memory leak
if (typeof setInterval !== "undefined") {
    setInterval(() => {
        const now = Date.now();
        rateLimitStore.forEach((val, key) => {
            if (now > val.resetAt) rateLimitStore.delete(key);
        });
    }, 60_000);
}

// ─── Bot / Scanner Detection ──────────────────────────────────────────────────
const BAD_BOT_UA_PATTERNS = [
    /sqlmap/i,
    /nikto/i,
    /nmap/i,
    /masscan/i,
    /zgrab/i,
    /dirbuster/i,
    /gobuster/i,
    /wfuzz/i,
    /burpsuite/i,
    /python-requests\/[01]\./i,
    /python-httpx/i,
    /curl\/[0-5]\./i,          // Very old curl — modern curl is fine
    /wget\/[01]\./i,
    /scrapy/i,
    /ahrefsbot/i,
    /semrushbot/i,
    /dotbot/i,
    /mj12bot/i,
    /petalbot/i,
    /bytespider/i,
    /claudebot/i,
    /gptbot/i,
    /ccbot/i,
    /facebookexternalhit.*crawl/i,
];

const BLOCKED_PATHS = [
    /\/\.env/,
    /\/\.git/,
    /\/\.htaccess/,
    /\/wp-admin/,
    /\/wp-login/,
    /\/xmlrpc/,
    /\/phpmyadmin/i,
    /\/admin\.php/i,
    /\/shell\.php/i,
    /\/eval-stdin/,
    /\/cgi-bin/,
    /\/etc\/passwd/,
    /\/proc\//,
    /\/api\/.*\.php$/,
    /\.(bak|old|orig|save|swp|sql|dump)$/i,
];

const SUSPICIOUS_QUERY_PATTERNS = [
    /<script/i,
    /javascript:/i,
    /union.*select/i,
    /drop.*table/i,
    /insert.*into/i,
    /exec\(/i,
    /eval\(/i,
    /base64_decode/i,
    /\.\.\//,           // Path traversal
];

// ─── Security Response Headers ────────────────────────────────────────────────
function applySecurityHeaders(response: NextResponse): NextResponse {
    // Prevent MIME-type sniffing
    response.headers.set("X-Content-Type-Options", "nosniff");
    // Block iframe embedding from other origins
    response.headers.set("X-Frame-Options", "SAMEORIGIN");
    // Force HTTPS for 2 years
    response.headers.set(
        "Strict-Transport-Security",
        "max-age=63072000; includeSubDomains; preload"
    );
    // Referrer policy
    response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
    // Permissions policy — lock down unused browser APIs
    response.headers.set(
        "Permissions-Policy",
        "camera=(), microphone=(), geolocation=(), payment=(), usb=(), bluetooth=(), serial=(), ambient-light-sensor=(), battery=(), display-capture=()"
    );
    // Disable browser XSS filter (rely on CSP instead)
    response.headers.set("X-XSS-Protection", "0");
    // DNS prefetch
    response.headers.set("X-DNS-Prefetch-Control", "on");
    // Prevent information leakage
    response.headers.set("X-Powered-By", "");
    response.headers.delete("X-Powered-By");
    // Cross-Origin opener — allow popups (needed for Cal.com OAuth flows)
    // NOTE: COEP intentionally omitted — it blocks cross-origin iframes (Cal.com)
    response.headers.set("Cross-Origin-Opener-Policy", "same-origin-allow-popups");

    return response;
}

function block(reason: string, status = 403): NextResponse {
    const res = new NextResponse(
        JSON.stringify({ error: "Forbidden", reason }),
        {
            status,
            headers: { "Content-Type": "application/json" },
        }
    );
    return applySecurityHeaders(res);
}

function rateLimitResponse(): NextResponse {
    const res = new NextResponse(
        JSON.stringify({ error: "Too Many Requests" }),
        {
            status: 429,
            headers: {
                "Content-Type": "application/json",
                "Retry-After": "60",
            },
        }
    );
    return applySecurityHeaders(res);
}

// ─── Main Middleware ──────────────────────────────────────────────────────────
export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const secret = new TextEncoder().encode(
        process.env.JWT_SECRET || "default_secret"
    );
    const ua = request.headers.get("user-agent") || "";
    const ipKey = getRateLimitKey(request);

    // 1. Block empty or missing User-Agent (bots/scanners rarely send one)
    if (!ua || ua.trim().length < 5) {
        return block("Missing or invalid User-Agent");
    }

    // 2. Block known bad bots / scanners
    if (BAD_BOT_UA_PATTERNS.some((pattern) => pattern.test(ua))) {
        return block("Automated scanner detected");
    }

    // 3. Block probing of sensitive/non-existent paths
    if (BLOCKED_PATHS.some((pattern) => pattern.test(pathname))) {
        return block("Path not allowed");
    }

    // 4. Block suspicious query strings (SQLi, XSS, path traversal)
    const rawQuery = request.nextUrl.search;
    if (
        rawQuery &&
        SUSPICIOUS_QUERY_PATTERNS.some((p) => p.test(decodeURIComponent(rawQuery)))
    ) {
        return block("Suspicious query detected");
    }

    // 5. Global rate limit — 120 req / 60s per IP (public pages)
    //    API routes get a tighter limit applied below
    if (isRateLimited(`global:${ipKey}`, 120, 60_000)) {
        return rateLimitResponse();
    }

    // 6. Tighter API rate limit — 30 req / 60s per IP
    if (pathname.startsWith("/api/")) {
        if (isRateLimited(`api:${ipKey}`, 30, 60_000)) {
            return rateLimitResponse();
        }

        // 6a. Protect cron endpoints — only Vercel internal caller allowed
        if (pathname.startsWith("/api/cron/")) {
            const cronSecret = request.headers.get("authorization");
            const expected = `Bearer ${process.env.CRON_SECRET}`;
            if (!process.env.CRON_SECRET || cronSecret !== expected) {
                return block("Cron endpoint — unauthorized", 401);
            }
        }
    }

    // 7. Auth guards (existing logic, preserved) ──────────────────────────────

    if (pathname.startsWith("/admin")) {
        if (pathname === "/admin/login") {
            return applySecurityHeaders(NextResponse.next());
        }
        const token = request.cookies.get("admin_token")?.value;
        if (!token) {
            return NextResponse.redirect(new URL("/admin/login", request.url));
        }
        try {
            await jwtVerify(token, secret);
            return applySecurityHeaders(NextResponse.next());
        } catch {
            return NextResponse.redirect(new URL("/admin/login", request.url));
        }
    }

    if (pathname.startsWith("/employee")) {
        if (
            pathname === "/employee/login" ||
            pathname === "/employee/reset-password"
        ) {
            return applySecurityHeaders(NextResponse.next());
        }
        const token = request.cookies.get("employee_token")?.value;
        if (!token) {
            return NextResponse.redirect(new URL("/employee/login", request.url));
        }
        try {
            await jwtVerify(token, secret);
            return applySecurityHeaders(NextResponse.next());
        } catch {
            return NextResponse.redirect(new URL("/employee/login", request.url));
        }
    }

    if (pathname.startsWith("/api/employee")) {
        if (
            pathname === "/api/employee/login" ||
            pathname === "/api/employee/forgot-password" ||
            pathname === "/api/employee/reset-password"
        ) {
            return applySecurityHeaders(NextResponse.next());
        }
        const token = request.cookies.get("employee_token")?.value;
        if (!token) {
            return applySecurityHeaders(
                NextResponse.json(
                    { success: false, message: "Unauthorized" },
                    { status: 401 }
                )
            );
        }
        try {
            await jwtVerify(token, secret);
            return applySecurityHeaders(NextResponse.next());
        } catch {
            return applySecurityHeaders(
                NextResponse.json(
                    { success: false, message: "Invalid session" },
                    { status: 401 }
                )
            );
        }
    }

    if (pathname.startsWith("/api/admin")) {
        if (pathname === "/api/admin/login") {
            return applySecurityHeaders(NextResponse.next());
        }
        const adminToken = request.cookies.get("admin_token")?.value;
        const employeeToken = request.cookies.get("employee_token")?.value;
        const isInternSupportApi = pathname.startsWith(
            "/api/admin/intern-support"
        );

        if (adminToken) {
            try {
                await jwtVerify(adminToken, secret);
                return applySecurityHeaders(NextResponse.next());
            } catch { /* fall through */ }
        }

        if (isInternSupportApi && employeeToken) {
            try {
                await jwtVerify(employeeToken, secret);
                return applySecurityHeaders(NextResponse.next());
            } catch { /* fall through */ }
        }

        return applySecurityHeaders(
            NextResponse.json(
                { success: false, message: "Unauthorized access" },
                { status: 401 }
            )
        );
    }

    if (pathname.startsWith("/department")) {
        if (pathname === "/department/login") {
            return applySecurityHeaders(NextResponse.next());
        }
        const token = request.cookies.get("dept_token")?.value;
        if (!token) {
            return NextResponse.redirect(
                new URL("/department/login", request.url)
            );
        }
        try {
            await jwtVerify(token, secret);
            return applySecurityHeaders(NextResponse.next());
        } catch {
            return NextResponse.redirect(
                new URL("/department/login", request.url)
            );
        }
    }

    if (pathname.startsWith("/api/department")) {
        if (pathname === "/api/department/login") {
            return applySecurityHeaders(NextResponse.next());
        }
        const token = request.cookies.get("dept_token")?.value;
        if (!token) {
            return applySecurityHeaders(
                NextResponse.json(
                    { success: false, message: "Unauthorized" },
                    { status: 401 }
                )
            );
        }
        try {
            await jwtVerify(token, secret);
            return applySecurityHeaders(NextResponse.next());
        } catch {
            return applySecurityHeaders(
                NextResponse.json(
                    { success: false, message: "Invalid session" },
                    { status: 401 }
                )
            );
        }
    }

    // 8. Apply security headers to all other responses
    return applySecurityHeaders(NextResponse.next());
}

export const config = {
    matcher: [
        /*
         * Match all request paths EXCEPT:
         * - _next/static  (Next.js static assets — JS, CSS bundles)
         * - _next/image   (Next.js image optimisation)
         * - _next/data    (Next.js prefetch data requests — these should NOT hit middleware)
         * - favicon.ico, sitemap.xml, robots.txt
         * - Any static file extension (images, fonts, icons, etc.)
         *
         * Skipping these stops the middleware from firing on every asset request,
         * which eliminates the "sudden spike" of serverless invocations on Vercel.
         */
        "/((?!_next/static|_next/image|_next/data|favicon\\.ico|sitemap\\.xml|robots\\.txt|.*\\.(?:png|jpg|jpeg|gif|svg|ico|webp|avif|woff|woff2|ttf|otf|eot|mp4|webm|pdf|json|txt|xml|map|css|js)$).*)",
    ],
};
