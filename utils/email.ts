import nodemailer from "nodemailer";

const transporter = {
    sendMail: (mailOptions: nodemailer.SendMailOptions) => {
        return nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.SMTP_EMAIL,
                pass: process.env.SMTP_PASSWORD,
            },
        }).sendMail(mailOptions);
    }
};

interface SendAutoReplyParams {
    to: string;
    name: string;
}

export async function sendAutoReply({ to, name }: SendAutoReplyParams) {
    const mailOptions = {
        from: `"Redlix Studio" <${process.env.SMTP_EMAIL}>`,
        to,
        subject: "Thank you for reaching out to Redlix Studio",
        html: `
            <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px; border: 1px solid #ddd; background-color: #ffffff; color: #333;">
                <div style="margin-bottom: 40px; text-align: left;">
                    <img src="https://res.cloudinary.com/dsqqrpzfl/image/upload/v1776288139/Screenshot_2026-04-16_at_02.51.43-removebg-preview_ytpg09.png" alt="Redlix Studio Logo" style="height: 50px; width: auto;" />
                </div>
                
                <h2 style="color: #E61E32; font-size: 18px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 24px; border-left: 4px solid #E61E32; padding-left: 16px;">
                    Thanks for reaching out
                </h2>
                
                <p style="font-size: 15px; line-height: 1.6; margin-bottom: 20px;">
                    Hello <strong>${name}</strong>,
                </p>
                
                <p style="font-size: 15px; line-height: 1.6; margin-bottom: 20px;">
                    Thank you for contacting <strong>Redlix Studio</strong>. We have received your details and our team is looking at your request right now.
                </p>
                
                <p style="font-size: 15px; line-height: 1.6; margin-bottom: 20px;">
                    We build high-quality software and IT systems for businesses. Someone from our team will contact you very soon to talk about your project.
                </p>
                
                <div style="margin-top: 40px; padding-top: 30px; border-top: 1px solid #eee;">
                    <p style="margin: 0; font-weight: 700; color: #E61E32; text-transform: uppercase; font-size: 11px; letter-spacing: 0.2em;">Best Regards,</p>
                    <p style="margin: 5px 0 0 0; font-size: 18px; font-weight: 900; letter-spacing: -0.03em; text-transform: uppercase; color: #1a1a1a;">The Redlix Team</p>
                </div>
                
                <div style="margin-top: 50px; font-size: 10px; color: #999; text-transform: uppercase; letter-spacing: 0.1em; line-height: 1.8;">
                    <p style="margin: 0;">© 2026 Redlix Studio | Software & IT Solutions</p>
                    <p style="margin: 0;">This is an automated message. Please do not reply.</p>
                </div>
            </div>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Auto-reply sent to ${to}`);
    } catch (error) {
        console.error("Error sending auto-reply email:", error);
        // We don't throw here because we don't want to fail the whole request if email fails
    }
}

interface SendOfferLetterParams {
    to: string;
    name: string;
    role: string;
    offerLetterLink: string;
}

