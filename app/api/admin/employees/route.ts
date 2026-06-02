import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
    try {
        const employees = await prisma.employee.findMany({
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json({
            success: true,
            data: employees,
        });
    } catch (error) {
        console.error("Admin API Error:", error);
        return NextResponse.json(
            { success: false, message: "Failed to fetch employees" },
            { status: 500 }
        );
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name, email, role, password, offerLetterLink, isDeptAdmin, division } = body;

        if (!name || !email || !role) {
            return NextResponse.json(
                { success: false, message: "Missing required fields" },
                { status: 400 }
            );
        }

        const existingEmployee = await prisma.employee.findUnique({
            where: { email },
        });

        if (existingEmployee) {
            return NextResponse.json(
                { success: false, message: "An employee with this email already exists." },
                { status: 400 }
            );
        }

        const employee = await prisma.employee.create({
            data: {
                name,
                email,
                role,
                password: password || undefined,
                offerLetterLink,
                isDeptAdmin: isDeptAdmin !== undefined ? !!isDeptAdmin : false,
                division: division || null,
            },
        });

        return NextResponse.json({
            success: true,
            data: employee,
        });
    } catch (error) {
        console.error("Admin API Error:", error);
        return NextResponse.json(
            { success: false, message: "Failed to create employee" },
            { status: 500 }
        );
    }
}
