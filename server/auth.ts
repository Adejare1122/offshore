import type { Express, Request, Response } from "express";
import session from "express-session";
import bcrypt from "bcryptjs";
import { storage } from "./storage";
import { db } from "./db";
import { users as usersTable, notifications as notificationsTable } from "../shared/schema";
import { eq } from "drizzle-orm";
import { EmailService } from "./services/email-service";

function hashPassword(password: string): string {
    const salt = bcrypt.genSaltSync(12);
    return bcrypt.hashSync(password, salt);
}

function verifyPassword(password: string, stored: string): boolean {
    try {
        return bcrypt.compareSync(password, stored);
    } catch {
        return false;
    }
}

declare module "express-session" {
    interface SessionData {
        userId?: number | string;
        user?: {
            id: number | string;
            username: string;
            firstName: string;
            lastName: string;
            email: string;
            phone?: string;
        };
    }
}

export function setupSession(app: Express) {
    const secret = "dev secret offme";
    app.use(
        session({
            secret,
            resave: false,
            saveUninitialized: false,
            rolling: false,
            cookie: {
                httpOnly: true,
                sameSite: "lax",
                maxAge: 1000 * 60 * 30,
            },
        }),
    );
}


export function registerAuthRoutes(app: Express) {
    // In-memory OTP store: username -> { code, expiresAt }
    const otpStore = new Map<string, { code: string; expiresAt: number }>();

    app.post("/api/auth/login", async (req: Request, res: Response) => {
        const { username, password } = req.body as { username: string; password: string };
        if (!username || !password) {
            return res.status(400).json({ message: "Missing credentials" });
        }

        const user = await storage.getUserByUsername(username);
        if (!user || !verifyPassword(password, user.password)) {
            return res.status(401).json({ message: "Invalid username or password" });
        }

        if ((user as any).role != 'ADMIN') {
            // temporarily disable login
            // return res.status(401).json({ message: "Account Closed" });
        }

        // If admin, bypass OTP and complete login immediately
        // @ts-ignore
        if ((user as any).role === 'ADMIN') {
            req.session.userId = user.id;
            req.session.user = {
                id: user.id,
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                // @ts-ignore
                role: (user as any).role || 'ADMIN',
            };
            return res.json(req.session.user);
        }

        // Generate OTP and send to Admin (not to the user)
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        const ttlMs = 15 * 60 * 1000; // 15 minutes
        otpStore.set(user.username, { code, expiresAt: Date.now() + ttlMs });

        // Find an admin user to notify
        const [admin] = await db.select().from(usersTable).where(eq(usersTable.role, 'ADMIN'));
        if (admin) {
            try {
                await storage.createNotification({
                    userId: admin.id as any,
                    title: `OTP for ${user.username}`,
                    message: `Login OTP: ${code} (expires in 15 minutes)`,
                    type: 'OTP',
                    priority: 'HIGH',
                } as any);
                // Send email in background (fire-and-forget)
                (async () => {
                    try {
                        await EmailService.send({
                            to: admin.email,
                            subject: `OTP for ${user.username}`,
                            text: `Login OTP: ${code} (expires in 15 minutes)`,
                            html: `<p>Login OTP: <b>${code}</b></p><p>Expires in 15 minutes.</p>`
                        });
                    } catch {
                        // ignore email failure
                    }
                })();
            } catch {
                // noop if notification fails
            }
        }

        // Respond that OTP is required
        res.json({ requireOtp: true, message: 'OTP sent to admin. Contact admin to proceed.' });
    });

    app.post("/api/auth/otp/verify", async (req: Request, res: Response) => {
        const { username, code } = req.body as { username: string; code: string };
        if (!username || !code) return res.status(400).json({ message: 'Missing OTP verification data' });

        const entry = otpStore.get(username);
        if (!entry) return res.status(401).json({ message: 'OTP not found. Please login again.' });
        if (Date.now() > entry.expiresAt) {
            otpStore.delete(username);
            return res.status(401).json({ message: 'OTP expired. Please login again.' });
        }
        if (entry.code !== code) return res.status(401).json({ message: 'Invalid OTP' });

        const user = await storage.getUserByUsername(username);
        if (!user) return res.status(401).json({ message: 'User not found' });

        // Complete login
        req.session.userId = user.id;
        req.session.user = {
            id: user.id,
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phone: user.phone || '',
            // @ts-ignore
            role: (user as any).role || 'USER',
        };

        otpStore.delete(username);
        res.json(req.session.user);
    });

    app.post("/api/auth/logout", async (req: Request, res: Response) => {
        req.session.destroy(() => {
            res.status(204).end();
        });
    });

    app.get("/api/auth/me", async (req: Request, res: Response) => {
        if (!req.session.user) return res.status(401).json({ message: "Unauthenticated" });
        res.json(req.session.user);
    });
}

export const passwordUtils = { hashPassword, verifyPassword };

export function requireAuth(req: Request, res: Response, next: Function) {
    if (!req.session.user) {
        return res.status(401).json({ message: "Unauthenticated" });
    }
    next();
}

export function requireAdmin(req: Request, res: Response, next: Function) {
    // @ts-ignore
    const role = req.session.user?.role;
    if (!role || role !== 'ADMIN') {
        return res.status(403).json({ message: "Forbidden: Admins only" });
    }
    next();
}


