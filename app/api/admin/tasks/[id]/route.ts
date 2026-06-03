import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sendTaskAssignmentEmail } from "@/utils/email";

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

        const updateData: {
            title?: string;
            description?: string;
            status?: string;
            deadline?: Date | null;
            employeeId?: number;
        } = {};
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

        // Trigger automatic email notification to the assigned employee (non-blocking) if assignee is updated
        if (employeeId !== undefined && task.employee) {
            sendTaskAssignmentEmail({
                to: task.employee.email,
                employeeName: task.employee.name,
                taskTitle: task.title,
                taskDescription: task.description ?? undefined,
                deadline: task.deadline,
            }).catch(err => {
                console.error("Failed to send task assignment email asynchronously:", err);
            });
        }

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
