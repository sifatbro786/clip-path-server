// routes/pricing.js
import express from "express";
import {
    getPricingData,
    updateHero,
    updatePerImageRatesMeta,
    addPerImageRate,
    updatePerImageRate,
    deletePerImageRate,
    addTierDefinition,
    updateTierDefinition,
    deleteTierDefinition,
    updateRecentWorkMeta,
    addSample,
    updateSample,
    deleteSample,
    updateMonthlyPackagesMeta,
    addPlan,
    updatePlan,
    deletePlan,
    updateRetouchingMeta,
    addRetouchingService,
    updateRetouchingService,
    deleteRetouchingService,
    updateVolumeDiscountsMeta,
    addVolumeTier,
    updateVolumeTier,
    deleteVolumeTier,
    updateAlwaysIncludedMeta,
    addFeature,
    updateFeature,
    deleteFeature,
    updateFaqMeta,
    addFaq,
    updateFaq,
    deleteFaq,
} from "../controllers/pricingController.js";
import { authMiddleware } from "../middleware/auth.js";
import { uploadSampleImages } from "../config/cloudinary.js";

const router = express.Router();

// Public routes
router.get("/", getPricingData);

// Protected routes (require authentication)
router.use(authMiddleware);

// Hero section
router.put("/hero", updateHero);

// Per-Image Rates
router.put("/per-image/meta", updatePerImageRatesMeta);
router.post("/per-image/rates", addPerImageRate);
router.put("/per-image/rates/:rateId", updatePerImageRate);
router.delete("/per-image/rates/:rateId", deletePerImageRate);
router.post("/per-image/tiers", addTierDefinition);
router.put("/per-image/tiers/:tierId", updateTierDefinition);
router.delete("/per-image/tiers/:tierId", deleteTierDefinition);

// Recent Work
router.put("/recent-work/meta", updateRecentWorkMeta);
router.post("/recent-work/samples", uploadSampleImages, addSample);
router.put("/recent-work/samples/:sampleId", uploadSampleImages, updateSample);
router.delete("/recent-work/samples/:sampleId", deleteSample);

// Monthly Packages
router.put("/packages/meta", updateMonthlyPackagesMeta);
router.post("/packages/plans", addPlan);
router.put("/packages/plans/:planId", updatePlan);
router.delete("/packages/plans/:planId", deletePlan);

// Retouching Services
router.put("/retouching/meta", updateRetouchingMeta);
router.post("/retouching/services", addRetouchingService);
router.put("/retouching/services/:serviceId", updateRetouchingService);
router.delete("/retouching/services/:serviceId", deleteRetouchingService);

// Volume Discounts
router.put("/volume/meta", updateVolumeDiscountsMeta);
router.post("/volume/tiers", addVolumeTier);
router.put("/volume/tiers/:tierId", updateVolumeTier);
router.delete("/volume/tiers/:tierId", deleteVolumeTier);

// Always Included Features
router.put("/features/meta", updateAlwaysIncludedMeta);
router.post("/features", addFeature);
router.put("/features/:featureId", updateFeature);
router.delete("/features/:featureId", deleteFeature);

// FAQ
router.put("/faq/meta", updateFaqMeta);
router.post("/faq", addFaq);
router.put("/faq/:faqId", updateFaq);
router.delete("/faq/:faqId", deleteFaq);

export default router;
