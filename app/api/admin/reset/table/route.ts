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

        const body = await request.json();
        const { table } = body;

        if (!table) {
            return NextResponse.json({ success: false, message: "Table parameter is required" }, { status: 400 });
        }

        switch (table) {
            case "contact_inquiries":
                await prisma.contactInquiry.deleteMany();
                break;
            case "support_tickets":
                await prisma.supportTicket.deleteMany();
                break;
            case "intern_support":
                await prisma.internSupport.deleteMany();
                break;
            case "employees":
                // Cascades automatically via FK relations
                await prisma.employee.deleteMany();
                break;
            case "clients":
                await prisma.client.deleteMany();
                break;
            case "tasks":
                await prisma.task.deleteMany();
                break;
            case "attendance":
                await prisma.attendance.deleteMany();
                break;
            case "meetings":
                // Meeting attendee has dependencies on meeting, let's clear both
                await prisma.meetingAttendee.deleteMany();
                await prisma.meeting.deleteMany();
                break;
            case "documents":
                await prisma.document.deleteMany();
                break;
            case "payrolls":
                await prisma.payroll.deleteMany();
                break;
            case "leave_requests":
                await prisma.leaveRequest.deleteMany();
                break;
            case "declarations":
                await prisma.declaration.deleteMany();
                break;
            case "system_settings":
                await prisma.systemSetting.deleteMany();
                break;
            default:
                return NextResponse.json({ success: false, message: "Invalid table specified" }, { status: 400 });
        }

        return NextResponse.json({ success: true, message: `Successfully cleared all data from table: ${table}` });
    } catch (error) {
        console.error("Selective delete error:", error);
        return NextResponse.json({ success: false, message: "Failed to clear table data" }, { status: 500 });
    }
}
