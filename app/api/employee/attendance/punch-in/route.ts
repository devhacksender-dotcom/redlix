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

            // Enforce strict punch-in window: 9:55 PM (21:55) to 10:10 AM (10:10) IST
            const now = new Date();
            const formatter = new Intl.DateTimeFormat("en-US", {
                timeZone: "Asia/Kolkata",
                hour: "numeric",
                minute: "numeric",
                hour12: false,
            });
            const parts = formatter.formatToParts(now);
            const hour = parseInt(parts.find(p => p.type === "hour")?.value || "0", 10);
            const minute = parseInt(parts.find(p => p.type === "minute")?.value || "0", 10);
            const totalMinutes = hour * 60 + minute;

            // 10:10 AM is 610 mins, 9:55 PM is 1315 mins
            const isAllowed = totalMinutes <= 610 || totalMinutes >= 1315;

            if (!isAllowed) {
                return NextResponse.json(
                    { success: false, message: "Punch-in is only allowed between 9:55 PM and 10:10 AM IST." },
                    { status: 400 }
                );
            }

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
