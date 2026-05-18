// server.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import cron from "node-cron";
import axios from "axios";
import fs from "fs";

// ── Routes ───────────────────────────────────────────────────────────────────
import authRoutes from "./routes/auth.js";
import homeRoutes from "./routes/home.js";
// future: import servicesRoutes from "./routes/services.js";
// future: import aboutRoutes    from "./routes/about.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

dotenv.config();
const app = express();

const allowedOrigins = [
    "http://localhost:3000",
    "http://localhost:3001",
    "https://rapid-clipping-path.netlify.app",
];

app.use(
    cors({
        origin: (origin, callback) => {
            if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
            console.log("Blocked origin:", origin);
            return callback(null, true);
        },
        credentials: true,
    })
);

const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ── Mount routes ─────────────────────────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/home", homeRoutes);
// future: app.use("/api/services", servicesRoutes);
// future: app.use("/api/about",    aboutRoutes);

// ── Health check ─────────────────────────────────────────────────────────────
app.get("/api/health", (req, res) => {
    res.status(200).json({ status: "OK", uptime: process.uptime(), timestamp: new Date() });
});

// ── Start server ─────────────────────────────────────────────────────────────
const startServer = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("MongoDB connected successfully");

        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    } catch (err) {
        console.error("MongoDB connection error:", err);
        process.exit(1);
    }
};

// ── Cron: keep server alive ───────────────────────────────────────────────────
cron.schedule("*/10 * * * *", async () => {
    try {
        const res = await axios.get("http://localhost:5000/api/health");
        console.log("Ping success:", res.data.status);
    } catch (error) {
        console.error("Ping failed:", error.message);
    }
});

startServer();
