import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET all declarations from all employees (admin view)
export async function GET() {
    try {
        const declarations = await prisma.declaration.findMany({
            orderBy: { createdAt: "desc" },
            select: {
                id: true,
                fileName: true,
                fileType: true,
                fileSize: true,
                fileData: true,
                clientName: true,
                notes: true,
                status: true,
                createdAt: true,
                employee: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        role: true
                    }
                }
            }
        });

        return NextResponse.json({ success: true, data: declarations });
    } catch (error) {
        console.error("Admin fetch declarations error:", error);
        return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
    }
}
