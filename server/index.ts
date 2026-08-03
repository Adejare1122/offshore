import { createApp } from "./app";
import { setupVite, serveStatic } from "./vite";
import { log } from "./logger";

(async () => {
  const { app, server } = await createApp();

  // setup vite in development, static serving in production
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const port = process.env.PORT || 3001;

  server.listen({ port }, () => {
    log(`serving on port http://localhost:${port}`);
  });
})();
