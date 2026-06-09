import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { token, employeeId } = await req.json();

    if (!token) {
      return NextResponse.json(
        { success: false, message: "FCM registration token is required" },
        { status: 400 }
      );
    }

    const data: any = {
      token,
    };

    if (employeeId) {
      data.employeeId = Number(employeeId);
    }

    // Upsert token in the database to prevent duplicate entries
    const fcmToken = await prisma.fcmToken.upsert({
      where: { token },
      update: data,
      create: data,
    });

    return NextResponse.json({
      success: true,
      message: "FCM Token registered successfully",
      data: fcmToken,
    });
  } catch (error: any) {
    console.error("Error registering FCM token:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to register FCM token",
        error: error.message || error,
      },
      { status: 500 }
    );
  }
}
