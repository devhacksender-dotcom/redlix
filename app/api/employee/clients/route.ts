import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { jwtVerify } from "jose";

export async function GET(request: NextRequest) {
    try {
        const token = request.cookies.get("employee_token")?.value;

        if (!token) {
            return NextResponse.json(
                { success: false, message: "Not authenticated" },
                { status: 401 }
            );
        }

        const secret = new TextEncoder().encode(process.env.JWT_SECRET || "default_secret");
        
        try {
            await jwtVerify(token, secret);
            
            const clients = await prisma.client.findMany({
                orderBy: { companyName: "asc" },
                select: {
                    id: true,
                    companyName: true,
                    appName: true,
                    clientName: true,
                }
            });

            return NextResponse.json({
                success: true,
                data: clients,
            });
        } catch (err) {
            return NextResponse.json(
                { success: false, message: "Invalid session token" },
                { status: 401 }
            );
        }
    } catch (error) {
        console.error("Employee Clients API Error:", error);
        return NextResponse.json(
            { success: false, message: "Internal server error" },
            { status: 500 }
        );
    }
}
