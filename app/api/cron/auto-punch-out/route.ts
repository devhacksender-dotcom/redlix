import { NextRequest, NextResponse } from "next/server";
import { autoPunchOutStaleSessions } from "@/lib/attendanceHelper";

export async function GET(request: NextRequest) {
    try {
        // Optional: You can secure this route by checking a CRON_SECRET header if needed:
        // const authHeader = request.headers.get('authorization');
        // if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        //     return new NextResponse('Unauthorized', { status: 401 });
        // }
        
        await autoPunchOutStaleSessions();
        
        return NextResponse.json({ 
            success: true, 
            message: "Auto punch-out job executed successfully." 
        });
    } catch (error) {
        console.error("Cron Auto Punch-Out Error:", error);
        return NextResponse.json(
            { success: false, message: "Internal server error" },
            { status: 500 }
        );
    }
}
