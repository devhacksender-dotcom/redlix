import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    const response = NextResponse.json({
        success: true,
        message: "Logged out successfully",
    });

    response.cookies.delete("dept_token");
    return response;
}

export async function GET(request: NextRequest) {
    const response = NextResponse.json({
        success: true,
        message: "Logged out successfully",
    });

    response.cookies.delete("dept_token");
    return response;
}
