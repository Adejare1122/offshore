import type { Express, Request, Response } from "express";
import session from "express-session";
import bcrypt from "bcryptjs";
import { storage } from "./storage";
import { db } from "./db";
import { users as usersTable, notifications as notificationsTable } from "../shared/schema";
import { eq, and, gt } from "drizzle-orm";
import { EmailService } from "./services/email-service";

function hashPassword(password: string): string {
    const salt = bcrypt.genSaltSync(12);
    return bcrypt.hashSync(password, salt);
}

function verifyPassword(password: string, stored: string): boolean {
    try {
        if (!password || !stored) return false;
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
            role?: string;
        };
    }
}

const isVercel = !!process.env.VERCEL;

export function setupSession(app: Express) {
    const secret = process.env.SESSION_SECRET || "dev secret offme";
    app.use(
        session({
            secret,
            resave: false,
            saveUninitialized: false,
            rolling: false,
            cookie: {
                httpOnly: true,
                // On Vercel (HTTPS), use secure + sameSite none so cookie crosses origin boundary
                secure: isVercel,
                sameSite: isVercel ? "none" : "lax",
                maxAge: 1000 * 60 * 60 * 2, // 2 hours
            },
        }),
    );
}

/**
 * Store OTP in the DB using the notifications table.
 * We encode expiry into the message so we can validate it without in-memory state.
 */
async function storeOtpInDb(username: string, code: string, expiresAt: number) {
    // Find the user to get their id
    const user = await storage.getUserByUsername(username);
    if (!user) return;

    // Delete any existing OTP notifications for this user to avoid stale entries
    await db.delete(notificationsTable).where(
        and(
            eq(notificationsTable.userId, user.id as any),
            eq(notificationsTable.type, "OTP_PENDING"),
        )
    );

    // Insert fresh OTP record
    await db.insert(notificationsTable).values({
        userId: user.id as any,
        title: `OTP:${username}`,
        message: JSON.stringify({ code, expiresAt }),
        type: "OTP_PENDING",
        priority: "HIGH",
        isRead: "false",
    });
}

async function getOtpFromDb(username: string): Promise<{ code: string; expiresAt: number } | null> {
    const user = await storage.getUserByUsername(username);
    if (!user) return null;

    const [row] = await db
        .select()
        .from(notificationsTable)
        .where(
            and(
                eq(notificationsTable.userId, user.id as any),
                eq(notificationsTable.type, "OTP_PENDING"),
            )
        );

    if (!row) return null;

    try {
        return JSON.parse(row.message) as { code: string; expiresAt: number };
    } catch {
        return null;
    }
}

async function deleteOtpFromDb(username: string) {
    const user = await storage.getUserByUsername(username);
    if (!user) return;

    await db.delete(notificationsTable).where(
        and(
            eq(notificationsTable.userId, user.id as any),
            eq(notificationsTable.type, "OTP_PENDING"),
        )
    );
}

export function registerAuthRoutes(app: Express) {
    app.post("/api/auth/login", async (req: Request, res: Response) => {
        try {
            const { username, password } = req.body as { username: string; password: string };
            if (!username || !password) {
                return res.status(400).json({ message: "Missing credentials" });
            }

            const user = await storage.getUserByUsername(username);
            if (!user || !verifyPassword(password, user.password)) {
                return res.status(401).json({ message: "Invalid username or password" });
            }

            // If admin, bypass OTP and complete login immediately
            if ((user as any).role === "ADMIN") {
                req.session.userId = user.id;
                req.session.user = {
                    id: user.id,
                    username: user.username,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    role: (user as any).role || "ADMIN",
                };
                return req.session.save(() => res.json(req.session.user));
            }

            // Generate OTP and store in DB (not in-memory, so it survives across serverless invocations)
            const code = Math.floor(100000 + Math.random() * 900000).toString();
            const ttlMs = 15 * 60 * 1000; // 15 minutes
            await storeOtpInDb(user.username, code, Date.now() + ttlMs);

            // Find an admin user to notify
            const [admin] = await db.select().from(usersTable).where(eq(usersTable.role, "ADMIN"));
            if (admin) {
                try {
                    await storage.createNotification({
                        userId: admin.id as any,
                        title: `OTP for ${user.username}`,
                        message: `Login OTP: ${code} (expires in 15 minutes)`,
                        type: "OTP",
                        priority: "HIGH",
                    } as any);

                    // Fire-and-forget email
                    EmailService.send({
                        to: admin.email,
                        subject: `OTP for ${user.username}`,
                        text: `Login OTP: ${code} (expires in 15 minutes)`,
                        html: `<p>Login OTP: <b>${code}</b></p><p>Expires in 15 minutes.</p>`,
                    }).catch(() => { /* ignore email failure */ });
                } catch {
                    // noop if notification fails
                }
            }

            // Respond that OTP is required
            res.json({ requireOtp: true, message: "OTP sent to admin. Contact admin to proceed." });
        } catch (err: any) {
            console.error("Login error:", err);
            res.status(500).json({ message: "Login failed", error: err?.message });
        }
    });

    app.post("/api/auth/otp/verify", async (req: Request, res: Response) => {
        try {
            const { username, code } = req.body as { username: string; code: string };
            if (!username || !code) return res.status(400).json({ message: "Missing OTP verification data" });

            const entry = await getOtpFromDb(username);
            if (!entry) return res.status(401).json({ message: "OTP not found. Please login again." });
            if (Date.now() > entry.expiresAt) {
                await deleteOtpFromDb(username);
                return res.status(401).json({ message: "OTP expired. Please login again." });
            }
            if (entry.code !== code) return res.status(401).json({ message: "Invalid OTP" });

            const user = await storage.getUserByUsername(username);
            if (!user) return res.status(401).json({ message: "User not found" });

            // Complete login
            req.session.userId = user.id;
            req.session.user = {
                id: user.id,
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                phone: user.phone || "",
                role: (user as any).role || "USER",
            };

            await deleteOtpFromDb(username);
            req.session.save(() => res.json(req.session.user));
        } catch (err: any) {
            console.error("OTP verify error:", err);
            res.status(500).json({ message: "OTP verification failed", error: err?.message });
        }
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
    const role = (req.session.user as any)?.role;
    if (!role || role !== "ADMIN") {
        return res.status(403).json({ message: "Forbidden: Admins only" });
    }
    next();
}
