import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// PATCH — update declaration status (pending → reviewed)
export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();
        const { status } = body;

        if (!status || !["pending", "reviewed"].includes(status)) {
            return NextResponse.json(
                { success: false, message: "Valid status (pending or reviewed) is required" },
                { status: 400 }
            );
        }

        const declaration = await prisma.declaration.update({
            where: { id: parseInt(id) },
            data: { status },
            select: {
                id: true,
                fileName: true,
                fileType: true,
                fileSize: true,
                clientName: true,
                notes: true,
                status: true,
                createdAt: true,
                employee: {
                    select: { id: true, name: true, email: true, role: true }
                }
            }
        });

        return NextResponse.json({ success: true, data: declaration });
    } catch (error) {
        console.error("Update declaration status error:", error);
        return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
    }
}

// DELETE — remove a declaration
export async function DELETE(
    _request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        await prisma.declaration.delete({
            where: { id: parseInt(id) }
        });

        return NextResponse.json({ success: true, message: "Declaration deleted" });
    } catch (error) {
        console.error("Delete declaration error:", error);
        return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
    }
}
