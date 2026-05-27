import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import prisma from "@/lib/prisma";

export async function PATCH(request: NextRequest) {
    try {
        const token = request.cookies.get("employee_token")?.value;

        if (!token) {
            return NextResponse.json(
                { success: false, message: "Not authenticated" },
                { status: 401 }
            );
        }

        const secret = new TextEncoder().encode(process.env.JWT_SECRET || "default_secret");
        let employeeId: number;

        try {
            const { payload } = await jwtVerify(token, secret);
            employeeId = payload.employeeId as number;
        } catch (err) {
            return NextResponse.json(
                { success: false, message: "Invalid session token" },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { name, email, phone, upiId, fatherName, mobile, altEmail, address } = body;

        // Validation
        if (!name || !email) {
            return NextResponse.json(
                { success: false, message: "Name and Email are required fields" },
                { status: 400 }
            );
        }

        // Email uniqueness check
        const existing = await prisma.employee.findUnique({
            where: { email: email.toLowerCase() },
        });

        if (existing && existing.id !== employeeId) {
            return NextResponse.json(
                { success: false, message: "This email address is already registered to another employee" },
                { status: 400 }
            );
        }

        // Update employee details
        const updatedEmployee = await prisma.employee.update({
            where: { id: employeeId },
            data: {
                name,
                email: email.toLowerCase(),
                phone: phone !== undefined ? phone : null,
                upiId: upiId !== undefined ? upiId : null,
                fatherName: fatherName !== undefined ? fatherName : null,
                mobile: mobile !== undefined ? mobile : null,
                altEmail: altEmail !== undefined ? altEmail : null,
                address: address !== undefined ? address : null,
            },
        });

        return NextResponse.json({
            success: true,
            message: "Profile settings updated successfully",
            data: {
                id: updatedEmployee.id,
                name: updatedEmployee.name,
                email: updatedEmployee.email,
                role: updatedEmployee.role,
                phone: updatedEmployee.phone,
                upiId: updatedEmployee.upiId,
                fatherName: updatedEmployee.fatherName,
                mobile: updatedEmployee.mobile,
                altEmail: updatedEmployee.altEmail,
                address: updatedEmployee.address,
            }
        });
    } catch (error) {
        console.error("Employee Settings Update Error:", error);
        return NextResponse.json(
            { success: false, message: "Internal server error" },
            { status: 500 }
        );
    }
}
