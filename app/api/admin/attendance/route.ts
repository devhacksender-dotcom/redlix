import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { autoPunchOutStaleSessions } from "@/lib/attendanceHelper";

export async function GET() {
    try {
        // Auto punch-out stale sessions before querying
        await autoPunchOutStaleSessions();

        const attendance = await prisma.attendance.findMany({
            include: {
                employee: {
                    select: {
                        id: true,
                        name: true,
                        role: true,
                        email: true,
                    }
                }
            },
            orderBy: { punchIn: "desc" },
            take: 500, // Fetch up to 500 recent records for admin
        });

        return NextResponse.json({
            success: true,
            data: attendance,
        });
    } catch (error) {
        console.error("Admin API Attendance Error:", error);
        return NextResponse.json(
            { success: false, message: "Failed to fetch attendance logs" },
            { status: 500 }
        );
    }
}
