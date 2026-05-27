import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET all payroll records
export async function GET() {
    try {
        const payrolls = await prisma.payroll.findMany({
            orderBy: { createdAt: "desc" },
            include: {
                employee: {
                    select: { id: true, name: true, email: true, role: true, upiId: true }
                }
            }
        });
        return NextResponse.json({ success: true, data: payrolls });
    } catch (error) {
        console.error("Fetch payrolls error:", error);
        return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
    }
}

// POST create/allocate new payroll record
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { employeeId, month, amount, status } = body;

        if (!employeeId || !month || !amount) {
            return NextResponse.json({ success: false, message: "Employee ID, month and amount are required" }, { status: 400 });
        }

        // Fetch employee details to check if they exist and copy their upiId
        const employee = await prisma.employee.findUnique({
            where: { id: Number(employeeId) }
        });

        if (!employee) {
            return NextResponse.json({ success: false, message: "Employee not found" }, { status: 404 });
        }

        const isPaid = status === "paid";
        const payroll = await prisma.payroll.create({
            data: {
                employeeId: Number(employeeId),
                month,
                amount: Number(amount),
                status: status || "pending",
                upiId: employee.upiId || null,
                paidAt: isPaid ? new Date() : null
            },
            include: {
                employee: {
                    select: { id: true, name: true, email: true, role: true }
                }
            }
        });

        return NextResponse.json({ success: true, data: payroll });
    } catch (error) {
        console.error("Create payroll error:", error);
        return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
    }
}