export async function sendOfferLetter({ to, name, role, offerLetterLink }: SendOfferLetterParams) {
    const mailOptions = {
        from: `"Redlix HR" <${process.env.SMTP_EMAIL}>`,
        to,
        subject: `Job Offer: ${role} | Redlix Studio`,
        html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333; line-height: 1.5;">
                <div style="margin-bottom: 30px;">
                    <img src="https://res.cloudinary.com/dsqqrpzfl/image/upload/v1776288139/Screenshot_2026-04-16_at_02.51.43-removebg-preview_ytpg09.png" alt="Redlix Studio" style="height: 40px;" />
                </div>
                
                <p>Hello ${name},</p>
                
                <p>We are happy to offer you the position of <strong>${role}</strong> at Redlix Studio. We enjoyed meeting you and think you would be a great fit for our team.</p>
                
                <p>You can view and accept your offer letter by clicking the link below:</p>
                
                <p style="margin: 30px 0;">
                    <a href="${offerLetterLink}" style="background-color: #E61E32; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">
                        View offer letter
                    </a>
                </p>
                
                <p>If you have any questions, please feel free to reach out. We look forward to hearing from you.</p>
                
                <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee;">
                    <p style="margin: 0; font-weight: bold;">The Redlix Team</p>
                    <p style="margin: 5px 0 0 0; font-size: 12px; color: #666;">Redlix Studio | Software & IT Solutions</p>
                </div>
            </div>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Offer letter sent to ${to}`);
        return { success: true };
    } catch (error) {
        console.error("Error sending offer letter email:", error);
        return { success: false, error };
    }
}

interface SendSupportConfirmationParams {
    to: string;
    name: string;
    ticketId: number;
    subject: string;
}

export async function sendSupportConfirmation({ to, name, ticketId, subject }: SendSupportConfirmationParams) {
    const mailOptions = {
        from: `"Redlix Support" <${process.env.SMTP_EMAIL}>`,
        to,
        subject: `Support Ticket Received - #${ticketId}`,
        html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333; line-height: 1.5;">
                <div style="margin-bottom: 30px;">
                    <img src="https://res.cloudinary.com/dsqqrpzfl/image/upload/v1776288139/Screenshot_2026-04-16_at_02.51.43-removebg-preview_ytpg09.png" alt="Redlix Studio" style="height: 40px;" />
                </div>
                
                <p>Hello ${name},</p>
                
                <p>We have received your support request regarding <strong>"${subject}"</strong>. Our team has assigned ticket ID <strong>#${ticketId}</strong> to your case.</p>
                
                <p>We are currently looking into your issue and will get back to you as soon as possible.</p>
                
                <p>If you have any more details to share, please reply to this email.</p>
                
                <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee;">
                    <p style="margin: 0; font-weight: bold;">Redlix Support Team</p>
                    <p style="margin: 5px 0 0 0; font-size: 12px; color: #666;">This is an automated confirmation. We will reach out to you shortly.</p>
                </div>
            </div>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Support confirmation sent to ${to}`);
        return { success: true };
    } catch (error) {
        console.error("Error sending support confirmation email:", error);
        return { success: false, error };
    }
}

interface SendMeetingConfirmationParams {
    to: string;
    clientName: string;
    companyName: string;
    appName?: string;
    phone?: string;
    template: string;
    meetingTime: string;
    developerName?: string;
    meetingLink?: string;
}

export async function sendMeetingConfirmation({ to, clientName, companyName, appName, phone, template, meetingTime, developerName, meetingLink }: SendMeetingConfirmationParams) {

    const templateDetails: Record<string, string> = {
        "Discovery Call": "This is an introductory call to discuss your project requirements, goals, and how Redlix Studio can help you achieve them.",
        "Project Onboarding": "Welcome to Redlix! This meeting will cover the initial steps of our collaboration, project timelines, and communication channels.",
        "Weekly Sync": "Our regular check-in to review progress, address roadblocks, and ensure the project is moving according to plan.",
        "Final Delivery": "The concluding session to walk through the final product, handle handovers, and discuss support/maintenance.",
        "Developer Meet": `This technical session will be led by our developer, ${developerName || "one of our lead engineers"}, to discuss technical specifications, architecture, and code-level details.`
    };

    const details = templateDetails[template] || "A meeting has been scheduled to discuss your project with Redlix Studio.";
    const finalMeetingLink = meetingLink || "";

    const mailOptions = {
        from: `"Redlix Client Support" <${process.env.SMTP_EMAIL}>`,
        to,
        subject: `Meeting Scheduled: ${template} | Redlix Studio & ${companyName}`,
        html: `
            <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 650px; margin: 0 auto; border: 1px solid #e0e0e0; background-color: #ffffff; color: #1a1a1a;">
                <!-- Header -->
                <div style="background-color: #ffffff; padding: 20px 40px; text-align: left; border-bottom: 1px solid #eee;">
                    <img src="https://res.cloudinary.com/dsqqrpzfl/image/upload/v1776288139/Screenshot_2026-04-16_at_02.51.43-removebg-preview_ytpg09.png" alt="Redlix Studio" style="height: 35px;" />
                </div>
                
                <div style="padding: 40px;">
                    <h1 style="color: #0a0a0a; font-size: 22px; font-weight: 700; letter-spacing: -0.01em; margin: 0 0 10px 0;">
                        Meeting Scheduled
                    </h1>
                    <div style="width: 40px; height: 2px; background-color: #E61E32; margin-bottom: 30px;"></div>
                    
                    <p style="font-size: 16px; line-height: 1.6; margin-bottom: 25px;">
                        Hello <strong>${clientName}</strong>,
                    </p>
                    
                    <p style="font-size: 15px; line-height: 1.6; color: #444; margin-bottom: 35px;">
                        We have successfully registered your project and scheduled a <strong>${template}</strong>. Below are the complete details for your upcoming session and project record.
                    </p>

                    <!-- Client & Project Details -->
                    <h3 style="font-size: 12px; font-weight: 700; color: #E61E32; margin-bottom: 15px;">Project information</h3>
                    <div style="background-color: #f8f8f8; padding: 25px; margin-bottom: 30px; border: 1px solid #eee;">
                        <table style="width: 100%; border-collapse: collapse;">
                            <tr>
                                <td style="padding: 8px 0; font-size: 13px; color: #888; width: 140px;">Company</td>
                                <td style="padding: 8px 0; font-size: 14px; font-weight: 600; color: #1a1a1a;">${companyName}</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 0; font-size: 13px; color: #888;">App/Website</td>
                                <td style="padding: 8px 0; font-size: 14px; font-weight: 600; color: #1a1a1a;">${appName || "Web Project"}</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 0; font-size: 13px; color: #888;">Contact</td>
                                <td style="padding: 8px 0; font-size: 14px; color: #1a1a1a;">${clientName} (${phone || 'N/A'})</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 0; font-size: 13px; color: #888;">Email</td>
                                <td style="padding: 8px 0; font-size: 14px; color: #1a1a1a;">${to}</td>
                            </tr>
                        </table>
                    </div>

                    <!-- Meeting Details -->
                    <h3 style="font-size: 12px; font-weight: 700; color: #E61E32; margin-bottom: 15px;">Meeting schedule</h3>
                    <div style="background-color: #0a0a0a; padding: 30px; color: #ffffff; margin-bottom: 40px;">
                        <p style="margin: 0 0 8px 0; font-size: 12px; color: #E61E32; font-weight: 700;">Type</p>
                        <p style="margin: 0 0 20px 0; font-size: 16px; font-weight: 600;">${template}</p>
                        
                        <p style="margin: 0 0 8px 0; font-size: 12px; color: #E61E32; font-weight: 700;">Date & time</p>
                        <p style="margin: 0 0 20px 0; font-size: 16px; font-weight: 600;">${new Date(meetingTime).toLocaleString()}</p>
                        
                        ${developerName ? `
                            <p style="margin: 0 0 8px 0; font-size: 12px; color: #E61E32; font-weight: 700;">Lead developer</p>
                            <p style="margin: 0 0 20px 0; font-size: 16px; font-weight: 600;">${developerName}</p>
                        ` : ''}

                        <p style="margin: 0 0 25px 0; font-size: 14px; color: #aaa; line-height: 1.5; border-top: 1px solid #333; padding-top: 20px;">
                            ${details}
                        </p>
                        
                        ${finalMeetingLink ? `
                            <a href="${finalMeetingLink}" style="display: inline-block; background-color: #E61E32; color: white; padding: 14px 28px; text-decoration: none; border-radius: 2px; font-weight: 700; font-size: 13px; letter-spacing: 0.05em;">
                                Join conference room
                            </a>
                        ` : `
                            <p style="font-size: 12px; color: #E61E32; font-style: italic;">The conference link will be shared shortly before the session.</p>
                        `}
                    </div>
                    
                    <p style="font-size: 13px; line-height: 1.6; color: #888; text-align: center; font-style: italic;">
                        Please ensure you have a stable internet connection and access to a microphone for this session.
                    </p>
                </div>

                <!-- Footer -->
                <div style="background-color: #fafafa; padding: 40px; border-top: 1px solid #eee;">
                    <p style="margin: 0; font-weight: 700; color: #E61E32; font-size: 11px; letter-spacing: 0.1em; margin-bottom: 8px;">Support lead</p>
                    <p style="margin: 0; font-size: 18px; font-weight: 700; color: #0a0a0a;">Shiva Krishna Manthena</p>
                    <p style="margin: 2px 0 25px 0; font-size: 12px; color: #666;">Redlix Studio | Support team</p>
                    
                    <div style="font-size: 11px; color: #999; line-height: 1.8;">
                        <p style="margin: 0;">© 2026 Redlix Studio</p>
                        <p style="margin: 0;">Software & IT infrastructure solutions</p>
                        <p style="margin: 5px 0 0 0; color: #E61E32; font-weight: 600;">www.redlix.co.in</p>
                    </div>
                </div>
            </div>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Meeting confirmation sent to ${to}`);
        return { success: true };
    } catch (error) {
        console.error("Error sending meeting confirmation email:", error);
        return { success: false, error };
    }
}

interface SendOnboardingEmailParams {
    to: string;
    name: string;
    role: string;
}

export async function sendOnboardingEmail({ to, name, role }: SendOnboardingEmailParams) {
    const mailOptions = {
        from: `"Redlix HR" <${process.env.SMTP_EMAIL}>`,
        to,
        subject: `Welcome to Redlix Studio | Onboarding Successful`,
        html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; background-color: #ffffff; color: #333;">
                <div style="padding: 20px; border-bottom: 1px solid #eee;">
                    <img src="https://res.cloudinary.com/dsqqrpzfl/image/upload/v1776288139/Screenshot_2026-04-16_at_02.51.43-removebg-preview_ytpg09.png" alt="Redlix Studio" style="height: 30px;" />
                </div>
                
                <div style="padding: 20px;">
                    <h2 style="color: #111; margin-top: 0;">Welcome to the Team!</h2>
                    
                    <p>Hello <strong>${name}</strong>,</p>
                    
                    <p>You have been successfully registered in the Redlix system as a <strong>${role}</strong>. Your account is fully set up, and you will receive your project (Gig) details directly via email as they become available.</p>

                    <h4 style="color: #E61E32; margin-bottom: 10px;">Gig Working Guidelines:</h4>
                    <div style="background-color: #f9f9f9; padding: 15px; border: 1px solid #eee; margin-bottom: 20px;">
                        <ul style="margin: 0; padding-left: 20px; font-size: 14px; line-height: 1.6;">
                            <li><strong>Responsiveness:</strong> Acknowledge incoming Gig emails within 24 hours.</li>
                            <li><strong>Quality Standards:</strong> Consistently adhere to Redlix quality and code guidelines.</li>
                            <li><strong>Confidentiality:</strong> Ensure all client details and project assets remain private.</li>
                            <li><strong>Communication:</strong> Maintain proactive communication with your project lead.</li>
                            <li><strong>Timeliness:</strong> Deliver all assignments on or before the agreed deadline.</li>
                        </ul>
                    </div>

                    <p>We are delighted to welcome you to the team and look forward to collaborating with you!</p>
                </div>

                <div style="background-color: #fafafa; padding: 20px; border-top: 1px solid #eee;">
                    <p style="margin: 0; font-size: 14px;">Best regards,</p>
                    <p style="margin: 5px 0 0 0; font-weight: bold; font-size: 14px;">Shiva Krishna Manthena</p>
                    <p style="margin: 0; font-size: 12px; color: #666;">Support Lead | Redlix Studio</p>
                    
                    <p style="margin: 15px 0 0 0; font-size: 10px; color: #999;">© 2026 Redlix Studio</p>
                </div>
            </div>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Onboarding email sent to ${to}`);
        return { success: true };
    } catch (error) {
        console.error("Error sending onboarding email:", error);
        return { success: false, error };
    }
}

