import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import prisma from "@/lib/prisma";

// GET all documents (employees can view all documents)
export async function GET(request: NextRequest) {
    try {
        const token = request.cookies.get("employee_token")?.value;
        if (!token) {
            return NextResponse.json({ success: false, message: "Not authenticated" }, { status: 401 });
        }

        const secret = new TextEncoder().encode(process.env.JWT_SECRET || "default_secret");
        try {
            await jwtVerify(token, secret);
        } catch {
            return NextResponse.json({ success: false, message: "Invalid session" }, { status: 401 });
        }

        const documents = await prisma.document.findMany({
            orderBy: { createdAt: "desc" }
        });

        return NextResponse.json({ success: true, data: documents });
    } catch (error) {
        console.error("Employee documents fetch error:", error);
        return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
    }
}
