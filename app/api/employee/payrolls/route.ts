import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import prisma from "@/lib/prisma";

// GET payroll history for the logged-in employee
export async function GET(request: NextRequest) {
    try {
        const token = request.cookies.get("employee_token")?.value;
        if (!token) {
            return NextResponse.json({ success: false, message: "Not authenticated" }, { status: 401 });
        }

        const secret = new TextEncoder().encode(process.env.JWT_SECRET || "default_secret");
        let employeeId: number;
        try {
            const { payload } = await jwtVerify(token, secret);
            employeeId = payload.employeeId as number;
        } catch {
            return NextResponse.json({ success: false, message: "Invalid session" }, { status: 401 });
        }

        const payrolls = await prisma.payroll.findMany({
            where: { employeeId },
            orderBy: { createdAt: "desc" }
        });

        return NextResponse.json({ success: true, data: payrolls });
    } catch (error) {
        console.error("Employee payrolls fetch error:", error);
        return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
    }
}
