import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
    try {
        const { token, newPassword } = await request.json();

        if (!token || !newPassword) {
            return NextResponse.json(
                { success: false, message: "Token and new password are required" },
                { status: 400 }
            );
        }

        // Find employee with valid token
        const employee = await prisma.employee.findFirst({
            where: {
                resetToken: token,
            },
        });

        if (!employee || !employee.resetTokenExpiry || employee.resetTokenExpiry < new Date()) {
            return NextResponse.json(
                { success: false, message: "Invalid or expired password reset token" },
                { status: 400 }
            );
        }

        // Update password and clear reset token fields
        await prisma.employee.update({
            where: { id: employee.id },
            data: {
                password: newPassword,
                resetToken: null,
                resetTokenExpiry: null,
            },
        });

        return NextResponse.json({
            success: true,
            message: "Password has been reset successfully. You can now log in.",
        });
    } catch (error) {
        console.error("Reset Password Error:", error);
        return NextResponse.json(
            { success: false, message: "Internal server error" },
            { status: 500 }
        );
    }
}
