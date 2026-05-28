import prisma from "@/lib/prisma";

export function getPunchOutTimeForDate(punchInDate: Date): Date {
    // 19:30:00.000 IST on the calendar day of punchInDate.
    // IST is UTC + 5:30.
    // Let's get the year, month, and date of the punchInDate in IST timezone.
    const formatter = new Intl.DateTimeFormat("en-US", {
        timeZone: "Asia/Kolkata",
        year: "numeric",
        month: "numeric",
        day: "numeric",
    });
    
    const parts = formatter.formatToParts(punchInDate);
    const year = parseInt(parts.find(p => p.type === "year")!.value, 10);
    const month = parseInt(parts.find(p => p.type === "month")!.value, 10) - 1; // Month is 0-indexed in JS Date
    const day = parseInt(parts.find(p => p.type === "day")!.value, 10);
    
    // Construct 7:30 PM (19:30) of that day in Asia/Kolkata timezone.
    // 19:30 IST is exactly 14:00:00 UTC on the same calendar day.
    let autoPunchOutUTC = new Date(Date.UTC(year, month, day, 14, 0, 0, 0));
    
    // If the punch-in time is already past 7:30 PM IST of that day,
    // the auto punch-out time is 7:30 PM IST of the next calendar day.
    if (punchInDate.getTime() >= autoPunchOutUTC.getTime()) {
        autoPunchOutUTC = new Date(autoPunchOutUTC.getTime() + 24 * 60 * 60 * 1000);
    }
    
    return autoPunchOutUTC;
}

export async function autoPunchOutStaleSessions() {
    try {
        const now = new Date();
        
        // Find all sessions where punchOut is null
        const activeSessions = await prisma.attendance.findMany({
            where: {
                punchOut: null
            }
        });
        
        for (const session of activeSessions) {
            const punchInTime = new Date(session.punchIn);
            const scheduledPunchOut = getPunchOutTimeForDate(punchInTime);
            
            // If current time is past the scheduled punch out time, auto-punch out
            if (now.getTime() >= scheduledPunchOut.getTime()) {
                const elapsedMs = scheduledPunchOut.getTime() - punchInTime.getTime();
                const workMinutes = Math.max(1, Math.round(elapsedMs / 1000 / 60));
                
                await prisma.attendance.update({
                    where: { id: session.id },
                    data: {
                        punchOut: scheduledPunchOut,
                        workMinutes
                    }
                });
                console.log(`[Auto Punch-Out] Session ID ${session.id} for employee ID ${session.employeeId} closed at 7:30 PM IST (${scheduledPunchOut.toISOString()})`);
            }
        }
    } catch (error) {
        console.error("Auto Punch-Out Error:", error);
    }
}
