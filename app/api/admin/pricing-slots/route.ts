import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
    try {
        const setting = await prisma.systemSetting.findUnique({
            where: { key: "pricing_slots" }
        });

        let data = { status: "available", slots: 3 };
        if (setting) {
            try {
                data = JSON.parse(setting.value);
            } catch (e) {
                console.error("Failed to parse settings JSON:", e);
            }
        }

        return NextResponse.json({ success: true, data });
    } catch (error) {
        console.error("Admin get pricing slots error:", error);
        return NextResponse.json({ success: false, message: "Failed to retrieve slot configuration" }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { status, slots, currentMonth, nextMonth } = body;

        if (!status || typeof slots !== "number") {
            return NextResponse.json({ success: false, message: "Invalid payload parameters" }, { status: 400 });
        }

        const valueString = JSON.stringify({
            status,
            slots,
            currentMonth: currentMonth || "",
            nextMonth: nextMonth || ""
        });

        const setting = await prisma.systemSetting.upsert({
            where: { key: "pricing_slots" },
            update: { value: valueString },
            create: { key: "pricing_slots", value: valueString }
        });

        return NextResponse.json({ success: true, data: { status, slots, currentMonth, nextMonth } });
    } catch (error) {
        console.error("Admin save pricing slots error:", error);
        return NextResponse.json({ success: false, message: "Failed to save slot configuration" }, { status: 500 });
    }
}
