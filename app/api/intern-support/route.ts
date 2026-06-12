import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD,
  },
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, batchNumber, college, email, problemPage, description } = body;

    if (!name || !batchNumber || !college || !email || !problemPage || !description) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const ticket = await prisma.internSupport.create({
      data: {
        name,
        batchNumber,
        college,
        email,
        problemPage,
        description,
      },
    });

    // Send confirmation email
    try {
      await transporter.sendMail({
        from: `"Redlix Studio" <${process.env.SMTP_EMAIL}>`,
        to: email,
        subject: 'Support ticket received',
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #1a1a1a; padding: 20px; border: 1px solid #eee;">
            <div style="margin-bottom: 30px;">
              <img src="https://ik.imagekit.io/dypkhqxip/logo__1_" alt="Logo" style="height: 52px; width: auto; vertical-align: middle;" />
              <span style="display: inline-block; width: 1px; height: 32px; background: #eee; margin: 0 15px; vertical-align: middle;"></span>
              <img src="https://ik.imagekit.io/dypkhqxip/redlix%20new?updatedAt=1781042212493" alt="Redlix Studio" style="height: 38px; width: auto; vertical-align: middle;" />
            </div>
            
            <h2 style="font-weight: 600; font-size: 18px; margin-bottom: 15px; color: #000;">Hello ${name},</h2>
            
            <p style="font-size: 15px; line-height: 1.6; color: #444;">
              Your support ticket has been received. We will contact you soon to help with the issue you reported on the ${problemPage} page.
            </p>
            
            <p style="font-size: 15px; line-height: 1.6; color: #444; margin-top: 20px;">
              Thank you for your patience.
            </p>
            
            <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee;">
              <div style="background: #E61E32; padding: 25px 20px; color: #ffffff; font-size: 12px; text-align: center;">
                <p style="margin: 0 0 15px 0; font-weight: 500;">Intern support unit • Redlix Studio</p>
                <div style="margin-bottom: 15px;">
                  <a href="https://redlix.co.in/privacy" style="color: #ffffff; text-decoration: none; display: inline-block; padding: 0 8px;">Privacy</a>
                  <a href="https://redlix.co.in/cookies" style="color: #ffffff; text-decoration: none; display: inline-block; padding: 0 8px;">Cookies</a>
                  <a href="https://redlix.co.in/terms" style="color: #ffffff; text-decoration: none; display: inline-block; padding: 0 8px;">Terms</a>
                  <a href="https://redlix.co.in/support" style="color: #ffffff; text-decoration: none; display: inline-block; padding: 0 8px;">Support</a>
                </div>
                <p style="margin: 15px 0 0 0; color: rgba(255, 255, 255, 0.6); font-size: 10px;">© 2026 Redlix Studio. all rights reserved.</p>
              </div>
            </div>
          </div>
        `,
      });
    } catch (emailError) {
      console.error('Failed to send confirmation email:', emailError);
    }

    return NextResponse.json({ message: 'Ticket created successfully', ticket }, { status: 201 });
  } catch (error) {
    console.error('Error creating support ticket:', error);
    return NextResponse.json({ error: 'Failed to create support ticket' }, { status: 500 });
  }
}
