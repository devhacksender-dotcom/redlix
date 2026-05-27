import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// PATCH update leave status (approve/reject)
export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();
        const { status, adminNotes } = body;

        if (!status || (status !== "approved" && status !== "rejected")) {
            return NextResponse.json({ success: false, message: "Status must be either 'approved' or 'rejected'" }, { status: 400 });
        }

        const leaveExists = await prisma.leaveRequest.findUnique({
            where: { id: Number(id) }
        });

        if (!leaveExists) {
            return NextResponse.json({ success: false, message: "Leave request not found" }, { status: 404 });
        }

        const updatedLeave = await prisma.leaveRequest.update({
            where: { id: Number(id) },
            data: {
                status,
                adminNotes: adminNotes !== undefined ? adminNotes : undefined
            },
            include: {
                employee: {
                    select: { id: true, name: true, role: true, email: true }
                }
            }
        });

        return NextResponse.json({ success: true, data: updatedLeave });
    } catch (error) {
        console.error("Admin update leave error:", error);
        return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
    }
}
