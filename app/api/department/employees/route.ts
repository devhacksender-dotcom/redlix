import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
    try {
        const employees = await prisma.employee.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                isDeptAdmin: true,
            },
            orderBy: { name: "asc" },
        });

        return NextResponse.json({
            success: true,
            data: employees,
        });
    } catch (error) {
        console.error("Department API Employees Error:", error);
        return NextResponse.json(
            { success: false, message: "Failed to fetch employees list" },
            { status: 500 }
        );
    }
}
