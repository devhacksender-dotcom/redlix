import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sendPinkSlipAllocationEmail } from "@/utils/email";

export async function POST(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: idStr } = await params;
        const id = parseInt(idStr);
        if (isNaN(id)) {
            return NextResponse.json({ success: false, message: "Invalid ID" }, { status: 400 });
        }

        const employee = await prisma.employee.findUnique({ where: { id } });
        if (!employee) {
            return NextResponse.json({ success: false, message: "Employee not found" }, { status: 404 });
        }

        // Check if already has an active pink slip
        if (employee.pinkSlipAllocatedAt && !employee.pinkSlipRevoked) {
            return NextResponse.json({ success: false, message: "Employee already has an active pink slip" }, { status: 400 });
        }

        const now = new Date();
        const deadline = new Date(now.getTime() + 32 * 60 * 60 * 1000); // 32 hours from now

        // Update employee with pink slip info (reset any old request)
        await prisma.employee.update({
            where: { id },
            data: {
                pinkSlipAllocatedAt: now,
                pinkSlipRequest: null,
                pinkSlipRequestAt: null,
                pinkSlipRevoked: false,
            },
        });

        // Send email to employee
        await sendPinkSlipAllocationEmail({
            to: employee.email,
            name: employee.name,
            role: employee.role,
            allocatedAt: now,
            deadlineAt: deadline,
            employeePortalUrl: `${process.env.NEXT_PUBLIC_BASE_URL || "https://www.redlix.co.in"}/employee`,
        });

        return NextResponse.json({
            success: true,
            message: "Pink slip allocated and email sent",
            deadline: deadline.toISOString(),
        });
    } catch (error) {
        console.error("Pink slip allocation error:", error);
        return NextResponse.json({ success: false, message: "Failed to allocate pink slip" }, { status: 500 });
    }
}

// Admin can also DELETE to revoke a pink slip (forgive employee)
export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: idStr } = await params;
        const id = parseInt(idStr);
        if (isNaN(id)) {
            return NextResponse.json({ success: false, message: "Invalid ID" }, { status: 400 });
        }

        await prisma.employee.update({
            where: { id },
            data: {
                pinkSlipAllocatedAt: null,
                pinkSlipRequest: null,
                pinkSlipRequestAt: null,
                pinkSlipRevoked: true,
            },
        });

        return NextResponse.json({ success: true, message: "Pink slip revoked" });
    } catch (error) {
        console.error("Pink slip revoke error:", error);
        return NextResponse.json({ success: false, message: "Failed to revoke pink slip" }, { status: 500 });
    }
}
