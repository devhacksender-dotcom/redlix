import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const subscribers = await prisma.fcmToken.findMany({
      include: {
        employee: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      success: true,
      count: subscribers.length,
      subscribers,
    });
  } catch (error: any) {
    console.error("Error querying FCM subscribers:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to load FCM subscribers count",
        error: error.message || error,
      },
      { status: 500 }
    );
  }
}
