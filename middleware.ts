import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || "default_secret");

    // 1. Process requests starting with /admin
    if (pathname.startsWith("/admin")) {
        if (pathname === "/admin/login") {
            return NextResponse.next();
        }

        const token = request.cookies.get("admin_token")?.value;

        if (!token) {
            return NextResponse.redirect(new URL("/admin/login", request.url));
        }

        try {
            await jwtVerify(token, secret);
            return NextResponse.next();
        } catch (error) {
            console.error("Admin Auth Middleware Error:", error);
            return NextResponse.redirect(new URL("/admin/login", request.url));
        }
    }

    // 2. Process requests starting with /employee
    if (pathname.startsWith("/employee")) {
        if (pathname === "/employee/login" || pathname === "/employee/reset-password") {
            return NextResponse.next();
        }

        const token = request.cookies.get("employee_token")?.value;

        if (!token) {
            return NextResponse.redirect(new URL("/employee/login", request.url));
        }

        try {
            await jwtVerify(token, secret);
            return NextResponse.next();
        } catch (error) {
            console.error("Employee Auth Middleware Error:", error);
            return NextResponse.redirect(new URL("/employee/login", request.url));
        }
    }

    // 3. Protect employee APIs
    if (pathname.startsWith("/api/employee")) {
        if (
            pathname === "/api/employee/login" ||
            pathname === "/api/employee/forgot-password" ||
            pathname === "/api/employee/reset-password"
        ) {
            return NextResponse.next();
        }

        const token = request.cookies.get("employee_token")?.value;
        if (!token) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        try {
            await jwtVerify(token, secret);
            return NextResponse.next();
        } catch (error) {
            return NextResponse.json({ success: false, message: "Invalid session" }, { status: 401 });
        }
    }

    // 4. Protect administrative APIs (Permit either admin_token or employee_token)
    if (pathname.startsWith("/api/admin")) {
        if (pathname === "/api/admin/login") {
            return NextResponse.next();
        }

        const adminToken = request.cookies.get("admin_token")?.value;
        const employeeToken = request.cookies.get("employee_token")?.value;

        if (adminToken) {
            try {
                await jwtVerify(adminToken, secret);
                return NextResponse.next();
            } catch (error) {
                // fall through to check employee token if admin token failed
            }
        }

        if (employeeToken) {
            try {
                await jwtVerify(employeeToken, secret);
                return NextResponse.next();
            } catch (error) {
                // both tokens invalid
            }
        }

        return NextResponse.json(
            { success: false, message: "Unauthorized access" },
            { status: 401 }
        );
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/admin/:path*",
        "/api/admin/:path*",
        "/employee/:path*",
        "/api/employee/:path*",
    ],
};
