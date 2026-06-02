import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
    try {
        const token = request.cookies.get("employee_token")?.value;

        if (!token) {
            return NextResponse.json(
                { success: false, message: "Not authenticated" },
                { status: 401 }
            );
        }

        const secret = new TextEncoder().encode(process.env.JWT_SECRET || "default_secret");
        let employeeId: number;

        try {
            const { payload } = await jwtVerify(token, secret);
            employeeId = payload.employeeId as number;
        } catch (err) {
            return NextResponse.json(
                { success: false, message: "Invalid session token" },
                { status: 401 }
            );
        }

        const { currentPassword, newPassword } = await request.json();

        if (!currentPassword || !newPassword) {
            return NextResponse.json(
                { success: false, message: "Current and new password are required" },
                { status: 400 }
            );
        }

        const employee = await prisma.employee.findUnique({
            where: { id: employeeId },
        });

        if (!employee) {
            return NextResponse.json(
                { success: false, message: "Employee not found" },
                { status: 404 }
            );
        }

        if (employee.password !== currentPassword) {
            return NextResponse.json(
                { success: false, message: "Incorrect current password" },
                { status: 400 }
            );
        }

        await prisma.employee.update({
            where: { id: employeeId },
            data: { password: newPassword },
        });

        return NextResponse.json({
            success: true,
            message: "Password updated successfully",
        });
    } catch (error) {
        console.error("Employee Change Password Error:", error);
        return NextResponse.json(
            { success: false, message: "Internal server error" },
            { status: 500 }
        );
    }
}
