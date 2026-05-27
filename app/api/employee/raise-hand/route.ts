import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import prisma from "@/lib/prisma";
import { sendHandRaiseNotification } from "@/utils/email";

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
        } catch {
            return NextResponse.json(
                { success: false, message: "Invalid session token" },
                { status: 401 }
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

        // Get admin email from environment variable, fallback to SMTP_EMAIL
        const adminEmail = process.env.ADMIN_EMAIL || process.env.SMTP_EMAIL;

        if (!adminEmail) {
            return NextResponse.json(
                { success: false, message: "Admin email not configured" },
                { status: 500 }
            );
        }

        const raisedAt = new Date().toISOString();

        const emailResult = await sendHandRaiseNotification({
            employeeName: employee.name,
            employeeEmail: employee.email,
            adminEmail,
            raisedAt,
        });

        if (!emailResult.success) {
            return NextResponse.json(
                { success: false, message: "Failed to notify admin. Please try again." },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            message: "Admin has been notified. They will reach out to you shortly.",
        });
    } catch (error) {
        console.error("Raise Hand Error:", error);
        return NextResponse.json(
            { success: false, message: "Internal server error" },
            { status: 500 }
        );
    }
}
