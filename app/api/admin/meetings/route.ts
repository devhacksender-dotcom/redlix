import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET all meetings with attendees
export async function GET() {
    try {
        const meetings = await prisma.meeting.findMany({
            orderBy: { scheduledAt: "asc" },
            include: {
                attendees: {
                    include: {
                        employee: {
                            select: { id: true, name: true, email: true, role: true }
                        }
                    }
                }
            }
        });
        return NextResponse.json({ success: true, data: meetings });
    } catch (error) {
        console.error("Fetch meetings error:", error);
        return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
    }
}

// POST create a new meeting
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { title, description, meetingLead, meetingLink, scheduledAt, attendeeIds } = body;

        if (!title || !meetingLead || !scheduledAt) {
            return NextResponse.json({ success: false, message: "Title, meeting lead and scheduled time are required" }, { status: 400 });
        }

        const meeting = await prisma.meeting.create({
            data: {
                title,
                description: description || null,
                meetingLead,
                meetingLink: meetingLink || null,
                scheduledAt: new Date(scheduledAt),
                attendees: {
                    create: (attendeeIds || []).map((eid: number) => ({ employeeId: eid }))
                }
            },
            include: {
                attendees: {
                    include: {
                        employee: { select: { id: true, name: true, email: true, role: true } }
                    }
                }
            }
        });

        return NextResponse.json({ success: true, data: meeting });
    } catch (error) {
        console.error("Create meeting error:", error);
        return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
    }
}
