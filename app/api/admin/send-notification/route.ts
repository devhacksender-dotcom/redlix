import { NextResponse } from "next/server";
import { adminMessaging } from "@/lib/firebase-admin";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { title, body: msgBody } = body;

    // Retrieve all active registered tokens
    const registeredTokens = await prisma.fcmToken.findMany({
      select: { token: true },
    });

    if (registeredTokens.length === 0) {
      return NextResponse.json(
        { success: false, message: "No devices registered to receive push notifications." },
        { status: 404 }
      );
    }

    const messages = registeredTokens.map((t) => ({
      token: t.token,
      notification: {
        title: title || "Redlix EMS",
        body: msgBody || "Welcome to Redlix EMS",
      },
    }));

    // Broadcast messages to all tokens
    const response = await adminMessaging.sendEach(messages);

    return NextResponse.json({
      success: true,
      message: `Notification broadcasted successfully to ${registeredTokens.length} device(s).`,
      successCount: response.successCount,
      failureCount: response.failureCount,
    });
  } catch (error: any) {
    console.error("Firebase Admin Send Notification Error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to send notifications",
        error: error.message || error,
      },
      { status: 500 }
    );
  }
}
