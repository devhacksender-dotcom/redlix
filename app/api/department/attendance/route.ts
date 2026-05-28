import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
    try {
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
            take: 200, // Fetch up to 200 recent records
        });

        return NextResponse.json({
            success: true,
            data: attendance,
        });
    } catch (error) {
        console.error("Department API Attendance Error:", error);
        return NextResponse.json(
            { success: false, message: "Failed to fetch attendance logs" },
            { status: 500 }
        );
    }
}
