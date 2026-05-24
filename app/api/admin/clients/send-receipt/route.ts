import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sendPaymentReceivedEmail } from "@/utils/email";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { clientId, amount, paymentDate, transactionId, receiptFile } = body;

        if (!clientId || !amount || !paymentDate) {
            return NextResponse.json(
                { success: false, message: "Missing required fields: clientId, amount, or paymentDate" },
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
        if (receiptFile && receiptFile.base64) {
            const base64Data = receiptFile.base64.split(";base64,").pop();
            if (base64Data) {
                decodedFile = {
                    name: receiptFile.name || "receipt.pdf",
                    content: Buffer.from(base64Data, "base64")
                };
            }
        }

        const result = await sendPaymentReceivedEmail({
            to: client.email,
            clientName: client.clientName,
            companyName: client.companyName,
            amount,
            paymentDate,
            transactionId: transactionId || undefined,
            receiptFile: decodedFile,
        });

        if (result.success) {
            return NextResponse.json({
                success: true,
                message: "Payment confirmation notification sent successfully",
            });
        } else {
            return NextResponse.json(
                { success: false, message: "Failed to send email" },
                { status: 500 }
            );
        }
    } catch (error) {
        console.error("Admin Payment Confirmation API Error:", error);
        return NextResponse.json(
            { success: false, message: "Internal server error" },
            { status: 500 }
        );
    }
}
