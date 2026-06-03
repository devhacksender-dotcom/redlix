import { NextRequest, NextResponse } from "next/server";
import { SignJWT } from "jose";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
    try {
        const { email, password, isPWA } = await request.json();

        if (!email || !password) {
            return NextResponse.json(
                { success: false, message: "Email and password are required" },
                { status: 400 }
            );
        }

        const employee = await prisma.employee.findUnique({
            where: { email: email.toLowerCase() },
        });

        if (!employee || employee.password !== password) {
            return NextResponse.json(
                { success: false, message: "Invalid email or password" },
                { status: 401 }
            );
        }

        const secret = new TextEncoder().encode(process.env.JWT_SECRET || "default_secret");
        
        const token = await new SignJWT({
            employeeId: employee.id,
            name: employee.name,
            email: employee.email,
            role: employee.role,
        })
            .setProtectedHeader({ alg: "HS256" })
            .setIssuedAt()
            .setExpirationTime(isPWA ? "365d" : "24h")
            .sign(secret);

        const response = NextResponse.json({
            success: true,
            message: "Authentication successful",
            data: {
                id: employee.id,
                name: employee.name,
                email: employee.email,
                role: employee.role,
            }
        });

        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict" as const,
            path: "/",
            ...(isPWA ? { maxAge: 60 * 60 * 24 * 365 } : {}),
        };

        response.cookies.set("employee_token", token, cookieOptions);

        return response;
    } catch (error) {
        console.error("Employee Login Error:", error);
        return NextResponse.json(
            { success: false, message: "Internal server error" },
            { status: 500 }
        );
    }
}
