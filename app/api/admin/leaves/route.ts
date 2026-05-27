import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET all leave requests across the company
export async function GET() {
    try {
        const leaves = await prisma.leaveRequest.findMany({
            orderBy: { createdAt: "desc" },
            include: {
                employee: {
                    select: { id: true, name: true, role: true, email: true }
                }
            }
        });
        return NextResponse.json({ success: true, data: leaves });
    } catch (error) {
        console.error("Admin fetch leaves error:", error);
        return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
    }
}
