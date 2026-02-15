import express from "express";
import { createServer } from "http";
import { registerRoutes } from "./routes";
import "dotenv/config";

async function startServer() {
  const app = express();
  const httpServer = createServer(app);

  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  // attach API routes
  await registerRoutes(httpServer, app);
  // SERVE FRONTEND (VITE)
if (process.env.NODE_ENV !== "production") {
  const { setupVite } = await import("./vite");
  await setupVite(httpServer, app);
}


  const port = process.env.PORT || 5000;

  httpServer.listen(port, () => {
    console.log("Server running on http://localhost:" + port);
  });
}

startServer();
