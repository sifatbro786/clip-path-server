// routes/portfolio.js
import express from "express";
import {
    getPortfolioData,
    updateSection,
    updateFeaturedCase,
    addWorkExample,
    updateWorkExample,
    deleteWorkExample,
    addCaseStudy,
    updateCaseStudy,
    deleteCaseStudy,
    addTestimonial,
    updateTestimonial,
    deleteTestimonial,
} from "../controllers/portfolioController.js";
import { authMiddleware } from "../middleware/auth.js";
import { uploadPortfolioImage } from "../config/cloudinary.js";

const router = express.Router();

// Public routes
router.get("/active", getPortfolioData);

// Protected routes
router.use(authMiddleware);

// Section updates (without image)
router.put("/section/:section", updateSection);

// Featured Case - আলাদা route image upload সহ
router.put("/featured-case", uploadPortfolioImage, updateFeaturedCase); // নতুন route

// Work Examples
router.post("/work-examples", uploadPortfolioImage, addWorkExample);
router.put("/work-examples/:exampleId", uploadPortfolioImage, updateWorkExample);
router.delete("/work-examples/:exampleId", deleteWorkExample);

// Case Studies
router.post("/case-studies", uploadPortfolioImage, addCaseStudy);
router.put("/case-studies/:caseId", uploadPortfolioImage, updateCaseStudy);
router.delete("/case-studies/:caseId", deleteCaseStudy);

// Testimonials
router.post("/testimonials", addTestimonial);
router.put("/testimonials/:testimonialId", updateTestimonial);
router.delete("/testimonials/:testimonialId", deleteTestimonial);

export default router;
