import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { autoPunchOutStaleSessions } from "@/lib/attendanceHelper";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: idStr } = await params;
        const id = parseInt(idStr);
        if (isNaN(id)) {
            return NextResponse.json(
                { success: false, message: "Invalid ID parameter" },
                { status: 400 }
            );
        }

        // Auto punch-out stale sessions before querying
        await autoPunchOutStaleSessions();

        const attendance = await prisma.attendance.findMany({
            where: { employeeId: id },
            orderBy: { punchIn: "desc" },
            take: 100, // Fetch up to 100 recent sessions
        });

        return NextResponse.json({
            success: true,
            data: attendance,
        });
    } catch (error) {
        console.error("Admin Employee Attendance Fetch Error:", error);
        return NextResponse.json(
            { success: false, message: "Failed to fetch attendance records" },
            { status: 500 }
        );
    }
}