interface SendPaymentDueEmailParams {
    to: string;
    clientName: string;
    companyName: string;
    amount: string;
    dueDate: string;
    invoiceFile?: {
        name: string;
        content: Buffer;
    };
}

export async function sendPaymentDueEmail({ to, clientName, companyName, amount, dueDate, invoiceFile }: SendPaymentDueEmailParams) {
    const attachments = invoiceFile ? [{
        filename: invoiceFile.name,
        content: invoiceFile.content,
        contentType: 'application/pdf'
    }] : [];

    const mailOptions = {
        from: `"Redlix Billing" <${process.env.SMTP_EMAIL}>`,
        to,
        subject: `Payment Pending Notification | Redlix Studio & ${companyName}`,
        attachments,
        html: `
            <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 650px; margin: 0 auto; border: 1px solid #e0e0e0; background-color: #ffffff; color: #1a1a1a;">
                <!-- Header -->
                <div style="background-color: #ffffff; padding: 20px 40px; text-align: left; border-bottom: 1px solid #eee;">
                    <img src="https://res.cloudinary.com/dsqqrpzfl/image/upload/v1776288139/Screenshot_2026-04-16_at_02.51.43-removebg-preview_ytpg09.png" alt="Redlix Studio" style="height: 35px;" />
                </div>
                
                <div style="padding: 40px;">
                    <h1 style="color: #0a0a0a; font-size: 22px; font-weight: 700; letter-spacing: -0.01em; margin: 0 0 10px 0;">
                        Payment Reminder
                    </h1>
                    <div style="width: 40px; height: 2px; background-color: #E61E32; margin-bottom: 30px;"></div>
                    
                    <p style="font-size: 16px; line-height: 1.6; margin-bottom: 25px;">
                        Hello <strong>${clientName}</strong>,
                    </p>
                    
                    <p style="font-size: 15px; line-height: 1.6; color: #444; margin-bottom: 35px;">
                        Your payment due of <strong>${amount}</strong> is pending. Please pay by <strong>${new Date(dueDate).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</strong>.
                    </p>

                    <!-- Payment Information -->
                    <h3 style="font-size: 12px; font-weight: 700; color: #E61E32; margin-bottom: 15px;">Billing Details</h3>
                    <div style="background-color: #f8f8f8; padding: 25px; margin-bottom: 30px; border: 1px solid #eee;">
                        <table style="width: 100%; border-collapse: collapse;">
                            <tr>
                                <td style="padding: 8px 0; font-size: 13px; color: #888; width: 140px;">Company</td>
                                <td style="padding: 8px 0; font-size: 14px; font-weight: 600; color: #1a1a1a;">${companyName}</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 0; font-size: 13px; color: #888;">Billing Contact</td>
                                <td style="padding: 8px 0; font-size: 14px; font-weight: 600; color: #1a1a1a;">${clientName}</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 0; font-size: 13px; color: #888;">Amount Due</td>
                                <td style="padding: 8px 0; font-size: 14px; font-weight: 600; color: #E61E32;">${amount}</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 0; font-size: 13px; color: #888;">Due Date</td>
                                <td style="padding: 8px 0; font-size: 14px; font-weight: 600; color: #1a1a1a;">${new Date(dueDate).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 0; font-size: 13px; color: #888;">Status</td>
                                <td style="padding: 8px 0; font-size: 14px; font-weight: 600; color: #E61E32;">PENDING</td>
                            </tr>
                        </table>
                    </div>

                    ${invoiceFile ? `
                    <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; padding: 15px; margin-bottom: 30px; font-size: 14px; color: #166534;">
                        <strong>Invoice Attached:</strong> The official PDF invoice (${invoiceFile.name}) is attached to this email. Please review the details.
                    </div>
                    ` : ''}
                    
                    <p style="font-size: 13px; line-height: 1.6; color: #888; text-align: center; font-style: italic;">
                        If you have already processed the payment, please disregard this message or share the receipt with us.
                    </p>
                </div>

                <!-- Footer -->
                <div style="background-color: #fafafa; padding: 40px; border-top: 1px solid #eee;">
                    <p style="margin: 0; font-weight: 700; color: #E61E32; font-size: 11px; letter-spacing: 0.1em; margin-bottom: 8px;">Billing lead</p>
                    <p style="margin: 0; font-size: 18px; font-weight: 700; color: #0a0a0a;">Shiva Krishna Manthena</p>
                    <p style="margin: 2px 0 25px 0; font-size: 12px; color: #666;">Redlix Studio | Accounts Department</p>
                    
                    <div style="font-size: 11px; color: #999; line-height: 1.8;">
                        <p style="margin: 0;">© 2026 Redlix Studio</p>
                        <p style="margin: 0;">Software & IT infrastructure solutions</p>
                        <p style="margin: 5px 0 0 0; color: #E61E32; font-weight: 600;">www.redlix.co.in</p>
                    </div>
                </div>
            </div>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Payment reminder email sent to ${to}`);
        return { success: true };
    } catch (error) {
        console.error("Error sending payment due email:", error);
        return { success: false, error };
    }
}

interface SendPaymentReceivedEmailParams {
    to: string;
    clientName: string;
    companyName: string;
    amount: string;
    paymentDate: string;
    transactionId?: string;
    receiptFile?: {
        name: string;
        content: Buffer;
    };
}

