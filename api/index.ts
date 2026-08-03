import { createApp } from "../server/app";

export default async function handler(req: any, res: any) {
  try {
    const { app } = await createApp();
    return app(req, res);
  } catch (error: any) {
    console.error("Vercel Serverless Function Error:", error);
    if (!res.headersSent) {
      res.status(500).json({
        message: "Server Error during function invocation",
        error: error?.message || String(error),
      });
    }
  }
}
