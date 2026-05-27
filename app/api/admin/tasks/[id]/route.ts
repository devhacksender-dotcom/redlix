import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: idStr } = await params;
        const id = parseInt(idStr);
        if (isNaN(id)) {
            return NextResponse.json(
                { success: false, message: "Invalid ID parameter" },
                { status: 400 }
            );
        }

        const body = await req.json();
        const { title, description, status, deadline, employeeId } = body;

        const updateData: any = {};
        if (title !== undefined) updateData.title = title;
        if (description !== undefined) updateData.description = description;
        if (status !== undefined) updateData.status = status;
        if (deadline !== undefined) updateData.deadline = deadline ? new Date(deadline) : null;
        if (employeeId !== undefined) updateData.employeeId = parseInt(employeeId);

        const task = await prisma.task.update({
            where: { id },
            data: updateData,
            include: {
                employee: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        role: true,
                    }
                }
            }
        });

        return NextResponse.json({
            success: true,
            data: task,
        });
    } catch (error) {
        console.error("Admin Task PATCH Error:", error);
        return NextResponse.json(
            { success: false, message: "Failed to update task" },
            { status: 500 }
        );
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: idStr } = await params;
        const id = parseInt(idStr);
        if (isNaN(id)) {
            return NextResponse.json(
                { success: false, message: "Invalid ID parameter" },
                { status: 400 }
            );
        }

        await prisma.task.delete({
            where: { id },
        });

        return NextResponse.json({
            success: true,
            message: "Task deleted successfully",
        });
    } catch (error) {
        console.error("Admin Task DELETE Error:", error);
        return NextResponse.json(
            { success: false, message: "Failed to delete task" },
            { status: 500 }
        );
    }
}
