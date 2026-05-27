import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import prisma from "@/lib/prisma";

// GET leaves history for logged-in employee
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

        const leaves = await prisma.leaveRequest.findMany({
            where: { employeeId },
            orderBy: { createdAt: "desc" }
        });

        return NextResponse.json({ success: true, data: leaves });
    } catch (error) {
        console.error("Employee leaves fetch error:", error);
        return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
    }
}

// POST submit a new leave request
export async function POST(request: NextRequest) {
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

        const body = await request.json();
        const { startDate, endDate, type, reason } = body;

        if (!startDate || !endDate || !type || !reason) {
            return NextResponse.json({ success: false, message: "All fields (startDate, endDate, type, reason) are required" }, { status: 400 });
        }

        const start = new Date(startDate);
        const end = new Date(endDate);

        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            return NextResponse.json({ success: false, message: "Invalid start or end date format" }, { status: 400 });
        }

        if (start > end) {
            return NextResponse.json({ success: false, message: "Start date cannot be after end date" }, { status: 400 });
        }

        const leave = await prisma.leaveRequest.create({
            data: {
                employeeId,
                startDate: start,
                endDate: end,
                type,
                reason,
                status: "pending"
            }
        });

        return NextResponse.json({ success: true, data: leave });
    } catch (error) {
        console.error("Employee leave create error:", error);
        return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
    }
}
