import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import {
    sendDashboardAccessPendingAlert,
    sendProfilePendingAlert,
    sendTermsUpdateAlert,
    sendClientInfoUpdateAlert,
    sendNewClientWelcomeAlert,
    sendCustomAlert,
} from "@/utils/email";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { alertType, customMessage, customSubject, customBody, senderLabel, effectiveDate } = body;

        if (!alertType) {
            return NextResponse.json({ success: false, message: "alertType is required" }, { status: 400 });
        }

        let results: { email: string; success: boolean; error?: string }[] = [];

        // ─── Dashboard Access Pending ──────────────────────────────────────────
        if (alertType === "dashboard_access_pending") {
            const { employeeIds } = body;
            if (!employeeIds || !Array.isArray(employeeIds) || employeeIds.length === 0) {
                return NextResponse.json({ success: false, message: "employeeIds required" }, { status: 400 });
            }
            const employees = await prisma.employee.findMany({
                where: { id: { in: employeeIds.map(Number) } },
            });
            for (const emp of employees) {
                const res = await sendDashboardAccessPendingAlert({ to: emp.email, name: emp.name, customMessage });
                results.push({ email: emp.email, success: res.success });
            }
        }

        // ─── Profile Pending ───────────────────────────────────────────────────
        else if (alertType === "profile_pending") {
            const { employeeIds, missingFields } = body;
            if (!employeeIds || !Array.isArray(employeeIds) || employeeIds.length === 0) {
                return NextResponse.json({ success: false, message: "employeeIds required" }, { status: 400 });
            }
            const employees = await prisma.employee.findMany({
                where: { id: { in: employeeIds.map(Number) } },
            });
            for (const emp of employees) {
                const res = await sendProfilePendingAlert({ to: emp.email, name: emp.name, missingFields, customMessage });
                results.push({ email: emp.email, success: res.success });
            }
        }

        // ─── Terms & Conditions Update ─────────────────────────────────────────
        else if (alertType === "terms_update") {
            const { clientIds } = body;
            let clients;
            if (clientIds && Array.isArray(clientIds) && clientIds.length > 0) {
                clients = await prisma.client.findMany({ where: { id: { in: clientIds.map(Number) } } });
            } else {
                clients = await prisma.client.findMany();
            }
            for (const client of clients) {
                const res = await sendTermsUpdateAlert({
                    to: client.email,
                    clientName: client.clientName,
                    companyName: client.companyName,
                    effectiveDate,
                    customMessage,
                });
                results.push({ email: client.email, success: res.success });
            }
        }

        // ─── Client Info Update ────────────────────────────────────────────────
        else if (alertType === "client_info_update") {
            const { clientId, fieldsToUpdate } = body;
            if (!clientId) {
                return NextResponse.json({ success: false, message: "clientId required" }, { status: 400 });
            }
            const client = await prisma.client.findUnique({ where: { id: Number(clientId) } });
            if (!client) {
                return NextResponse.json({ success: false, message: "Client not found" }, { status: 404 });
            }
            const res = await sendClientInfoUpdateAlert({
                to: client.email,
                clientName: client.clientName,
                companyName: client.companyName,
                fieldsToUpdate,
                customMessage,
            });
            results.push({ email: client.email, success: res.success });
        }

        // ─── New Client Welcome ────────────────────────────────────────────────
        else if (alertType === "new_client_welcome") {
            const { clientId } = body;
            if (!clientId) {
                return NextResponse.json({ success: false, message: "clientId required" }, { status: 400 });
            }
            const client = await prisma.client.findUnique({ where: { id: Number(clientId) } });
            if (!client) {
                return NextResponse.json({ success: false, message: "Client not found" }, { status: 404 });
            }
            const res = await sendNewClientWelcomeAlert({
                to: client.email,
                clientName: client.clientName,
                companyName: client.companyName,
                appName: client.appName ?? undefined,
                developerName: client.developerName ?? undefined,
                customMessage,
            });
            results.push({ email: client.email, success: res.success });
        }

        // ─── Custom Alert ──────────────────────────────────────────────────────
        else if (alertType === "custom") {
            const { recipients } = body; // array of email strings
            if (!recipients || !Array.isArray(recipients) || recipients.length === 0) {
                return NextResponse.json({ success: false, message: "recipients required for custom alert" }, { status: 400 });
            }
            if (!customSubject) {
                return NextResponse.json({ success: false, message: "customSubject required for custom alert" }, { status: 400 });
            }
            if (!customBody) {
                return NextResponse.json({ success: false, message: "customBody required for custom alert" }, { status: 400 });
            }
            for (const email of recipients) {
                const res = await sendCustomAlert({
                    to: email,
                    subject: customSubject,
                    messageBody: customBody,
                    senderLabel,
                });
                results.push({ email, success: res.success });
            }
        }

        else {
            return NextResponse.json({ success: false, message: `Unknown alertType: ${alertType}` }, { status: 400 });
        }

        const allSucceeded = results.every(r => r.success);
        const anySucceeded = results.some(r => r.success);

        return NextResponse.json({
            success: anySucceeded,
            message: allSucceeded
                ? `Alert sent to ${results.length} recipient(s) successfully`
                : `Sent to ${results.filter(r => r.success).length} of ${results.length} recipients`,
            results,
        });

    } catch (error) {
        console.error("Alert API Error:", error);
        return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
    }
}
