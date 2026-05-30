import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import prisma from "@/lib/prisma";

const secret = new TextEncoder().encode(process.env.JWT_SECRET || "default_secret");

async function getEmployeeId(request: NextRequest): Promise<number | null> {
    const token = request.cookies.get("employee_token")?.value;
    if (!token) return null;
    try {
        const { payload } = await jwtVerify(token, secret);
        return payload.employeeId as number;
    } catch {
        return null;
    }
}

// GET — list own declarations (without file data for performance)
export async function GET(request: NextRequest) {
    try {
        const employeeId = await getEmployeeId(request);
        if (!employeeId) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        const declarations = await prisma.declaration.findMany({
            where: { employeeId },
            orderBy: { createdAt: "desc" },
            select: {
                id: true,
                fileName: true,
                fileType: true,
                fileSize: true,
                clientName: true,
                notes: true,
                status: true,
                createdAt: true
            }
        });

        return NextResponse.json({ success: true, data: declarations });
    } catch (error) {
        console.error("Fetch declarations error:", error);
        return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
    }
}

// POST — submit a new declaration
export async function POST(request: NextRequest) {
    try {
        const employeeId = await getEmployeeId(request);
        if (!employeeId) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const { fileName, fileType, fileData, fileSize, clientName, notes } = body;

        if (!fileName || !fileType || !fileData) {
            return NextResponse.json(
                { success: false, message: "fileName, fileType, and fileData are required" },
                { status: 400 }
            );
        }

        // Limit to ~10MB base64 string length (~7.5MB raw file)
        if (fileData.length > 14_000_000) {
            return NextResponse.json(
                { success: false, message: "File too large. Please upload files smaller than 10MB." },
                { status: 400 }
            );
        }

        const declaration = await prisma.declaration.create({
            data: {
                employeeId,
                fileName,
                fileType,
                fileData,
                fileSize: fileSize || 0,
                clientName: clientName?.trim() || null,
                notes: notes?.trim() || null,
                status: "pending"
            },
            select: {
                id: true,
                fileName: true,
                fileType: true,
                fileSize: true,
                clientName: true,
                notes: true,
                status: true,
                createdAt: true
            }
        });

        return NextResponse.json({ success: true, data: declaration });
    } catch (error) {
        console.error("Submit declaration error:", error);
        return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
    }
}
