import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import prisma from "@/lib/prisma";
import { sendResetPasswordEmail } from "@/utils/email";

export async function POST(request: NextRequest) {
    try {
        const { email } = await request.json();

        if (!email) {
            return NextResponse.json(
                { success: false, message: "Email is required" },
                { status: 400 }
            );
        }

        const employee = await prisma.employee.findUnique({
            where: { email: email.toLowerCase() },
        });

        if (!employee) {
            return NextResponse.json(
                { success: false, message: "No registered employee found with this email address" },
                { status: 404 }
            );
        }

        // Generate reset token and expiry (1 hour from now)
        const token = crypto.randomUUID();
        const expiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

        await prisma.employee.update({
            where: { id: employee.id },
            data: {
                resetToken: token,
                resetTokenExpiry: expiry,
            },
        });

        // Generate reset link
        const origin = request.nextUrl.origin;
        const resetLink = `${origin}/employee/reset-password?token=${token}`;

        const emailResult = await sendResetPasswordEmail({
            to: employee.email,
            name: employee.name,
            resetLink,
        });

        if (!emailResult.success) {
            return NextResponse.json(
                { success: false, message: "Failed to send reset email. Please contact support." },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            message: "Password reset link has been sent to your email",
        });
    } catch (error) {
        console.error("Forgot Password Error:", error);
        return NextResponse.json(
            { success: false, message: "Internal server error" },
            { status: 500 }
        );
    }
}