export async function sendPaymentReceivedEmail({ to, clientName, companyName, amount, paymentDate, transactionId, receiptFile }: SendPaymentReceivedEmailParams) {
    const attachments = receiptFile ? [{
        filename: receiptFile.name,
        content: receiptFile.content,
        contentType: 'application/pdf'
    }] : [];

    const mailOptions = {
        from: `"Redlix Accounts" <${process.env.SMTP_EMAIL}>`,
        to,
        subject: `Payment Confirmation | Redlix Studio & ${companyName}`,
        attachments,
        html: `
            <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e8e8e8;">

                <!-- Header: Logo -->
                <div style="padding: 24px 32px; border-bottom: 1px solid #f0f0f0; background-color: #ffffff;">
                    <img src="https://res.cloudinary.com/dsqqrpzfl/image/upload/v1776288139/Screenshot_2026-04-16_at_02.51.43-removebg-preview_ytpg09.png" alt="Redlix Studio" style="height: 36px; width: auto; display: block;" />
                </div>

                <!-- Payment Success Banner Image -->
                <div style="background-color: #f9f9f9; padding: 0; line-height: 0;">
                    <img src="https://icpih.com/media-intestinal-health-ihsig/PAYMENT-SUCCESS.png" alt="Payment Successful" style="width: 100%; display: block;" />
                </div>

                <!-- Amount Block -->
                <div style="padding: 32px 32px 0 32px; text-align: center;">
                    <p style="margin: 0 0 4px 0; font-size: 12px; color: #888; text-transform: uppercase; letter-spacing: 0.1em;">Amount Received</p>
                    <p style="margin: 0 0 6px 0; font-size: 40px; font-weight: 800; color: #111111; letter-spacing: -0.02em;">${amount}</p>
                    <p style="margin: 0; font-size: 13px; color: #888;">on ${new Date(paymentDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                </div>

                <!-- Body -->
                <div style="padding: 28px 32px;">

                    <p style="font-size: 14px; color: #444; line-height: 1.7; margin: 0 0 28px 0;">
                        Dear <strong style="color: #111;">${clientName}</strong>,<br/>
                        Thank you. Your payment has been successfully received by <strong style="color: #111;">Redlix Studio</strong>. Below are the transaction details for your reference.
                    </p>

                    <!-- Transaction Details Table -->
                    <table style="width: 100%; border-collapse: collapse; border: 1px solid #eeeeee; margin-bottom: 24px;">
                        <tr style="background-color: #fafafa; border-bottom: 1px solid #eeeeee;">
                            <td colspan="2" style="padding: 10px 16px; font-size: 10px; font-weight: 700; color: #aaa; letter-spacing: 0.12em; text-transform: uppercase;">Transaction Details</td>
                        </tr>
                        <tr style="border-bottom: 1px solid #f5f5f5;">
                            <td style="padding: 13px 16px; font-size: 13px; color: #999; width: 40%;">Paid To</td>
                            <td style="padding: 13px 16px; font-size: 13px; font-weight: 600; color: #111;">Redlix Studio</td>
                        </tr>
                        <tr style="border-bottom: 1px solid #f5f5f5;">
                            <td style="padding: 13px 16px; font-size: 13px; color: #999;">From</td>
                            <td style="padding: 13px 16px; font-size: 13px; font-weight: 600; color: #111;">${clientName} &mdash; ${companyName}</td>
                        </tr>
                        <tr style="border-bottom: 1px solid #f5f5f5;">
                            <td style="padding: 13px 16px; font-size: 13px; color: #999;">Amount</td>
                            <td style="padding: 13px 16px; font-size: 14px; font-weight: 700; color: #1a8a50;">${amount}</td>
                        </tr>
                        <tr style="border-bottom: 1px solid #f5f5f5;">
                            <td style="padding: 13px 16px; font-size: 13px; color: #999;">Payment Date</td>
                            <td style="padding: 13px 16px; font-size: 13px; font-weight: 600; color: #111;">${new Date(paymentDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</td>
                        </tr>
                        ${transactionId ? `
                        <tr style="border-bottom: 1px solid #f5f5f5;">
                            <td style="padding: 13px 16px; font-size: 13px; color: #999;">Transaction ID</td>
                            <td style="padding: 13px 16px; font-size: 12px; font-weight: 700; color: #111; font-family: monospace; letter-spacing: 0.04em;">${transactionId}</td>
                        </tr>` : ''}
                        <tr>
                            <td style="padding: 13px 16px; font-size: 13px; color: #999;">Status</td>
                            <td style="padding: 13px 16px;">
                                <span style="display: inline-block; background-color: #f0faf4; color: #1a8a50; font-size: 11px; font-weight: 700; padding: 3px 10px; border: 1px solid #c3e6cf; border-radius: 3px; letter-spacing: 0.05em;">&#10003; PAID</span>
                            </td>
                        </tr>
                    </table>

                    ${receiptFile ? `
                    <!-- Attachment Notice -->
                    <div style="background-color: #f9f9f9; border: 1px solid #eeeeee; padding: 12px 16px; margin-bottom: 24px;">
                        <p style="margin: 0; font-size: 12px; color: #555;">&#128206; <strong>Receipt Attached:</strong> The official document <em>(${receiptFile.name})</em> is attached to this email.</p>
                    </div>
                    ` : ''}

                    <!-- Note -->
                    <p style="font-size: 12px; color: #aaa; line-height: 1.7; margin: 0 0 4px 0;">
                        Please keep this email for your records. If you have any queries regarding this payment, contact our billing team at <a href="mailto:${process.env.SMTP_EMAIL}" style="color: #333; font-weight: 600; text-decoration: none;">${process.env.SMTP_EMAIL}</a>.
                    </p>

                </div>

                <!-- Footer -->
                <div style="padding: 20px 32px; border-top: 1px solid #f0f0f0; background-color: #fafafa;">
                    <p style="margin: 0 0 2px 0; font-size: 13px; font-weight: 700; color: #111;">Shiva Krishna Manthena</p>
                    <p style="margin: 0 0 14px 0; font-size: 11px; color: #999;">Billing Lead &middot; Redlix Studio &middot; Accounts Department</p>
                    <p style="margin: 0; font-size: 10px; color: #bbb; line-height: 1.8;">
                        © 2026 Redlix Studio &middot; Software &amp; IT Infrastructure Solutions &middot; www.redlix.co.in<br/>
                        This is a system-generated receipt. Please do not reply to this email.
                    </p>
                </div>

            </div>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Payment received email sent to ${to}`);
        return { success: true };
    } catch (error) {
        console.error("Error sending payment received email:", error);
        return { success: false, error };
    }
}

interface SendResetPasswordEmailParams {
    to: string;
    name: string;
    resetLink: string;
}

