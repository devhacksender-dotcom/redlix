import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import prisma from "@/lib/prisma";

export async function PATCH(
    request: NextRequest,
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

            // Find the task and make sure it belongs to the employee
            const task = await prisma.task.findUnique({
                where: { id },
            });

            if (!task) {
                return NextResponse.json(
                    { success: false, message: "Task not found" },
                    { status: 404 }
                );
            }

            if (task.employeeId !== employeeId) {
                return NextResponse.json(
                    { success: false, message: "Unauthorized to update this task" },
                    { status: 403 }
                );
            }

            const body = await request.json();
            const { status } = body;

            if (!status || !["pending", "in_progress", "completed"].includes(status)) {
                return NextResponse.json(
                    { success: false, message: "Invalid status value" },
                    { status: 400 }
                );
            }

            const updatedTask = await prisma.task.update({
                where: { id },
                data: { status },
            });

            return NextResponse.json({
                success: true,
                data: updatedTask,
            });
        } catch (err) {
            return NextResponse.json(
                { success: false, message: "Invalid session token" },
                { status: 401 }
            );
        }
    } catch (error) {
        console.error("Employee Task PATCH Error:", error);
        return NextResponse.json(
            { success: false, message: "Internal server error" },
            { status: 500 }
        );
    }
}
