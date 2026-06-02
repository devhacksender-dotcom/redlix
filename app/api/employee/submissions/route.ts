import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { jwtVerify } from "jose";

export async function POST(request: NextRequest) {
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
            const { payload } = await jwtVerify(token, secret);
            const employeeId = payload.employeeId as number;

            const body = await request.json();
            const { clientId, websiteLink, gitRepoLink } = body;

            if (!clientId || !websiteLink || !gitRepoLink) {
                return NextResponse.json(
                    { success: false, message: "Missing required fields: clientId, websiteLink, or gitRepoLink" },
                    { status: 400 }
                );
            }

            const parsedClientId = parseInt(clientId, 10);
            if (isNaN(parsedClientId)) {
                return NextResponse.json(
                    { success: false, message: "Invalid clientId value" },
                    { status: 400 }
                );
            }

            // Verify client exists
            const client = await prisma.client.findUnique({
                where: { id: parsedClientId }
            });

            if (!client) {
                return NextResponse.json(
                    { success: false, message: "Client not found" },
                    { status: 404 }
                );
            }

            const submission = await prisma.workSubmission.create({
                data: {
                    employeeId,
                    clientId: parsedClientId,
                    websiteLink,
                    gitRepoLink
                },
                include: {
                    client: {
                        select: {
                            companyName: true,
                            clientName: true
                        }
                    }
                }
            });

            return NextResponse.json({
                success: true,
                message: "Work submission submitted successfully!",
                data: submission
            });

        } catch (err) {
            return NextResponse.json(
                { success: false, message: "Invalid session token" },
                { status: 401 }
            );
        }
    } catch (error) {
        console.error("Employee Work Submission API Error:", error);
        return NextResponse.json(
            { success: false, message: "Internal server error" },
            { status: 500 }
        );
    }
}

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
            const { payload } = await jwtVerify(token, secret);
            const employeeId = payload.employeeId as number;

            const submissions = await prisma.workSubmission.findMany({
                where: { employeeId },
                include: {
                    client: {
                        select: {
                            companyName: true,
                            clientName: true
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
        console.error("Employee Work Submissions Fetch API Error:", error);
        return NextResponse.json(
            { success: false, message: "Internal server error" },
            { status: 500 }
        );
    }
}
