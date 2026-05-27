import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import prisma from "@/lib/prisma";

// GET meetings for the logged-in employee
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

        const attendees = await prisma.meetingAttendee.findMany({
            where: { employeeId },
            include: {
                meeting: {
                    include: {
                        attendees: {
                            include: {
                                employee: { select: { id: true, name: true, role: true } }
                            }
                        }
                    }
                }
            },
            orderBy: { meeting: { scheduledAt: "asc" } }
        });

        const meetings = attendees.map(a => a.meeting);
        return NextResponse.json({ success: true, data: meetings });
    } catch (error) {
        console.error("Employee meetings fetch error:", error);
        return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
    }
}
