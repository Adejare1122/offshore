import nodemailer from "nodemailer";

export type SendEmailInput = {
    to: string;
    subject: string;
    text?: string;
    html?: string;
};

export class EmailService {
    private static transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || "smtp.example.com",
        port: Number(process.env.SMTP_PORT || 587),
        secure: false,
        auth: process.env.SMTP_USER && process.env.SMTP_PASS ? {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        } : undefined,
    });

    static async send(input: SendEmailInput): Promise<void> {
        const from = process.env.MAIL_FROM || "no-reply@example.com";
        await this.transporter.sendMail({
            from,
            to: input.to,
            subject: input.subject,
            text: input.text,
            html: input.html,
        });
    }
}


