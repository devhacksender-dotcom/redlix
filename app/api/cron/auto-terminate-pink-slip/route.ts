import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sendPinkSlipTerminationEmail } from "@/utils/email";

export async function GET(req: Request) {
    try {
        // Security: verify this is a cron call from Vercel
        const authHeader = req.headers.get("authorization");
        if (process.env.NODE_ENV === "production" && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const now = new Date();

        // Find all employees whose pink slip deadline has passed and haven't submitted an appeal
        // Deadline = pinkSlipAllocatedAt + 32 hours
        // We target: pinkSlipAllocatedAt is set, pinkSlipRevoked is false, pinkSlipRequest is null
        // AND (now - pinkSlipAllocatedAt) >= 32 hours
        const deadline32h = new Date(now.getTime() - 32 * 60 * 60 * 1000);

        const expiredEmployees = await prisma.employee.findMany({
            where: {
                pinkSlipAllocatedAt: {
                    not: null,
                    lte: deadline32h,  // allocated more than 32 hours ago
                },
                pinkSlipRevoked: false,
                pinkSlipRequest: null,  // no appeal submitted
            },
        });

        console.log(`[auto-terminate-pink-slip] Found ${expiredEmployees.length} employee(s) to terminate.`);

        const results: { name: string; email: string; status: string }[] = [];

        for (const emp of expiredEmployees) {
            try {
                // Send termination email BEFORE deleting (we need their email)
                await sendPinkSlipTerminationEmail({
                    to: emp.email,
                    name: emp.name,
                    role: emp.role,
                    terminatedAt: now,
                });

                // Delete the employee — cascade will remove all related data
                await prisma.employee.delete({ where: { id: emp.id } });

                results.push({ name: emp.name, email: emp.email, status: "terminated" });
                console.log(`[auto-terminate-pink-slip] Terminated employee: ${emp.name} (${emp.email})`);
            } catch (err) {
                console.error(`[auto-terminate-pink-slip] Failed to terminate ${emp.email}:`, err);
                results.push({ name: emp.name, email: emp.email, status: "error" });
            }
        }

        return NextResponse.json({
            success: true,
            processed: results.length,
            results,
            timestamp: now.toISOString(),
        });
    } catch (error) {
        console.error("[auto-terminate-pink-slip] Cron error:", error);
        return NextResponse.json({ success: false, error: "Cron failed" }, { status: 500 });
    }
}
