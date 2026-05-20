import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sendPaymentDueEmail } from "@/utils/email";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { clientId, amount, dueDate, invoiceFile } = body;

        if (!clientId || !amount || !dueDate) {
            return NextResponse.json(
                { success: false, message: "Missing required fields: clientId, amount, or dueDate" },
                { status: 400 }
            );
        }

        const client = await prisma.client.findUnique({
            where: { id: Number(clientId) },
        });

        if (!client) {
            return NextResponse.json(
                { success: false, message: "Client not found" },
                { status: 404 }
            );
        }

        let decodedFile = undefined;
        if (invoiceFile && invoiceFile.base64) {
            const base64Data = invoiceFile.base64.split(";base64,").pop();
            if (base64Data) {
                decodedFile = {
                    name: invoiceFile.name || "invoice.pdf",
                    content: Buffer.from(base64Data, "base64")
                };
            }
        }

        const result = await sendPaymentDueEmail({
            to: client.email,
            clientName: client.clientName,
            companyName: client.companyName,
            amount,
            dueDate,
            invoiceFile: decodedFile,
        });

        if (result.success) {
            return NextResponse.json({
                success: true,
                message: "Payment due notification sent successfully",
            });
        } else {
            return NextResponse.json(
                { success: false, message: "Failed to send email" },
                { status: 500 }
            );
        }
    } catch (error) {
        console.error("Admin Payment API Error:", error);
        return NextResponse.json(
            { success: false, message: "Internal server error" },
            { status: 500 }
        );
    }
}
