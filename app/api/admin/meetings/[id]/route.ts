import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

type Params = { params: Promise<{ id: string }> };

// PATCH update a meeting
export async function PATCH(request: NextRequest, { params }: Params) {
    try {
        const { id } = await params;
        const meetingId = parseInt(id);
        const body = await request.json();
        const { title, description, meetingLead, meetingLink, scheduledAt, attendeeIds } = body;

        // Update meeting fields
        const meeting = await prisma.meeting.update({
            where: { id: meetingId },
            data: {
                ...(title && { title }),
                ...(description !== undefined && { description }),
                ...(meetingLead && { meetingLead }),
                ...(meetingLink !== undefined && { meetingLink }),
                ...(scheduledAt && { scheduledAt: new Date(scheduledAt) }),
                ...(attendeeIds && {
                    attendees: {
                        deleteMany: {},
                        create: attendeeIds.map((eid: number) => ({ employeeId: eid }))
                    }
                })
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
        console.error("Update meeting error:", error);
        return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
    }
}

// DELETE a meeting
export async function DELETE(request: NextRequest, { params }: Params) {
    try {
        const { id } = await params;
        await prisma.meeting.delete({ where: { id: parseInt(id) } });
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Delete meeting error:", error);
        return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
    }
}
