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

            // Check if there is an active session
            const activeSession = await prisma.attendance.findFirst({
                where: {
                    employeeId,
                    punchOut: null,
                },
            });

            if (!activeSession) {
                return NextResponse.json(
                    { success: false, message: "You are not punched in." },
                    { status: 400 }
                );
            }

            const punchInTime = new Date(activeSession.punchIn);
            const punchOutTime = new Date();
            const elapsedMs = punchOutTime.getTime() - punchInTime.getTime();
            const workMinutes = Math.max(1, Math.round(elapsedMs / 1000 / 60)); // minimum 1 minute to record

            const updatedRecord = await prisma.attendance.update({
                where: { id: activeSession.id },
                data: {
                    punchOut: punchOutTime,
                    workMinutes,
                },
            });

            return NextResponse.json({
                success: true,
                message: "Punched out successfully.",
                data: updatedRecord,
            });
        } catch (err) {
            return NextResponse.json(
                { success: false, message: "Invalid session token" },
                { status: 401 }
            );
        }
    } catch (error) {
        console.error("Employee Punch-Out Error:", error);
        return NextResponse.json(
            { success: false, message: "Internal server error" },
            { status: 500 }
        );
    }
}
