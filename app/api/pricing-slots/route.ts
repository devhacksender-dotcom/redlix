import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
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
        } else {
            // Seed if not exists in DB
            try {
                await prisma.systemSetting.create({
                    data: {
                        key: "pricing_slots",
                        value: JSON.stringify(data)
                    }
                });
            } catch (createError) {
                console.error("Error seeding default pricing slots setting:", createError);
            }
        }

        return NextResponse.json({ success: true, data });
    } catch (error) {
        console.error("Get pricing slots error:", error);
        // Fallback to default in case of table/DB issues to ensure resilience
        return NextResponse.json({ success: true, data: { status: "available", slots: 3 } });
    }
}
