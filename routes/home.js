// routes/home.js
import express from "express";
import { authMiddleware } from "../middleware/auth.js";
import {
    uploadHeroImage,
    uploadCompanyLogos,
} from "../config/cloudinary.js";
import {
    getHomeData,
    updateHero,
    updateCompanyMeta,
    addCompanyLogos,
    deleteCompanyLogo,
    updateFaqMeta,
    addFaq,
    updateFaq,
    deleteFaq,
} from "../controllers/homeController.js";

const router = express.Router();

// ── multer wrapper: converts multer callback errors into a clean middleware ──
const withUpload = (uploadFn) => (req, res, next) =>
    uploadFn(req, res, (err) => {
        if (err) return res.status(400).json({ success: false, error: err.message });
        next();
    });

// ─────────────────────────────────────────────────────────────────────────────
//  PUBLIC
// ─────────────────────────────────────────────────────────────────────────────
router.get("/", getHomeData);

// ─────────────────────────────────────────────────────────────────────────────
//  HERO
// ─────────────────────────────────────────────────────────────────────────────
router.put("/hero", authMiddleware, withUpload(uploadHeroImage), updateHero);

// ─────────────────────────────────────────────────────────────────────────────
//  COMPANY
// ─────────────────────────────────────────────────────────────────────────────
router.put("/company/meta", authMiddleware, updateCompanyMeta);
router.post("/company/logos", authMiddleware, withUpload(uploadCompanyLogos), addCompanyLogos);
router.delete("/company/logos/:logoId", authMiddleware, deleteCompanyLogo);

// ─────────────────────────────────────────────────────────────────────────────
//  FAQ
// ─────────────────────────────────────────────────────────────────────────────
router.put("/faq/meta", authMiddleware, updateFaqMeta);
router.post("/faq", authMiddleware, addFaq);
router.put("/faq/:faqId", authMiddleware, updateFaq);
router.delete("/faq/:faqId", authMiddleware, deleteFaq);

export default router;