export async function sendResetPasswordEmail({ to, name, resetLink }: SendResetPasswordEmailParams) {
    const mailOptions = {
        from: `"Redlix Security" <${process.env.SMTP_EMAIL}>`,
        to,
        subject: "Reset your Redlix Employee Portal Password",
        html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333; line-height: 1.5;">
                <div style="margin-bottom: 30px;">
                    <img src="https://res.cloudinary.com/dsqqrpzfl/image/upload/v1776288139/Screenshot_2026-04-16_at_02.51.43-removebg-preview_ytpg09.png" alt="Redlix Studio" style="height: 40px;" />
                </div>
                
                <p>Hello ${name},</p>
                
                <p>We received a request to reset the password for your Redlix Employee Portal account.</p>
                
                <p>Click the button below to choose a new password. This link will expire in 1 hour.</p>
                
                <p style="margin: 30px 0;">
                    <a href="${resetLink}" style="background-color: #E61E32; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block;">
                        Reset Password
                    </a>
                </p>
                
                <p>If you did not request a password reset, you can safely ignore this email. Your password will remain unchanged.</p>
                
                <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee;">
                    <p style="margin: 0; font-weight: bold;">The Redlix Security Team</p>
                    <p style="margin: 5px 0 0 0; font-size: 12px; color: #666;">Redlix Studio | Software & IT Solutions</p>
                </div>
            </div>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Password reset email sent to ${to}`);
        return { success: true };
    } catch (error) {
        console.error("Error sending password reset email:", error);
        return { success: false, error };
    }
}


interface SendHandRaiseNotificationParams {
    employeeName: string;
    employeeEmail: string;
    adminEmail: string;
    raisedAt: string;
}

export async function sendHandRaiseNotification({ employeeName, employeeEmail, adminEmail, raisedAt }: SendHandRaiseNotificationParams) {
    const mailOptions = {
        from: `"Redlix Employee Portal" <${process.env.SMTP_EMAIL}>`,
        to: adminEmail,
        subject: `🚨 Employee Needs Help — ${employeeName} raised their hand`,
        html: `
            <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; background-color: #ffffff; color: #1a1a1a;">
                <!-- Header -->
                <div style="background-color: #E61E32; padding: 24px 32px;">
                    <img src="https://res.cloudinary.com/dsqqrpzfl/image/upload/v1776288139/Screenshot_2026-04-16_at_02.51.43-removebg-preview_ytpg09.png" alt="Redlix Studio" style="height: 30px; filter: brightness(0) invert(1);" />
                </div>

                <div style="padding: 40px 32px;">
                    <h1 style="color: #E61E32; font-size: 20px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 6px 0;">
                        🖐 Hand Raised — Action Required
                    </h1>
                    <div style="width: 40px; height: 3px; background-color: #E61E32; margin-bottom: 28px;"></div>

                    <p style="font-size: 15px; line-height: 1.6; margin-bottom: 20px; color: #444;">
                        An employee on the <strong>Redlix Employee Portal</strong> has raised their hand and requires your immediate attention.
                    </p>

                    <div style="background-color: #f8f8f8; border: 1px solid #eee; padding: 24px; margin-bottom: 28px;">
                        <table style="width: 100%; border-collapse: collapse;">
                            <tr>
                                <td style="padding: 10px 0; font-size: 13px; color: #888; width: 150px;">Employee Name</td>
                                <td style="padding: 10px 0; font-size: 14px; font-weight: 700; color: #111;">${employeeName}</td>
                            </tr>
                            <tr>
                                <td style="padding: 10px 0; font-size: 13px; color: #888;">Employee Email</td>
                                <td style="padding: 10px 0; font-size: 14px; color: #E61E32; font-weight: 600;">${employeeEmail}</td>
                            </tr>
                            <tr>
                                <td style="padding: 10px 0; font-size: 13px; color: #888;">Time of Request</td>
                                <td style="padding: 10px 0; font-size: 14px; font-weight: 600; color: #111;">${new Date(raisedAt).toLocaleString('en-IN', { dateStyle: 'full', timeStyle: 'short' })}</td>
                            </tr>
                        </table>
                    </div>

                    <p style="font-size: 14px; color: #555; line-height: 1.7; margin-bottom: 0;">
                        Please log into the <strong>Admin Dashboard</strong> and contact <strong>${employeeName}</strong> directly to resolve their issue.
                    </p>
                </div>

                <!-- Footer -->
                <div style="background-color: #fafafa; padding: 24px 32px; border-top: 1px solid #eee;">
                    <p style="margin: 0; font-size: 12px; color: #bbb; line-height: 1.8;">
                        © 2026 Redlix Studio &middot; This is an automated notification from the Employee Portal.<br/>
                        Do not reply to this email directly.
                    </p>
                </div>
            </div>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Hand raise notification sent to admin (${adminEmail}) for employee: ${employeeName}`);
        return { success: true };
    } catch (error) {
        console.error("Error sending hand raise notification:", error);
        return { success: false, error };
    }
}



// ─────────────────────────────────────────────────────────────────────────────
// ALERT SYSTEM EMAILS
// ─────────────────────────────────────────────────────────────────────────────

const SITE_BASE = "https://www.redlix.co.in";
const EMPLOYEE_PORTAL = "https://www.redlix.co.in/employee";
const EMPLOYEE_LOGIN  = "https://www.redlix.co.in/employee/login";
const SUPPORT_PAGE    = "https://www.redlix.co.in/support";
const TERMS_PAGE      = "https://www.redlix.co.in/terms";
const PORTFOLIO_PAGE  = "https://www.redlix.co.in/portfolio";

/** Primary red CTA button */
function ctaButton(label: string, href: string): string {
    return `
        <div style="margin:28px 0 8px 0;text-align:left;">
            <a href="${href}" target="_blank" style="display:inline-block;background-color:#ffffff;color:#E61E32;font-size:12px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;text-decoration:none;padding:14px 28px;border-radius:4px;box-shadow:0 2px 4px rgba(0,0,0,0.1);">
                ${label} &rarr;
            </a>
        </div>
    `;
}

/** Ghost / secondary link row */
function quickLinks(links: { label: string; href: string }[]): string {
    const items = links
        .map(l => `<a href="${l.href}" target="_blank" style="color:#ffffff;font-size:12px;font-weight:700;text-decoration:underline;margin-right:20px;white-space:nowrap;">${l.label}</a>`)
        .join('');
    return `
        <div style="margin-top:24px;padding:16px 20px;background-color:rgba(0,0,0,0.12);border:1px solid rgba(255,255,255,0.15);border-radius:4px;">
            <p style="margin:0 0 8px 0;font-size:9px;font-weight:700;color:rgba(255,255,255,0.6);text-transform:uppercase;letter-spacing:0.15em;">Quick Links</p>
            <div style="display:flex;flex-wrap:wrap;gap:8px 16px;">${items}</div>
        </div>
    `;
}

function baseEmailWrapper(headerLabel: string, body: string): string {
    return `
        <div style="font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;max-width:600px;margin:0 auto;background-color:#E61E32;color:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 4px 12px rgba(0,0,0,0.1);">
            <!-- Header -->
            <div style="padding: 24px 36px 0 36px;">
                <table style="width: 100%; border-collapse: collapse; border-bottom: 1px solid rgba(255, 255, 255, 0.15); padding-bottom: 16px;">
                    <tr>
                        <td style="text-align: left; vertical-align: middle; padding-bottom: 16px;">
                            <span style="font-size: 11px; font-weight: 800; letter-spacing: 0.15em; color: #ffffff; text-transform: uppercase;">
                                ${headerLabel}
                            </span>
                        </td>
                        <td style="text-align: right; vertical-align: middle; padding-bottom: 16px;">
                            <img src="https://ik.imagekit.io/dypkhqxip/redlix%20new?updatedAt=1781042212493" alt="Redlix" style="height: 28px; width: auto; display: inline-block;" />
                        </td>
                    </tr>
                </table>
            </div>

            <!-- Body -->
            <div style="padding:32px 36px 40px 36px;">
                ${body}
            </div>
            
            <!-- Footer -->
            <div style="background-color:rgba(0,0,0,0.15);padding:24px 36px;text-align:center;">
                <p style="margin:0;font-size:11px;color:#ffffff;opacity:0.8;line-height:1.8;">
                    © 2026 Redlix Studio &middot; Software &amp; IT Infrastructure Solutions &middot; <a href="${SITE_BASE}" style="color:#ffffff;font-weight:700;text-decoration:underline;">www.redlix.co.in</a><br/>
                    This is an automated notification. Please do not reply to this email.
                </p>
            </div>
        </div>
    `;
}

// ─── 1. Dashboard Access Pending ─────────────────────────────────────────────

interface SendDashboardAccessPendingParams {
    to: string;
    name: string;
    customMessage?: string;
}

export async function sendDashboardAccessPendingAlert({ to, name, customMessage }: SendDashboardAccessPendingParams) {
    const body = `
        <h1 style="color:#ffffff;font-size:20px;font-weight:800;letter-spacing:-0.01em;margin:0 0 8px 0;">Dashboard Access — Pending</h1>
        <div style="width:36px;height:3px;background-color:#ffffff;margin-bottom:28px;"></div>
        <p style="font-size:15px;line-height:1.7;margin-bottom:20px;">Hello <strong>${name}</strong>,</p>
        <p style="font-size:14px;line-height:1.7;color:#ffffff;margin-bottom:24px;opacity:0.9;">
            We noticed that your <strong>Redlix Employee Dashboard</strong> access is still pending. To activate your account and get full access to your portal, please complete the setup steps below.
        </p>
        <div style="background-color:rgba(255,255,255,0.1);border:1px solid rgba(255,255,255,0.25);padding:24px;margin-bottom:28px;border-radius:4px;">
            <p style="margin:0 0 12px 0;font-size:11px;font-weight:700;color:#ffffff;text-transform:uppercase;letter-spacing:0.12em;">Action Required</p>
            <ul style="margin:0;padding-left:18px;font-size:13px;line-height:2;color:#ffffff;">
                <li>Log in to the Redlix Employee Portal using your registered email</li>
                <li>Reset your default password on first login</li>
                <li>Complete your profile details (phone, address, UPI ID)</li>
                <li>Confirm your onboarding checklist</li>
            </ul>
        </div>
        ${customMessage ? `<div style="border-left:3px solid #ffffff;padding:12px 16px;background-color:rgba(255,255,255,0.15);margin-bottom:24px;font-size:13px;color:#ffffff;line-height:1.6;border-radius:0 4px 4px 0;"><strong>Note from Admin:</strong> ${customMessage}</div>` : ''}
        ${ctaButton('Access Employee Portal', EMPLOYEE_LOGIN)}
        ${quickLinks([
            { label: 'Employee Portal', href: EMPLOYEE_PORTAL },
            { label: 'Reset Password', href: `${EMPLOYEE_PORTAL}/reset-password` },
            { label: 'Get Support', href: SUPPORT_PAGE },
            { label: 'Visit Website', href: SITE_BASE },
        ])}
        <p style="font-size:12px;color:#ffffff;opacity:0.8;line-height:1.7;margin-top:20px;">If you are facing any issues logging in, please visit our <a href="${SUPPORT_PAGE}" style="color:#ffffff;text-decoration:underline;font-weight:700;">support page</a> or reply to this email.</p>
        <div style="margin-top:32px;padding-top:24px;border-top:1px solid rgba(255,255,255,0.2);">
            <p style="margin:0;font-size:11px;font-weight:700;color:#ffffff;text-transform:uppercase;letter-spacing:0.1em;">Redlix HR &amp; Admin Team</p>
            <p style="margin:4px 0 0 0;font-size:13px;color:#ffffff;opacity:0.9;">Redlix Studio &middot; Employee Portal</p>
        </div>
    `;
    const mailOptions = {
        from: `"Redlix Admin" <${process.env.SMTP_EMAIL}>`,
        to,
        subject: `Action Required: Your Redlix Dashboard Access is Pending`,
        html: baseEmailWrapper("Portal Alert", body),
    };
    try {
        await transporter.sendMail(mailOptions);
        return { success: true };
    } catch (error) {
        console.error("Error sending dashboard access pending alert:", error);
        return { success: false, error };
    }
}

// ─── 2. Profile Completion Pending ───────────────────────────────────────────

interface SendProfilePendingParams {
    to: string;
    name: string;
    missingFields?: string[];
    customMessage?: string;
}

export async function sendProfilePendingAlert({ to, name, missingFields, customMessage }: SendProfilePendingParams) {
    const fieldList = missingFields && missingFields.length > 0
        ? missingFields.map(f => `<li>${f}</li>`).join('')
        : "<li>Phone / Mobile Number</li><li>UPI ID</li><li>Father's Name</li><li>Permanent Address</li><li>Alternate Email</li>";

    const body = `
        <h1 style="color:#ffffff;font-size:20px;font-weight:800;letter-spacing:-0.01em;margin:0 0 8px 0;">Profile Incomplete — Action Needed</h1>
        <div style="width:36px;height:3px;background-color:#ffffff;margin-bottom:28px;"></div>
        <p style="font-size:15px;line-height:1.7;margin-bottom:20px;">Hello <strong>${name}</strong>,</p>
        <p style="font-size:14px;line-height:1.7;color:#ffffff;margin-bottom:24px;opacity:0.9;">
            Your employee profile on the <strong>Redlix Portal</strong> is incomplete. A complete profile helps us process your payroll, communications, and work assignments correctly.
        </p>
        <div style="background-color:rgba(255,255,255,0.1);border:1px solid rgba(255,255,255,0.25);padding:24px;margin-bottom:28px;border-radius:4px;">
            <p style="margin:0 0 12px 0;font-size:11px;font-weight:700;color:#ffffff;text-transform:uppercase;letter-spacing:0.12em;">Pending Profile Fields</p>
            <ul style="margin:0;padding-left:18px;font-size:13px;line-height:2;color:#ffffff;">${fieldList}</ul>
        </div>
        ${customMessage ? `<div style="border-left:3px solid #ffffff;padding:12px 16px;background-color:rgba(255,255,255,0.15);margin-bottom:24px;font-size:13px;color:#ffffff;line-height:1.6;border-radius:0 4px 4px 0;"><strong>Note from Admin:</strong> ${customMessage}</div>` : ''}
        <p style="font-size:13px;color:#ffffff;opacity:0.9;line-height:1.7;margin-bottom:4px;">Please update your profile within <strong>48 hours</strong> to avoid any delays in payments or communications.</p>
        ${ctaButton('Update My Profile', `${EMPLOYEE_PORTAL}`)}
        ${quickLinks([
            { label: 'Employee Portal', href: EMPLOYEE_PORTAL },
            { label: 'Portal Login', href: EMPLOYEE_LOGIN },
            { label: 'Get Support', href: SUPPORT_PAGE },
        ])}
        <div style="margin-top:32px;padding-top:24px;border-top:1px solid rgba(255,255,255,0.2);">
            <p style="margin:0;font-size:11px;font-weight:700;color:#ffffff;text-transform:uppercase;letter-spacing:0.1em;">Redlix HR Team</p>
            <p style="margin:4px 0 0 0;font-size:13px;color:#ffffff;opacity:0.9;">Redlix Studio &middot; Human Resources</p>
        </div>
    `;
    const mailOptions = {
        from: `"Redlix HR" <${process.env.SMTP_EMAIL}>`,
        to,
        subject: `Reminder: Complete Your Redlix Employee Profile`,
        html: baseEmailWrapper("Profile Reminder", body),
    };
    try {
        await transporter.sendMail(mailOptions);
        return { success: true };
    } catch (error) {
        console.error("Error sending profile pending alert:", error);
        return { success: false, error };
    }
}

// ─── 3. Terms & Conditions Update ────────────────────────────────────────────

interface SendTermsUpdateParams {
    to: string;
    clientName: string;
    companyName: string;
    effectiveDate?: string;
    customMessage?: string;
}

export async function sendTermsUpdateAlert({ to, clientName, companyName, effectiveDate, customMessage }: SendTermsUpdateParams) {
    const displayDate = effectiveDate
        ? new Date(effectiveDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
        : 'immediately';

    const body = `
        <h1 style="color:#ffffff;font-size:20px;font-weight:800;letter-spacing:-0.01em;margin:0 0 8px 0;">Terms &amp; Conditions Updated</h1>
        <div style="width:36px;height:3px;background-color:#ffffff;margin-bottom:28px;"></div>
        <p style="font-size:15px;line-height:1.7;margin-bottom:20px;">Dear <strong>${clientName}</strong>,</p>
        <p style="font-size:14px;line-height:1.7;color:#ffffff;margin-bottom:24px;opacity:0.9;">
            We are writing to inform you that <strong>Redlix Studio</strong> has updated its Terms &amp; Conditions, effective <strong>${displayDate}</strong>. These changes may affect your ongoing project engagement and service agreement with us.
        </p>
        <div style="background-color:rgba(0,0,0,0.2);border:1px solid rgba(255,255,255,0.15);padding:24px;margin-bottom:28px;border-radius:4px;">
            <p style="margin:0 0 12px 0;font-size:10px;font-weight:700;color:#ffffff;text-transform:uppercase;letter-spacing:0.15em;">Key Highlights</p>
            <ul style="margin:0;padding-left:18px;font-size:13px;line-height:2;color:#ffffff;">
                <li>Updated service delivery and project timelines</li>
                <li>Revised payment and refund policies</li>
                <li>Changes to intellectual property ownership clauses</li>
                <li>Updated confidentiality and data handling provisions</li>
            </ul>
        </div>
        <p style="font-size:14px;line-height:1.7;color:#ffffff;opacity:0.9;margin-bottom:20px;">
            By continuing to use Redlix Studio services after <strong>${displayDate}</strong>, you agree to the updated Terms &amp; Conditions. We encourage you to read the full document before that date.
        </p>
        ${customMessage ? `<div style="border-left:3px solid #ffffff;padding:12px 16px;background-color:rgba(255,255,255,0.15);margin-bottom:24px;font-size:13px;color:#ffffff;line-height:1.6;border-radius:0 4px 4px 0;"><strong>Additional Note:</strong> ${customMessage}</div>` : ''}
        ${ctaButton('Read Full Terms & Conditions', TERMS_PAGE)}
        ${quickLinks([
            { label: 'Terms & Conditions', href: TERMS_PAGE },
            { label: 'Privacy Policy', href: `${SITE_BASE}/privacy` },
            { label: 'Contact Us', href: SUPPORT_PAGE },
            { label: 'Visit Website', href: SITE_BASE },
        ])}
        <div style="margin-top:32px;padding-top:24px;border-top:1px solid rgba(255,255,255,0.2);">
            <p style="margin:0;font-size:11px;font-weight:700;color:#ffffff;text-transform:uppercase;letter-spacing:0.1em;">Redlix Legal &amp; Compliance</p>
            <p style="margin:4px 0 0 0;font-size:13px;color:#ffffff;opacity:0.9;">Redlix Studio &middot; ${companyName}</p>
        </div>
    `;
    const mailOptions = {
        from: `"Redlix Legal" <${process.env.SMTP_EMAIL}>`,
        to,
        subject: `Important: Redlix Studio Terms & Conditions Have Been Updated`,
        html: baseEmailWrapper("Terms Update", body),
    };
    try {
        await transporter.sendMail(mailOptions);
        return { success: true };
    } catch (error) {
        console.error("Error sending terms update alert:", error);
        return { success: false, error };
    }
}

// ─── 4. Client Information Update Request ────────────────────────────────────

interface SendClientInfoUpdateParams {
    to: string;
    clientName: string;
    companyName: string;
    fieldsToUpdate?: string[];
    customMessage?: string;
}

export async function sendClientInfoUpdateAlert({ to, clientName, companyName, fieldsToUpdate, customMessage }: SendClientInfoUpdateParams) {
    const fieldList = fieldsToUpdate && fieldsToUpdate.length > 0
        ? fieldsToUpdate.map(f => `<li>${f}</li>`).join('')
        : "<li>Company contact details</li><li>Project requirements / scope</li><li>Billing address</li><li>Point of contact information</li>";

    const body = `
        <h1 style="color:#ffffff;font-size:20px;font-weight:800;letter-spacing:-0.01em;margin:0 0 8px 0;">Client Information Update Request</h1>
        <div style="width:36px;height:3px;background-color:#ffffff;margin-bottom:28px;"></div>
        <p style="font-size:15px;line-height:1.7;margin-bottom:20px;">Dear <strong>${clientName}</strong>,</p>
        <p style="font-size:14px;line-height:1.7;color:#ffffff;margin-bottom:24px;opacity:0.9;">
            To ensure we continue to serve <strong>${companyName}</strong> with the highest quality, our team requires you to review and update certain information in your project record. Please reply to this email or get in touch with us directly.
        </p>
        <div style="background-color:rgba(255,255,255,0.1);border:1px solid rgba(255,255,255,0.25);padding:24px;margin-bottom:28px;border-radius:4px;">
            <p style="margin:0 0 12px 0;font-size:11px;font-weight:700;color:#ffffff;text-transform:uppercase;letter-spacing:0.12em;">Information to Review / Update</p>
            <ul style="margin:0;padding-left:18px;font-size:13px;line-height:2;color:#ffffff;">${fieldList}</ul>
        </div>
        ${customMessage ? `<div style="border-left:3px solid #ffffff;padding:12px 16px;background-color:rgba(255,255,255,0.15);margin-bottom:24px;font-size:13px;color:#ffffff;line-height:1.6;border-radius:0 4px 4px 0;"><strong>Message from our team:</strong> ${customMessage}</div>` : ''}
        <p style="font-size:13px;color:#ffffff;opacity:0.9;line-height:1.7;margin-bottom:4px;">Please respond within <strong>3 business days</strong>. You can reach out via our support page or simply reply to this email.</p>
        ${ctaButton('Contact Our Team', SUPPORT_PAGE)}
        ${quickLinks([
            { label: 'Support Page', href: SUPPORT_PAGE },
            { label: 'Our Services', href: SITE_BASE },
            { label: 'Terms & Conditions', href: TERMS_PAGE },
            { label: 'Our Portfolio', href: PORTFOLIO_PAGE },
        ])}
        <div style="margin-top:32px;padding-top:24px;border-top:1px solid rgba(255,255,255,0.2);">
            <p style="margin:0;font-size:11px;font-weight:700;color:#ffffff;text-transform:uppercase;letter-spacing:0.1em;">Redlix Client Relations</p>
            <p style="margin:4px 0 0 0;font-size:13px;color:#ffffff;opacity:0.9;">Redlix Studio &middot; Client Success Team</p>
        </div>
    `;
    const mailOptions = {
        from: `"Redlix Client Support" <${process.env.SMTP_EMAIL}>`,
        to,
        subject: `Action Required: Please Update Your Client Information — ${companyName}`,
        html: baseEmailWrapper("Info Update", body),
    };
    try {
        await transporter.sendMail(mailOptions);
        return { success: true };
    } catch (error) {
        console.error("Error sending client info update alert:", error);
        return { success: false, error };
    }
}

// ─── 5. New Client Welcome ────────────────────────────────────────────────────

interface SendNewClientWelcomeParams {
    to: string;
    clientName: string;
    companyName: string;
    appName?: string;
    developerName?: string;
    customMessage?: string;
}

export async function sendNewClientWelcomeAlert({ to, clientName, companyName, appName, developerName, customMessage }: SendNewClientWelcomeParams) {
    const body = `
        <h1 style="color:#ffffff;font-size:20px;font-weight:800;letter-spacing:-0.01em;margin:0 0 8px 0;">Welcome to Redlix Studio!</h1>
        <div style="width:36px;height:3px;background-color:#ffffff;margin-bottom:28px;"></div>
        <p style="font-size:15px;line-height:1.7;margin-bottom:20px;">Dear <strong>${clientName}</strong>,</p>
        <p style="font-size:14px;line-height:1.7;color:#ffffff;margin-bottom:24px;opacity:0.9;">
            On behalf of the entire team at <strong>Redlix Studio</strong>, we are thrilled to welcome <strong>${companyName}</strong> as our newest client. We look forward to building something exceptional together.
        </p>
        <div style="background-color:rgba(0,0,0,0.2);border:1px solid rgba(255,255,255,0.15);padding:28px;margin-bottom:28px;border-radius:4px;">
            <p style="margin:0 0 16px 0;font-size:10px;font-weight:700;color:#ffffff;text-transform:uppercase;letter-spacing:0.15em;">Your Project Details</p>
            <table style="width:100%;border-collapse:collapse;">
                <tr><td style="padding:8px 0;font-size:12px;color:rgba(255,255,255,0.65);width:140px;">Client</td><td style="padding:8px 0;font-size:13px;font-weight:600;color:#ffffff;">${clientName} &mdash; ${companyName}</td></tr>
                ${appName ? `<tr><td style="padding:8px 0;font-size:12px;color:rgba(255,255,255,0.65);">Project / App</td><td style="padding:8px 0;font-size:13px;font-weight:600;color:#ffffff;">${appName}</td></tr>` : ''}
                ${developerName ? `<tr><td style="padding:8px 0;font-size:12px;color:rgba(255,255,255,0.65);">Your Developer</td><td style="padding:8px 0;font-size:13px;font-weight:600;color:#ffffff;">${developerName}</td></tr>` : ''}
                <tr><td style="padding:8px 0;font-size:12px;color:rgba(255,255,255,0.65);">Email</td><td style="padding:8px 0;font-size:13px;color:#ffffff;">${to}</td></tr>
            </table>
        </div>
        <div style="background-color:rgba(255,255,255,0.1);border:1px solid rgba(255,255,255,0.25);padding:24px;margin-bottom:28px;border-radius:4px;">
            <p style="margin:0 0 12px 0;font-size:11px;font-weight:700;color:#ffffff;text-transform:uppercase;letter-spacing:0.12em;">What Happens Next</p>
            <ul style="margin:0;padding-left:18px;font-size:13px;line-height:2;color:#ffffff;">
                <li>Our team will reach out to schedule your <strong>Discovery Call</strong></li>
                <li>You'll receive project timeline and milestone details via email</li>
                <li>A dedicated project lead will be assigned to your account</li>
                <li>All communications will be handled through your registered email</li>
            </ul>
        </div>
        ${customMessage ? `<div style="border-left:3px solid #ffffff;padding:12px 16px;background-color:rgba(255,255,255,0.15);margin-bottom:24px;font-size:13px;color:#ffffff;line-height:1.6;border-radius:0 4px 4px 0;"><strong>Personal Note:</strong> ${customMessage}</div>` : ''}
        ${ctaButton('Visit Our Website', SITE_BASE)}
        ${quickLinks([
            { label: 'Our Portfolio', href: PORTFOLIO_PAGE },
            { label: 'Our Services', href: SITE_BASE },
            { label: 'Terms & Conditions', href: TERMS_PAGE },
            { label: 'Support', href: SUPPORT_PAGE },
        ])}
        <p style="font-size:12px;color:#ffffff;opacity:0.8;line-height:1.7;margin-top:20px;">
            We are committed to transparency, quality, and delivering results that exceed your expectations. If you have any immediate questions, feel free to <a href="${SUPPORT_PAGE}" style="color:#ffffff;font-weight:700;text-decoration:underline;">contact our support team</a>.
        </p>
        <div style="margin-top:32px;padding-top:24px;border-top:1px solid rgba(255,255,255,0.2);">
            <p style="margin:0;font-size:11px;font-weight:700;color:#ffffff;text-transform:uppercase;letter-spacing:0.1em;">Redlix Client Success</p>
            <p style="margin:4px 0 0 0;font-size:13px;color:#ffffff;opacity:0.9;">Redlix Studio &middot; We build what matters</p>
        </div>
    `;
    const mailOptions = {
        from: `"Redlix Studio" <${process.env.SMTP_EMAIL}>`,
        to,
        subject: `Welcome to Redlix Studio — ${companyName} is Officially Onboarded!`,
        html: baseEmailWrapper("Welcome", body),
    };
    try {
        await transporter.sendMail(mailOptions);
        return { success: true };
    } catch (error) {
        console.error("Error sending new client welcome alert:", error);
        return { success: false, error };
    }
}

// ─── 6. Custom Alert ──────────────────────────────────────────────────────────

interface SendCustomAlertParams {
    to: string | string[];
    subject: string;
    recipientName?: string;
    messageBody: string;
    senderLabel?: string;
}

export async function sendCustomAlert({ to, subject, recipientName, messageBody, senderLabel }: SendCustomAlertParams) {
    const greeting = recipientName ? `<p style="font-size:15px;line-height:1.7;margin-bottom:20px;">Dear <strong>${recipientName}</strong>,</p>` : '';
    const body = `
        <h1 style="color:#ffffff;font-size:20px;font-weight:800;letter-spacing:-0.01em;margin:0 0 8px 0;">${subject}</h1>
        <div style="width:36px;height:3px;background-color:#ffffff;margin-bottom:28px;"></div>
        ${greeting}
        <div style="font-size:14px;line-height:1.8;color:#ffffff;opacity:0.9;margin-bottom:28px;">${messageBody.replace(/\n/g, '<br/>')}</div>
        ${quickLinks([
            { label: 'Visit Redlix Studio', href: SITE_BASE },
            { label: 'Our Portfolio', href: PORTFOLIO_PAGE },
            { label: 'Support', href: SUPPORT_PAGE },
        ])}
        <div style="margin-top:32px;padding-top:24px;border-top:1px solid rgba(255,255,255,0.2);">
            <p style="margin:0;font-size:11px;font-weight:700;color:#ffffff;text-transform:uppercase;letter-spacing:0.1em;">${senderLabel || 'Redlix Admin Team'}</p>
            <p style="margin:4px 0 0 0;font-size:13px;color:#ffffff;opacity:0.9;">Redlix Studio</p>
        </div>
    `;
    const toAddresses = Array.isArray(to) ? to.join(', ') : to;
    const mailOptions = {
        from: `"Redlix Admin" <${process.env.SMTP_EMAIL}>`,
        to: toAddresses,
        subject,
        html: baseEmailWrapper("Admin Alert", body),
    };
    try {
        await transporter.sendMail(mailOptions);
        return { success: true };
    } catch (error) {
        console.error("Error sending custom alert:", error);
        return { success: false, error };
    }
}


interface SendTaskAssignmentParams {
    to: string;
    employeeName: string;
    taskTitle: string;
    taskDescription?: string;
    deadline?: string | Date | null;
}

export async function sendTaskAssignmentEmail({ to, employeeName, taskTitle, taskDescription, deadline }: SendTaskAssignmentParams) {
    const displayDeadline = deadline
        ? new Date(deadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
        : 'No deadline set';

    const body = `
        <h1 style="color:#ffffff;font-size:20px;font-weight:800;letter-spacing:-0.01em;margin:0 0 8px 0;">New Task Assigned</h1>
        <div style="width:36px;height:3px;background-color:#ffffff;margin-bottom:28px;"></div>
        <p style="font-size:15px;line-height:1.7;margin-bottom:20px;">Hello <strong>${employeeName}</strong>,</p>
        <p style="font-size:14px;line-height:1.7;color:#ffffff;margin-bottom:24px;opacity:0.9;">
            You have been assigned a new task on the <strong>Redlix Employee Portal</strong>. Please review the details below.
        </p>
        <div style="background-color:rgba(255,255,255,0.1);border:1px solid rgba(255,255,255,0.25);padding:24px;margin-bottom:28px;border-radius:4px;">
            <p style="margin:0 0 12px 0;font-size:11px;font-weight:700;color:#ffffff;text-transform:uppercase;letter-spacing:0.12em;">Task Details</p>
            <table style="width:100%;border-collapse:collapse;color:#ffffff;font-size:14px;">
                <tr>
                    <td style="padding:6px 0;font-weight:700;width:120px;color:rgba(255,255,255,0.7);">Title</td>
                    <td style="padding:6px 0;font-weight:600;">${taskTitle}</td>
                </tr>
                ${taskDescription ? `
                <tr>
                    <td style="padding:6px 0;font-weight:700;vertical-align:top;color:rgba(255,255,255,0.7);">Description</td>
                    <td style="padding:6px 0;line-height:1.5;">${taskDescription}</td>
                </tr>` : ''}
                <tr>
                    <td style="padding:6px 0;font-weight:700;color:rgba(255,255,255,0.7);">Deadline</td>
                    <td style="padding:6px 0;font-weight:600;">${displayDeadline}</td>
                </tr>
            </table>
        </div>
        ${ctaButton('Access Employee Portal', EMPLOYEE_LOGIN)}
        ${quickLinks([
            { label: 'Employee Portal', href: EMPLOYEE_PORTAL },
            { label: 'Portal Login', href: EMPLOYEE_LOGIN },
            { label: 'Get Support', href: SUPPORT_PAGE },
        ])}
        <p style="font-size:12px;color:#ffffff;opacity:0.8;line-height:1.7;margin-top:20px;">If you have any questions or need clarification, please reply directly to this email.</p>
        <div style="margin-top:32px;padding-top:24px;border-top:1px solid rgba(255,255,255,0.2);">
            <p style="margin:0;font-size:11px;font-weight:700;color:#ffffff;text-transform:uppercase;letter-spacing:0.1em;">Redlix Operations Team</p>
            <p style="margin:4px 0 0 0;font-size:13px;color:#ffffff;opacity:0.9;">Redlix Studio &middot; Employee Portal</p>
        </div>
    `;
    const mailOptions = {
        from: `"Redlix Tasks" <${process.env.SMTP_EMAIL}>`,
        to,
        subject: `New Task Assigned: ${taskTitle}`,
        html: baseEmailWrapper("Task Assignment", body),
    };
    try {
        await transporter.sendMail(mailOptions);
        console.log(`Task assignment email sent successfully to ${to}`);
        return { success: true };
    } catch (error) {
        console.error("Error sending task assignment email:", error);
        return { success: false, error };
    }
}

