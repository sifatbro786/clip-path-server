// routes/booking.js
import express from "express";
import {
    getBooking,
    updateBooking,
    updateHero,
    updateHeroImage,
    updateWhatWeCover,
    updateStep,
    deleteStep,
    updateWhoYouSpeakWith,
    updateFounderImage,
    updateExpectation,
    deleteExpectation,
    updateDoYouNeedCall,
    updateDecisionPath,
    deleteDecisionPath,
    updateFAQ,
    updateFaqItem,
    deleteFaqItem,
} from "../controllers/bookingController.js";
import { authMiddleware, requireSuperAdmin } from "../middleware/auth.js";
import { uploadPortfolioImage } from "../config/cloudinary.js";

const router = express.Router();

// Public routes
router.get("/active", getBooking);

// Protected routes (require authentication)
router.use(authMiddleware);
router.use(requireSuperAdmin); // Only super admin can modify booking

// Full booking update
router.put("/", updateBooking);

// Hero section routes
router.put("/hero", updateHero);
router.post("/hero/image", uploadPortfolioImage, updateHeroImage);

// What We Cover section routes
router.put("/what-we-cover", updateWhatWeCover);
router.put("/what-we-cover/step/:stepIndex", updateStep);
router.delete("/what-we-cover/step/:stepIndex", deleteStep);

// Who You Speak With section routes
router.put("/who-you-speak-with", updateWhoYouSpeakWith);
router.post("/who-you-speak-with/image", uploadPortfolioImage, updateFounderImage);
router.put("/who-you-speak-with/expectation/:expectationIndex", updateExpectation);
router.delete("/who-you-speak-with/expectation/:expectationIndex", deleteExpectation);

// Do You Need Call section routes
router.put("/do-you-need-call", updateDoYouNeedCall);
router.put("/do-you-need-call/decision-path/:pathType", updateDecisionPath);
router.delete("/do-you-need-call/decision-path/:pathType", deleteDecisionPath);

// FAQ section routes
router.put("/faq", updateFAQ);
router.put("/faq/item/:faqIndex", updateFaqItem);
router.delete("/faq/item/:faqIndex", deleteFaqItem);

export default router;
