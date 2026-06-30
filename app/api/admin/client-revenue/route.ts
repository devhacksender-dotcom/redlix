import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
    try {
        const records = await prisma.clientRevenue.findMany({
            orderBy: { createdAt: "desc" },
            include: {
                client: {
                    select: { id: true, companyName: true, clientName: true, email: true },
                },
            },
        });
        return NextResponse.json({ success: true, data: records });
    } catch (error) {
        console.error("Fetch client revenue error:", error);
        return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { clientId, clientName, month, amount, notes, receivedAt } = body;

        if (!month || amount === undefined || amount === null || amount === "") {
            return NextResponse.json(
                { success: false, message: "Month and amount are required" },
                { status: 400 }
            );
        }

        let resolvedClientName = (clientName || "").trim();
        let resolvedClientId: number | null = clientId ? Number(clientId) : null;

        if (resolvedClientId) {
            const client = await prisma.client.findUnique({ where: { id: resolvedClientId } });
            if (!client) {
                return NextResponse.json({ success: false, message: "Client not found" }, { status: 404 });
            }
            resolvedClientName = client.companyName || client.clientName;
        }

        if (!resolvedClientName) {
            return NextResponse.json(
                { success: false, message: "Client name or registered client is required" },
                { status: 400 }
            );
        }

        const record = await prisma.clientRevenue.create({
            data: {
                clientId: resolvedClientId,
                clientName: resolvedClientName,
                month: String(month).trim(),
                amount: Number(amount),
                notes: notes?.trim() || null,
                receivedAt: receivedAt ? new Date(receivedAt) : null,
            },
            include: {
                client: {
                    select: { id: true, companyName: true, clientName: true, email: true },
                },
            },
        });

        return NextResponse.json({ success: true, data: record });
    } catch (error) {
        console.error("Create client revenue error:", error);
        return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
    }
}
