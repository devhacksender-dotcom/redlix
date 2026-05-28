import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import prisma from "@/lib/prisma";
import { autoPunchOutStaleSessions } from "@/lib/attendanceHelper";

export async function GET(request: NextRequest) {
    try {
        const token = request.cookies.get("employee_token")?.value;

        if (!token) {
            return NextResponse.json(
                { success: false, message: "Not authenticated" },
                { status: 401 }
            );
        }

        const secret = new TextEncoder().encode(process.env.JWT_SECRET || "default_secret");
        
        try {
            const { payload } = await jwtVerify(token, secret);
            const employeeId = payload.employeeId as number;

            // Auto punch-out stale sessions
            await autoPunchOutStaleSessions();

            const employee = await prisma.employee.findUnique({
                where: { id: employeeId },
            });

            if (!employee) {
                return NextResponse.json(
                    { success: false, message: "Employee profile not found" },
                    { status: 404 }
                );
            }

            return NextResponse.json({
                success: true,
                data: {
                    id: employee.id,
                    name: employee.name,
                    email: employee.email,
                    role: employee.role,
                    phone: employee.phone,
                    upiId: employee.upiId,
                    fatherName: employee.fatherName,
                    mobile: employee.mobile,
                    altEmail: employee.altEmail,
                    address: employee.address,
                    joinedAt: employee.joinedAt,
                }
            });
        } catch (err) {
            return NextResponse.json(
                { success: false, message: "Invalid session token" },
                { status: 401 }
            );
        }
    } catch (error) {
        console.error("Employee Profile API Error:", error);
        return NextResponse.json(
            { success: false, message: "Internal server error" },
            { status: 500 }
        );
    }
}
