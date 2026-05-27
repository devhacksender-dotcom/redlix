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
        const { name, email, role, password, offerLetterLink, joinedAt } = body;

        // If email is changing, make sure it is unique
        if (email) {
            const existing = await prisma.employee.findUnique({
                where: { email },
            });
            if (existing && existing.id !== id) {
                return NextResponse.json(
                    { success: false, message: "An employee with this email already exists." },
                    { status: 400 }
                );
            }
        }

        const updateData: any = {};
        if (name !== undefined) updateData.name = name;
        if (email !== undefined) updateData.email = email;
        if (role !== undefined) updateData.role = role;
        if (password !== undefined) updateData.password = password;
        if (offerLetterLink !== undefined) updateData.offerLetterLink = offerLetterLink;
        if (joinedAt !== undefined) updateData.joinedAt = new Date(joinedAt);

        const employee = await prisma.employee.update({
            where: { id },
            data: updateData,
        });

        return NextResponse.json({
            success: true,
            data: employee,
        });
    } catch (error) {
        console.error("Employee PATCH Error:", error);
        return NextResponse.json(
            { success: false, message: "Failed to update employee" },
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

        await prisma.employee.delete({
            where: { id },
        });

        return NextResponse.json({
            success: true,
            message: "Employee deleted successfully",
        });
    } catch (error) {
        console.error("Employee DELETE Error:", error);
        return NextResponse.json(
            { success: false, message: "Failed to delete employee" },
            { status: 500 }
        );
    }
}
