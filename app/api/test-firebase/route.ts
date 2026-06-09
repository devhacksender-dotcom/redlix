import { NextResponse } from "next/server";
import { adminApp } from "@/lib/firebase-admin";

export async function GET() {
  try {
    return NextResponse.json({
      project: adminApp.options.projectId,
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message || error,
    });
  }
}
