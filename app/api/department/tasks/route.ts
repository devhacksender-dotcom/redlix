import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sendTaskAssignmentEmail } from "@/utils/email";

export async function GET() {
    try {
        const tasks = await prisma.task.findMany({
            include: {
                employee: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        role: true,
                    }
                }
            },
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json({
            success: true,
            data: tasks,
        });
    } catch (error) {
        console.error("Department Tasks GET Error:", error);
        return NextResponse.json(
            { success: false, message: "Failed to fetch tasks" },
            { status: 500 }
        );
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { title, description, employeeId, deadline } = body;

        if (!title || !employeeId) {
            return NextResponse.json(
                { success: false, message: "Missing required fields" },
                { status: 400 }
            );
        }

        const employee = await prisma.employee.findUnique({
            where: { id: parseInt(employeeId) }
        });

        if (!employee) {
            return NextResponse.json(
                { success: false, message: "Employee not found" },
                { status: 404 }
            );
        }

        const task = await prisma.task.create({
            data: {
                title,
                description,
                employeeId: parseInt(employeeId),
                deadline: deadline ? new Date(deadline) : null,
                status: "pending"
            },
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

        // Trigger automatic email notification to the assigned employee (non-blocking)
        if (task.employee) {
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
        console.error("Department Tasks POST Error:", error);
        return NextResponse.json(
            { success: false, message: "Failed to create task" },
            { status: 500 }
        );
    }
}
