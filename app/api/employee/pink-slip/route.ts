import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import prisma from "@/lib/prisma";
import { sendPinkSlipRequestReceivedEmail } from "@/utils/email";

async function getEmployeeIdFromToken(request: NextRequest): Promise<number | null> {
    const token = request.cookies.get("employee_token")?.value;
    if (!token) return null;
    try {
        const secret = new TextEncoder().encode(process.env.JWT_SECRET || "default_secret");
        const { payload } = await jwtVerify(token, secret);
        return payload.employeeId as number;
    } catch {
        return null;
    }
}

// GET - check if current employee has an active pink slip
export async function GET(request: NextRequest) {
    try {
        const employeeId = await getEmployeeIdFromToken(request);

        if (!employeeId) {
            return NextResponse.json({ success: false, message: "Not authenticated" }, { status: 401 });
        }

        const employee = await prisma.employee.findUnique({
            where: { id: employeeId },
            select: {
                pinkSlipAllocatedAt: true,
                pinkSlipRequest: true,
                pinkSlipRequestAt: true,
                pinkSlipRevoked: true,
            },
        });

        if (!employee) {
            return NextResponse.json({ success: false, message: "Employee not found" }, { status: 404 });
        }

        // Active = allocated and not revoked
        const isActive = !!(employee.pinkSlipAllocatedAt && !employee.pinkSlipRevoked);

        let deadline: string | null = null;
        let isExpired = false;

        if (isActive && employee.pinkSlipAllocatedAt) {
            const dl = new Date(employee.pinkSlipAllocatedAt.getTime() + 32 * 60 * 60 * 1000);
            deadline = dl.toISOString();
            isExpired = new Date() > dl;
        }

        return NextResponse.json({
            success: true,
            data: {
                isActive,
                allocatedAt: employee.pinkSlipAllocatedAt?.toISOString() || null,
                deadline,
                isExpired,
                hasSubmittedRequest: !!employee.pinkSlipRequest,
                pinkSlipRequest: employee.pinkSlipRequest,
                pinkSlipRequestAt: employee.pinkSlipRequestAt?.toISOString() || null,
            },
        });
    } catch (error) {
        console.error("Pink slip status error:", error);
        return NextResponse.json({ success: false, message: "Failed to fetch pink slip status" }, { status: 500 });
    }
}

// POST - employee submits their appeal
export async function POST(request: NextRequest) {
    try {
        const employeeId = await getEmployeeIdFromToken(request);

        if (!employeeId) {
            return NextResponse.json({ success: false, message: "Not authenticated" }, { status: 401 });
        }

        const body = await request.json();
        const { appealReason, appealDetails, contactInfo } = body;

        if (!appealReason || !appealDetails) {
            return NextResponse.json({ success: false, message: "Appeal reason and details are required" }, { status: 400 });
        }

        const employee = await prisma.employee.findUnique({ where: { id: employeeId } });

        if (!employee) {
            return NextResponse.json({ success: false, message: "Employee not found" }, { status: 404 });
        }

        if (!employee.pinkSlipAllocatedAt) {
            return NextResponse.json({ success: false, message: "No active pink slip found" }, { status: 400 });
        }

        // Check if deadline has passed
        const deadline = new Date(employee.pinkSlipAllocatedAt.getTime() + 32 * 60 * 60 * 1000);
        if (new Date() > deadline) {
            return NextResponse.json({ success: false, message: "The 32-hour appeal window has expired" }, { status: 400 });
        }

        // Check if already submitted
        if (employee.pinkSlipRequest) {
            return NextResponse.json({ success: false, message: "You have already submitted an appeal" }, { status: 400 });
        }

        const now = new Date();
        const requestText = `Reason: ${appealReason}\n\nDetails: ${appealDetails}${contactInfo ? `\n\nContact Info: ${contactInfo}` : ""}`;

        await prisma.employee.update({
            where: { id: employeeId },
            data: {
                pinkSlipRequest: requestText,
                pinkSlipRequestAt: now,
            },
        });

        // Send confirmation email to the employee
        await sendPinkSlipRequestReceivedEmail({
            to: employee.email,
            name: employee.name,
            requestSummary: requestText,
            submittedAt: now,
        });

        return NextResponse.json({ success: true, message: "Appeal submitted successfully" });
    } catch (error) {
        console.error("Pink slip appeal submission error:", error);
        return NextResponse.json({ success: false, message: "Failed to submit appeal" }, { status: 500 });
    }
}
