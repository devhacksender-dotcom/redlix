import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { jwtVerify } from "jose";

export async function GET(request: NextRequest) {
    try {
        const token = request.cookies.get("admin_token")?.value;

        if (!token) {
            return NextResponse.json(
                { success: false, message: "Not authenticated" },
                { status: 401 }
            );
        }

        const secret = new TextEncoder().encode(process.env.JWT_SECRET || "default_secret");
        
        try {
            await jwtVerify(token, secret);

            const submissions = await prisma.workSubmission.findMany({
                include: {
                    employee: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            role: true,
                            avatar: true,
                        }
                    },
                    client: {
                        select: {
                            id: true,
                            companyName: true,
                            clientName: true,
                            appName: true
                        }
                    }
                },
                orderBy: { createdAt: "desc" }
            });

            return NextResponse.json({
                success: true,
                data: submissions
            });

        } catch (err) {
            return NextResponse.json(
                { success: false, message: "Invalid session token" },
                { status: 401 }
            );
        }
    } catch (error) {
        console.error("Admin Fetch Work Submissions API Error:", error);
        return NextResponse.json(
            { success: false, message: "Internal server error" },
            { status: 500 }
        );
    }
}
