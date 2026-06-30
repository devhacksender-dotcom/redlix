import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();
        const { clientId, clientName, month, amount, notes, receivedAt } = body;

        const existing = await prisma.clientRevenue.findUnique({ where: { id: Number(id) } });
        if (!existing) {
            return NextResponse.json({ success: false, message: "Record not found" }, { status: 404 });
        }

        const dataUpdate: {
            clientId?: number | null;
            clientName?: string;
            month?: string;
            amount?: number;
            notes?: string | null;
            receivedAt?: Date | null;
        } = {};

        if (clientId !== undefined) {
            if (clientId === null || clientId === "") {
                dataUpdate.clientId = null;
            } else {
                const client = await prisma.client.findUnique({ where: { id: Number(clientId) } });
                if (!client) {
                    return NextResponse.json({ success: false, message: "Client not found" }, { status: 404 });
                }
                dataUpdate.clientId = client.id;
                dataUpdate.clientName = client.companyName || client.clientName;
            }
        }

        if (clientName !== undefined) dataUpdate.clientName = String(clientName).trim();
        if (month !== undefined) dataUpdate.month = String(month).trim();
        if (amount !== undefined) dataUpdate.amount = Number(amount);
        if (notes !== undefined) dataUpdate.notes = notes?.trim() || null;
        if (receivedAt !== undefined) dataUpdate.receivedAt = receivedAt ? new Date(receivedAt) : null;

        const updated = await prisma.clientRevenue.update({
            where: { id: Number(id) },
            data: dataUpdate,
            include: {
                client: {
                    select: { id: true, companyName: true, clientName: true, email: true },
                },
            },
        });

        return NextResponse.json({ success: true, data: updated });
    } catch (error) {
        console.error("Update client revenue error:", error);
        return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
    }
}

export async function DELETE(
    _request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        await prisma.clientRevenue.delete({ where: { id: Number(id) } });
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Delete client revenue error:", error);
        return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
    }
}
