import { NextRequest, NextResponse } from "next/server";
import { SignJWT } from "jose";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
    try {
        const { email } = await request.json();

        if (!email) {
            return NextResponse.json(
                { success: false, message: "Email is required" },
                { status: 400 }
            );
        }

        const employee = await prisma.employee.findUnique({
            where: { email: email.toLowerCase() },
        });

        if (!employee) {
            return NextResponse.json(
                { success: false, message: "Email address is not registered in our system." },
                { status: 404 }
            );
        }

        // Generate JWT token for simulated social login
        const secret = new TextEncoder().encode(process.env.JWT_SECRET || "default_secret");
        
        const token = await new SignJWT({
            employeeId: employee.id,
            name: employee.name,
            email: employee.email,
            role: employee.role,
        })
            .setProtectedHeader({ alg: "HS256" })
            .setIssuedAt()
            .setExpirationTime("24h")
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
        };

        response.cookies.set("employee_token", token, cookieOptions);

        return response;
    } catch (error) {
        console.error("Employee Social Login Error:", error);
        return NextResponse.json(
            { success: false, message: "Internal server error" },
            { status: 500 }
        );
    }
}
