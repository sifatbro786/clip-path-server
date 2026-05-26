import express from "express";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { cloudinary } from "../config/cloudinary.js";
import { authMiddleware } from "../middleware/auth.js";

import {
    getServicesPage,
    upsertServicesPage,
    // Hero slides
    addHeroSlide,
    updateHeroSlide,
    deleteHeroSlide,
    // Difference section (FIXED - now for ServicesPage)
    updateDifferenceSection,
    addDifferenceItem,
    updateDifferenceItem,
    deleteDifferenceItem,
    // Use cases
    addUseCase,
    updateUseCase,
    deleteUseCase,
    // Comparison rows
    addComparisonRow,
    updateComparisonRow,
    deleteComparisonRow,
    // Deliverables
    addDeliverable,
    updateDeliverable,
    deleteDeliverable,
    // FAQ
    addFaq,
    updateFaq,
    deleteFaq,
} from "../controllers/servicesPageController.js";
import { uploadDifferenceImages } from "../config/cloudinary.js";

const router = express.Router();

// ── Multer / Cloudinary storage helpers ───────────────────────────────────────
function makeUpload(folder) {
    const storage = new CloudinaryStorage({
        cloudinary,
        params: {
            folder,
            allowed_formats: ["jpg", "jpeg", "png", "webp"],
            transformation: [{ width: 2000, height: 2000, crop: "limit", quality: "auto" }],
        },
    });
    return multer({ storage });
}

const uploadHero = makeUpload("services-page/hero");

// ─────────────────────────────────────────────────────────────────────────────
//  PUBLIC
// ─────────────────────────────────────────────────────────────────────────────

// GET  /api/services-page
router.get("/", getServicesPage);

// ─────────────────────────────────────────────────────────────────────────────
//  ADMIN — full page upsert
// ─────────────────────────────────────────────────────────────────────────────

// PUT  /api/services-page
router.put("/", authMiddleware, upsertServicesPage);

// ─────────────────────────────────────────────────────────────────────────────
//  HERO SLIDES
// ─────────────────────────────────────────────────────────────────────────────

// POST  /api/services-page/hero/slides
router.post("/hero/slides", authMiddleware, uploadHero.single("image"), addHeroSlide);

// PUT  /api/services-page/hero/slides/:slideId
router.put("/hero/slides/:slideId", authMiddleware, uploadHero.single("image"), updateHeroSlide);

// DELETE  /api/services-page/hero/slides/:slideId
router.delete("/hero/slides/:slideId", authMiddleware, deleteHeroSlide);

// ============================================
// DIFFERENCE SECTION (FIXED - Now for ServicesPage, no slug)
// ============================================

// Update difference section settings
router.put("/difference", authMiddleware, updateDifferenceSection);

// Add difference item
router.post("/difference", authMiddleware, uploadDifferenceImages, addDifferenceItem);

// Update difference item
router.put("/difference/:itemId", authMiddleware, uploadDifferenceImages, updateDifferenceItem);

// Delete difference item
router.delete("/difference/:itemId", authMiddleware, deleteDifferenceItem);

// ─────────────────────────────────────────────────────────────────────────────
//  USE CASES
// ─────────────────────────────────────────────────────────────────────────────

// POST  /api/services-page/use-cases
router.post("/use-cases", authMiddleware, addUseCase);

// PUT  /api/services-page/use-cases/:itemId
router.put("/use-cases/:itemId", authMiddleware, updateUseCase);

// DELETE  /api/services-page/use-cases/:itemId
router.delete("/use-cases/:itemId", authMiddleware, deleteUseCase);

// ─────────────────────────────────────────────────────────────────────────────
//  COMPARISON ROWS
// ─────────────────────────────────────────────────────────────────────────────

// POST  /api/services-page/comparison/rows
router.post("/comparison/rows", authMiddleware, addComparisonRow);

// PUT  /api/services-page/comparison/rows/:rowId
router.put("/comparison/rows/:rowId", authMiddleware, updateComparisonRow);

// DELETE  /api/services-page/comparison/rows/:rowId
router.delete("/comparison/rows/:rowId", authMiddleware, deleteComparisonRow);

// ─────────────────────────────────────────────────────────────────────────────
//  DELIVERABLES
// ─────────────────────────────────────────────────────────────────────────────

// POST  /api/services-page/deliverables
router.post("/deliverables", authMiddleware, addDeliverable);

// PUT  /api/services-page/deliverables/:itemId
router.put("/deliverables/:itemId", authMiddleware, updateDeliverable);

// DELETE  /api/services-page/deliverables/:itemId
router.delete("/deliverables/:itemId", authMiddleware, deleteDeliverable);

// ─────────────────────────────────────────────────────────────────────────────
//  FAQ
// ─────────────────────────────────────────────────────────────────────────────

// POST  /api/services-page/faq
router.post("/faq", authMiddleware, addFaq);

// PUT  /api/services-page/faq/:itemId
router.put("/faq/:itemId", authMiddleware, updateFaq);

// DELETE  /api/services-page/faq/:itemId
router.delete("/faq/:itemId", authMiddleware, deleteFaq);

export default router;
