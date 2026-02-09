import express from "express";
import cors from "cors";
import { registerRoutes } from "../server/routes";

const app = express();

app.use(cors({
  origin: [
    "https://sravyavedantham.com",
    "https://www.sravyavedantham.com",
    "http://localhost:5173",
    "http://localhost:3000",
  ],
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Register all API routes on the Express app
// (registerRoutes also creates an HTTP server, but we ignore it —
//  Vercel provides its own HTTP layer for serverless functions)
registerRoutes(app);

export default app;
