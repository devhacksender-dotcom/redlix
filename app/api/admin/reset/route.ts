import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
    try {
        // Authenticate strictly as admin
        const adminToken = request.cookies.get("admin_token")?.value;
        if (!adminToken) {
            return NextResponse.json({ success: false, message: "Unauthorized: Admin session required" }, { status: 401 });
        }

        const secret = new TextEncoder().encode(process.env.JWT_SECRET || "default_secret");
        try {
            await jwtVerify(adminToken, secret);
        } catch (error) {
            return NextResponse.json({ success: false, message: "Invalid session" }, { status: 401 });
        }

        // Perform clean cascade truncation or explicit deletions
        await prisma.$transaction([
            prisma.meetingAttendee.deleteMany(),
            prisma.meeting.deleteMany(),
            prisma.task.deleteMany(),
            prisma.attendance.deleteMany(),
            prisma.payroll.deleteMany(),
            prisma.leaveRequest.deleteMany(),
            prisma.employee.deleteMany(),
            prisma.document.deleteMany(),
            prisma.contactInquiry.deleteMany(),
            prisma.supportTicket.deleteMany(),
            prisma.internSupport.deleteMany(),
            prisma.client.deleteMany(),
            prisma.systemSetting.deleteMany(),
        ]);

        return NextResponse.json({ success: true, message: "Factory reset complete. All data cleared successfully." });
    } catch (error) {
        console.error("Master delete error:", error);
        return NextResponse.json({ success: false, message: "Failed to perform factory reset" }, { status: 500 });
    }
}
