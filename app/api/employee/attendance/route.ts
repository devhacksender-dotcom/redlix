import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import prisma from "@/lib/prisma";
import { autoPunchOutStaleSessions } from "@/lib/attendanceHelper";

export async function GET(request: NextRequest) {
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

            // Auto punch-out stale sessions before checking active session
            await autoPunchOutStaleSessions();

            // 1. Check if there is an active session (punchOut is null)
            const activeSession = await prisma.attendance.findFirst({
                where: {
                    employeeId,
                    punchOut: null,
                },
            });

            // 2. Get history (recent 30 records)
            const history = await prisma.attendance.findMany({
                where: { employeeId },
                orderBy: { punchIn: "desc" },
                take: 30,
            });

            return NextResponse.json({
                success: true,
                activeSession,
                history,
            });
        } catch (err) {
            return NextResponse.json(
                { success: false, message: "Invalid session token" },
                { status: 401 }
            );
        }
    } catch (error) {
        console.error("Employee Attendance GET Error:", error);
        return NextResponse.json(
            { success: false, message: "Internal server error" },
            { status: 500 }
        );
    }
}
