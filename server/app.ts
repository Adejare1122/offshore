import express, { type Express, type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupSession, registerAuthRoutes } from "./auth";
import { log } from "./vite";
import dotenv from "dotenv";
import type { Server } from "http";

dotenv.config();

let initializedApp: { app: Express; server: Server } | null = null;

export async function createApp(): Promise<{ app: Express; server: Server }> {
  if (initializedApp) {
    return initializedApp;
  }

  const app = express();
  app.set("trust proxy", 1);
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  setupSession(app);

  app.use((req, res, next) => {
    const start = Date.now();
    const path = req.path;
    let capturedJsonResponse: Record<string, any> | undefined = undefined;

    const originalResJson = res.json;
    res.json = function (bodyJson, ...args) {
      capturedJsonResponse = bodyJson;
      return originalResJson.apply(res, [bodyJson, ...args]);
    };

    res.on("finish", () => {
      const duration = Date.now() - start;
      if (path.startsWith("/api")) {
        let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
        if (capturedJsonResponse) {
          logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
        }

        if (logLine.length > 80) {
          logLine = logLine.slice(0, 79) + "…";
        }

        log(logLine);
      }
    });

    next();
  });

  const server = await registerRoutes(app);
  await registerAuthRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
  });

  initializedApp = { app, server };
  return initializedApp;
}
