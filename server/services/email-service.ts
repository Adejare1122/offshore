import nodemailer from "nodemailer";

export type SendEmailInput = {
    to: string;
    subject: string;
    text?: string;
    html?: string;
};

export class EmailService {
    private static transporter: ReturnType<typeof nodemailer.createTransport> | null = null;

    // Created lazily on first send (not at module load) so a missing/invalid
    // SMTP config can't take down the whole serverless function at cold start.
    private static getTransporter() {
        if (!this.transporter) {
            this.transporter = nodemailer.createTransport({
                host: process.env.SMTP_HOST || "smtp.example.com",
                port: Number(process.env.SMTP_PORT || 587),
                secure: false,
                auth: process.env.SMTP_USER && process.env.SMTP_PASS ? {
                    user: process.env.SMTP_USER,
                    pass: process.env.SMTP_PASS,
                } : undefined,
            });
        }
        return this.transporter;
    }

    static async send(input: SendEmailInput): Promise<void> {
        const from = process.env.MAIL_FROM || "no-reply@example.com";
        await this.getTransporter().sendMail({
            from,
            to: input.to,
            subject: input.subject,
            text: input.text,
            html: input.html,
        });
    }
}


