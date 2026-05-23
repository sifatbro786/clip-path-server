// routes/contact.js
import express from "express";
import { handleUpload } from "../middleware/upload.js";
import { authMiddleware, requireSuperAdmin } from "../middleware/auth.js";
import {
    submitContact,
    getContactStats,
    getPageContent,
    updatePageContent,
} from "../controllers/contactController.js";

const router = express.Router();

// ── Form submission ───────────────────────────────────────────────────────────
// POST /api/contact/submit  — public
router.post("/submit", handleUpload("files"), submitContact);

// ── Dashboard stats ───────────────────────────────────────────────────────────
// GET /api/contact/stats  — super admin only
router.get("/stats", authMiddleware, requireSuperAdmin, getContactStats);

// ── Page content (CMS) ────────────────────────────────────────────────────────
// GET  /api/contact/page-content  — public (React fetches on mount)
router.get("/page-content", getPageContent);

// PUT  /api/contact/page-content  — super admin only
router.put("/page-content", authMiddleware, requireSuperAdmin, updatePageContent);

export default router;
