import { NextRequest, NextResponse } from "next/server";
import { SignJWT } from "jose";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
    try {
        const { email, password } = await request.json();

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

        if (!employee.isDeptAdmin) {
            return NextResponse.json(
                { success: false, message: "Access Denied: You do not have department lead privileges." },
                { status: 403 }
            );
        }

        const secret = new TextEncoder().encode(process.env.JWT_SECRET || "default_secret");
        
        const token = await new SignJWT({
            employeeId: employee.id,
            name: employee.name,
            email: employee.email,
            role: employee.role,
            isDeptAdmin: true,
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

        response.cookies.set("dept_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 60 * 60 * 24, // 24 hours
            path: "/",
        });

        return response;
    } catch (error) {
        console.error("Department Lead Login Error:", error);
        return NextResponse.json(
            { success: false, message: "Internal server error" },
            { status: 500 }
        );
    }
}
