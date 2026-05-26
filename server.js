// server.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

// ── Routes ────────────────────────────────────────────────────────────────────
import authRoutes from "./routes/auth.js";
import pageMetaRoutes from "./routes/pageMeta.js";
import homeRoutes from "./routes/home.js";
import aboutRoutes from "./routes/about.js";
import pricingRoutes from "./routes/pricing.js";
import portfolioRoutes from "./routes/portfolio.js";
import bookingRoutes from "./routes/booking.js";
import contactRoutes from "./routes/contact.js";
import servicesPageRoutes from "./routes/servicesPage.js"; // /services page (single doc)
import serviceRoutes from "./routes/services.js"; // /services (collection)

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
    }),
);

app.use(express.json());

// ── Mount routes ──────────────────────────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/page-meta", pageMetaRoutes);
app.use("/api/home", homeRoutes);
app.use("/api/about", aboutRoutes);
app.use("/api/pricing", pricingRoutes);
app.use("/api/portfolio", portfolioRoutes);
app.use("/api/booking", bookingRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/services-page", servicesPageRoutes); // ServicesPage model
app.use("/api/services", serviceRoutes);

// ── Health check ──────────────────────────────────────────────────────────────
app.get("/api/health", (req, res) => {
    res.status(200).json({ status: "OK", uptime: process.uptime(), timestamp: new Date() });
});

// ── Start server ──────────────────────────────────────────────────────────────
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

startServer();
