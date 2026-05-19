// routes/about.js
import express from "express";
import {
    getAboutData,
    updateHero,
    updateOurStory,
    updateChooseSectionMeta,
    addStat,
    updateStat,
    deleteStat,
    reorderStats,
    updateWorkSectionMeta,
    addPrinciple,
    updatePrinciple,
    deletePrinciple,
    reorderPrinciples,
    updateWhereWeWorkMeta,
    addLocation,
    updateLocation,
    deleteLocation,
    updateQuote,
    addFounder,
    updateFounder,
    deleteFounder,
    updateFoundersMeta,
} from "../controllers/aboutController.js";
import { authMiddleware } from "../middleware/auth.js";
import { uploadFounderImage } from "../config/cloudinary.js";

const router = express.Router();

// Public routes
router.get("/", getAboutData);

// Protected routes (require authentication)
router.use(authMiddleware);

// Hero section
router.put("/hero", updateHero);

// Our Story section
router.put("/our-story", updateOurStory);

// Choose section (Stats)
router.put("/choose/meta", updateChooseSectionMeta);
router.post("/choose/stats", addStat);
router.put("/choose/stats/:statId", updateStat);
router.delete("/choose/stats/:statId", deleteStat);
router.post("/choose/stats/reorder", reorderStats);

// Work section (Principles)
router.put("/work/meta", updateWorkSectionMeta);
router.post("/work/principles", addPrinciple);
router.put("/work/principles/:principleId", updatePrinciple);
router.delete("/work/principles/:principleId", deletePrinciple);
router.post("/work/principles/reorder", reorderPrinciples);

// Where We Work section
router.put("/where-we-work/meta", updateWhereWeWorkMeta);
router.post("/where-we-work/locations", addLocation);
router.put("/where-we-work/locations/:locationId", updateLocation);
router.delete("/where-we-work/locations/:locationId", deleteLocation);

// Quote section
router.put("/quote", updateQuote);

// Founders section
router.put("/founders/meta", updateFoundersMeta);
router.post("/founders", uploadFounderImage, addFounder);
router.put("/founders/:founderId", uploadFounderImage, updateFounder);
router.delete("/founders/:founderId", deleteFounder);

export default router;
