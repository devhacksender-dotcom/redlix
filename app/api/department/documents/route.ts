import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
    try {
        const documents = await prisma.document.findMany({
            orderBy: { createdAt: "desc" }
        });
        return NextResponse.json({ success: true, data: documents });
    } catch (error) {
        console.error("Fetch department documents error:", error);
        return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { title, description, category, fileUrl, fileName, uploadedBy } = body;

        if (!title || !fileUrl || !fileName) {
            return NextResponse.json({ success: false, message: "Title, file URL and file name are required" }, { status: 400 });
        }

        const document = await prisma.document.create({
            data: {
                title,
                description: description || null,
                category: category || "company",
                fileUrl,
                fileName,
                uploadedBy: uploadedBy || "Department Lead"
            }
        });

        return NextResponse.json({ success: true, data: document });
    } catch (error) {
        console.error("Create department document error:", error);
        return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
    }
}
