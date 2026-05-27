import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// PATCH update payroll status or info
export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();
        const { status, amount, month } = body;

        const currentPayroll = await prisma.payroll.findUnique({
            where: { id: Number(id) }
        });

        if (!currentPayroll) {
            return NextResponse.json({ success: false, message: "Payroll record not found" }, { status: 404 });
        }

        const dataUpdate: any = {};
        if (status !== undefined) {
            dataUpdate.status = status;
            if (status === "paid") {
                dataUpdate.paidAt = new Date();
            } else if (status === "pending") {
                dataUpdate.paidAt = null;
            }
        }
        if (amount !== undefined) {
            dataUpdate.amount = Number(amount);
        }
        if (month !== undefined) {
            dataUpdate.month = month;
        }

        const updatedPayroll = await prisma.payroll.update({
            where: { id: Number(id) },
            data: dataUpdate,
            include: {
                employee: {
                    select: { id: true, name: true, email: true, role: true }
                }
            }
        });

        return NextResponse.json({ success: true, data: updatedPayroll });
    } catch (error) {
        console.error("Update payroll error:", error);
        return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
    }
}

// DELETE a payroll record
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        await prisma.payroll.delete({
            where: { id: Number(id) }
        });
        return NextResponse.json({ success: true, message: "Payroll record deleted successfully" });
    } catch (error) {
        console.error("Delete payroll error:", error);
        return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
    }
}
