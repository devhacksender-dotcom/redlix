import { NextRequest, NextResponse } from "next/server";
import { adminMessaging } from "@/lib/firebase-admin";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
    try {
        // Get date range for "today" in Asia/Kolkata timezone
        const now = new Date();
        const formatter = new Intl.DateTimeFormat("en-US", {
            timeZone: "Asia/Kolkata",
            year: "numeric",
            month: "numeric",
            day: "numeric",
        });
        const parts = formatter.formatToParts(now);
        const year = parseInt(parts.find(p => p.type === "year")!.value, 10);
        const month = parseInt(parts.find(p => p.type === "month")!.value, 10) - 1;
        const day = parseInt(parts.find(p => p.type === "day")!.value, 10);

        // 00:00:00 IST is UTC-5:30 -> UTC of previous day 18:30:00
        const startOfTodayIST = new Date(Date.UTC(year, month, day, 0, 0, 0, 0) - 5.5 * 60 * 60 * 1000);
        const endOfTodayIST = new Date(startOfTodayIST.getTime() + 24 * 60 * 60 * 1000 - 1);

        // 1. Get all employees who are not department admins
        const employees = await prisma.employee.findMany({
            where: {
                isDeptAdmin: false,
            },
            select: {
                id: true,
                name: true,
                fcmTokens: {
                    select: {
                        token: true,
                    },
                },
            },
        });

        // 2. Get all punch-ins for today
        const punchInsToday = await prisma.attendance.findMany({
            where: {
                punchIn: {
                    gte: startOfTodayIST,
                    lte: endOfTodayIST,
                },
            },
            select: {
                employeeId: true,
            },
        });
        const punchedInIds = new Set(punchInsToday.map(a => a.employeeId));

        // 3. Get all approved leaves for today
        const approvedLeavesToday = await prisma.leaveRequest.findMany({
            where: {
                status: "approved",
                startDate: {
                    lte: endOfTodayIST,
                },
                endDate: {
                    gte: startOfTodayIST,
                },
            },
            select: {
                employeeId: true,
            },
        });
        const leaveIds = new Set(approvedLeavesToday.map(l => l.employeeId));

        // 4. Construct messages for employees who haven't punched in and are not on leave
        const messages: any[] = [];
        const targetedEmployees: string[] = [];

        for (const emp of employees) {
            if (punchedInIds.has(emp.id) || leaveIds.has(emp.id)) {
                continue;
            }

            if (emp.fcmTokens.length > 0) {
                targetedEmployees.push(emp.name);
                for (const fcm of emp.fcmTokens) {
                    messages.push({
                        token: fcm.token,
                        notification: {
                            title: "Attendance Notice",
                            body: "You were absent today",
                        },
                        webpush: {
                            notification: {
                                title: "Attendance Notice",
                                body: "You were absent today",
                                icon: "/icons/icon-192.png",
                                badge: "/icons/icon-192.png",
                                clickAction: "/employee",
                            },
                            fcmOptions: {
                                link: "/employee",
                            },
                        },
                    });
                }
            }
        }

        let sendResponse = null;
        if (messages.length > 0) {
            sendResponse = await adminMessaging.sendEach(messages);
        }

        return NextResponse.json({
            success: true,
            message: "Attendance absence cron job completed.",
            targetedEmployees,
            notificationCount: messages.length,
            sendResponse,
        });
    } catch (error: any) {
        console.error("Attendance absence cron error:", error);
        return NextResponse.json(
            { success: false, error: error.message || error },
            { status: 500 }
        );
    }
}
