import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { db } from "./config/database.js";

// Import routes
import analyticsRoutes from "./routes/analytics.js";
import ordersRoutes from "./routes/orders.js";
import customersRoutes from "./routes/customers.js";
import productsRoutes from "./routes/products.js";
import reportsRoutes from "./routes/reports.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan("combined"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// === MongoDB connection middleware ===
let isDbConnected = false;
app.use(async (req, res, next) => {
  if (!isDbConnected) {
    await db.connect(process.env.MONGO_URI);
    isDbConnected = true;
    console.log("✅ MongoDB connected");
  }
  next();
});

// === API Routes ===
app.use("/api/analytics", analyticsRoutes);
app.use("/api/orders", ordersRoutes);
app.use("/api/customers", customersRoutes);
app.use("/api/products", productsRoutes);
app.use("/api/reports", reportsRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "API running",
    timestamp: new Date(),
  });
});

// Serve React frontend (Vite build)
const frontendBuildPath = path.join(__dirname, "../dist");
app.use(express.static(frontendBuildPath));

// SPA fallback for frontend routes
app.get("*", (req, res) => {
  res.sendFile(path.join(frontendBuildPath, "index.html"));
});

// === Local dev server ===
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Local server running at http://localhost:${PORT}`);
  });
}

// === Export app for Vercel ===
export default app;
