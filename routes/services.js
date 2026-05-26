import express from "express";
import { authMiddleware } from "../middleware/auth.js";
import {
    getAllServices,
    getSecondaryServices,
    getServiceBySlug,
    getAllServicesAdmin,
    createService,
    updateService,
    deleteService,
    // Samples
    addSample,
    updateSample,
    deleteSample,
    // Process
    addProcessStep,
    updateProcessStep,
    deleteProcessStep,
    // Pricing
    addPricingTier,
    updatePricingTier,
    deletePricingTier,
    // Who We Work
    addWhoWeWorkCard,
    updateWhoWeWorkCard,
    deleteWhoWeWorkCard,
    updateWhoWeWorkSection,
    // FAQ
    addServiceFaq,
    updateServiceFaq,
    deleteServiceFaq,
    // Related
    updateRelatedServices,
    // Stats
    updateStats,
    // Retoucher
    updateRetoucher,
    // Testimonials
    addTestimonial,
    updateTestimonial,
    deleteTestimonial,
} from "../controllers/serviceController.js";

import {
    uploadServiceCardImage,
    uploadServiceSampleImages,
    uploadRetoucherImage,
} from "../config/cloudinary.js";

const router = express.Router();

// ============================================
// PUBLIC ROUTES
// ============================================
router.get("/", getAllServices);
router.get("/secondary", getSecondaryServices);
router.get("/:slug", getServiceBySlug);

// ============================================
// ADMIN - SERVICE CRUD
// ============================================
router.get("/admin/all", authMiddleware, getAllServicesAdmin);
router.post("/", authMiddleware, uploadServiceCardImage, createService);
router.put("/:slug", authMiddleware, uploadServiceCardImage, updateService);
router.delete("/:slug", authMiddleware, deleteService);

// ============================================
// SAMPLES
// ============================================
router.post("/:slug/samples", authMiddleware, uploadServiceSampleImages, addSample);
router.put("/:slug/samples/:sampleId", authMiddleware, uploadServiceSampleImages, updateSample);
router.delete("/:slug/samples/:sampleId", authMiddleware, deleteSample);

// ============================================
// PROCESS STEPS
// ============================================
router.post("/:slug/process/steps", authMiddleware, addProcessStep);
router.put("/:slug/process/steps/:stepId", authMiddleware, updateProcessStep);
router.delete("/:slug/process/steps/:stepId", authMiddleware, deleteProcessStep);

// ============================================
// PRICING TIERS
// ============================================
router.post("/:slug/pricing/tiers", authMiddleware, addPricingTier);
router.put("/:slug/pricing/tiers/:tierId", authMiddleware, updatePricingTier);
router.delete("/:slug/pricing/tiers/:tierId", authMiddleware, deletePricingTier);

// ============================================
// WHO WE WORK WITH
// ============================================
router.put("/:slug/who-we-work", authMiddleware, updateWhoWeWorkSection);
router.post("/:slug/who-we-work/cards", authMiddleware, addWhoWeWorkCard);
router.put("/:slug/who-we-work/cards/:cardId", authMiddleware, updateWhoWeWorkCard);
router.delete("/:slug/who-we-work/cards/:cardId", authMiddleware, deleteWhoWeWorkCard);

// ============================================
// FAQ
// ============================================
router.post("/:slug/faq", authMiddleware, addServiceFaq);
router.put("/:slug/faq/:itemId", authMiddleware, updateServiceFaq);
router.delete("/:slug/faq/:itemId", authMiddleware, deleteServiceFaq);

// ============================================
// RELATED SERVICES
// ============================================
router.put("/:slug/related", authMiddleware, updateRelatedServices);

// ============================================
// STATS
// ============================================
router.put("/:slug/stats", authMiddleware, updateStats);

// ============================================
// RETOUCHER
// ============================================
router.put("/:slug/retoucher", authMiddleware, uploadRetoucherImage, updateRetoucher);

// ============================================
// TESTIMONIALS
// ============================================
router.post("/:slug/testimonials", authMiddleware, addTestimonial);
router.put("/:slug/testimonials/:testimonialId", authMiddleware, updateTestimonial);
router.delete("/:slug/testimonials/:testimonialId", authMiddleware, deleteTestimonial);

export default router;
