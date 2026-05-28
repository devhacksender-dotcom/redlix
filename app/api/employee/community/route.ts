import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import prisma from "@/lib/prisma";

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

            // Fetch the 100 most recent community updates
            const updates = await prisma.communityUpdate.findMany({
                include: {
                    employee: {
                        select: {
                            id: true,
                            name: true,
                            role: true,
                            email: true,
                        }
                    }
                },
                orderBy: { createdAt: "desc" },
                take: 100,
            });

            return NextResponse.json({
                success: true,
                data: updates,
            });
        } catch (err) {
            return NextResponse.json(
                { success: false, message: "Invalid session token" },
                { status: 401 }
            );
        }
    } catch (error) {
        console.error("Employee Community GET Error:", error);
        return NextResponse.json(
            { success: false, message: "Internal server error" },
            { status: 500 }
        );
    }
}

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
            const { tasksDone, learnt, gained, docLink } = body;

            if (!tasksDone || tasksDone.trim().length === 0) {
                return NextResponse.json(
                    { success: false, message: "Tasks completed is required" },
                    { status: 400 }
                );
            }
            if (!learnt || learnt.trim().length === 0) {
                return NextResponse.json(
                    { success: false, message: "What you have learnt is required" },
                    { status: 400 }
                );
            }
            if (!gained || gained.trim().length === 0) {
                return NextResponse.json(
                    { success: false, message: "How much you have gained is required" },
                    { status: 400 }
                );
            }

            let formattedDocLink = docLink ? docLink.trim() : null;
            if (formattedDocLink && !/^https?:\/\//i.test(formattedDocLink)) {
                formattedDocLink = `https://${formattedDocLink}`;
            }

            const newUpdate = await prisma.communityUpdate.create({
                data: {
                    employeeId,
                    tasksDone: tasksDone.trim(),
                    learnt: learnt.trim(),
                    gained: gained.trim(),
                    docLink: formattedDocLink,
                },
                include: {
                    employee: {
                        select: {
                            id: true,
                            name: true,
                            role: true,
                            email: true,
                        }
                    }
                }
            });

            return NextResponse.json({
                success: true,
                data: newUpdate,
            });
        } catch (err) {
            return NextResponse.json(
                { success: false, message: "Invalid session token" },
                { status: 401 }
            );
        }
    } catch (error) {
        console.error("Employee Community POST Error:", error);
        return NextResponse.json(
            { success: false, message: "Internal server error" },
            { status: 500 }
        );
    }
}
