import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
    try {
        const token = request.cookies.get("employee_token")?.value;

        if (!token) {
            return NextResponse.json(
                { success: false, message: "Not authenticated" },
                { status: 401 }
            );
        }

        const secret = new TextEncoder().encode(process.env.JWT_SECRET || "default_secret");
        
        try {
            const { payload } = await jwtVerify(token, secret);
            const employeeId = payload.employeeId as number;

            // Check if already punched in
            const activeSession = await prisma.attendance.findFirst({
                where: {
                    employeeId,
                    punchOut: null,
                },
            });

            if (activeSession) {
                return NextResponse.json(
                    { success: false, message: "You are already punched in." },
                    { status: 400 }
                );
            }

            const newRecord = await prisma.attendance.create({
                data: {
                    employeeId,
                    punchIn: new Date(),
                },
            });

            return NextResponse.json({
                success: true,
                message: "Punched in successfully.",
                data: newRecord,
            });
        } catch (err) {
            return NextResponse.json(
                { success: false, message: "Invalid session token" },
                { status: 401 }
            );
        }
    } catch (error) {
        console.error("Employee Punch-In Error:", error);
        return NextResponse.json(
            { success: false, message: "Internal server error" },
            { status: 500 }
        );
    }
}
