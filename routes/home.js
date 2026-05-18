// routes/home.js
import express from "express";

// ── Models ──────────────────────────────────────────────────────────────────
import Stat from "../models/home/Stat.js";
import Service from "../models/home/Service.js";
import DifferenceItem from "../models/home/DifferenceItem.js";
import PricingPlan from "../models/home/PricingPlan.js";
import FAQ from "../models/home/FAQ.js";
import CompanyLogo from "../models/home/CompanyLogo.js";

// ── Controllers ─────────────────────────────────────────────────────────────
import crudFactory from "../controllers/home/crudFactory.js";
import { getHero, upsertHero } from "../controllers/home/heroController.js";

// ── Middleware ───────────────────────────────────────────────────────────────
import { authMiddleware } from "../middleware/auth.js";
import upload from "../middleware/upload.js";

const router = express.Router();

const statCtrl = crudFactory(Stat, "Stat", []); // No images
const serviceCtrl = crudFactory(Service, "Service", "icon"); // Single icon image
const diffCtrl = crudFactory(DifferenceItem, "DifferenceItem", { images: "array" }); // Array of images (before/after)
const pricingCtrl = crudFactory(PricingPlan, "PricingPlan", []); // No images
const faqCtrl = crudFactory(FAQ, "FAQ", []); // No images
const logoCtrl = crudFactory(CompanyLogo, "CompanyLogo", "src"); // Single logo image

// ════════════════════════════════════════════════════════════════════════════
//  PUBLIC ROUTES — Next.js frontend hits these
// ════════════════════════════════════════════════════════════════════════════

router.get("/hero", getHero);

router.get("/stats", statCtrl.getAll);
router.get("/stats/:id", statCtrl.getOne);

router.get("/services", serviceCtrl.getAll);
router.get("/services/:id", serviceCtrl.getOne);

router.get("/differences", diffCtrl.getAll);
router.get("/differences/:id", diffCtrl.getOne);

router.get("/pricing", pricingCtrl.getAll);
router.get("/pricing/:id", pricingCtrl.getOne);

router.get("/faqs", faqCtrl.getAll);
router.get("/faqs/:id", faqCtrl.getOne);

router.get("/logos", logoCtrl.getAll);
router.get("/logos/:id", logoCtrl.getOne);

// ════════════════════════════════════════════════════════════════════════════
//  ADMIN ROUTES — protected, dashboard only
// ════════════════════════════════════════════════════════════════════════════

// Hero (single-document upsert)
router.put("/admin/hero", authMiddleware, upload.single("heroImage"), upsertHero);

// Stats
router.get("/admin/stats", authMiddleware, statCtrl.getAllAdmin);
router.post("/admin/stats", authMiddleware, statCtrl.create);
router.patch("/admin/stats/:id", authMiddleware, statCtrl.update);
router.delete("/admin/stats/:id", authMiddleware, statCtrl.remove);

// Services - single image upload for 'icon'
router.get("/admin/services", authMiddleware, serviceCtrl.getAllAdmin);
router.post("/admin/services", authMiddleware, upload.single("icon"), serviceCtrl.create);
router.patch("/admin/services/:id", authMiddleware, upload.single("icon"), serviceCtrl.update);
router.delete("/admin/services/:id", authMiddleware, serviceCtrl.remove);

// Difference items - multiple images (before/after)
router.get("/admin/differences", authMiddleware, diffCtrl.getAllAdmin);
router.post(
    "/admin/differences",
    authMiddleware,
    upload.fields([{ name: "images", maxCount: 2 }]),
    diffCtrl.create,
);
router.patch(
    "/admin/differences/:id",
    authMiddleware,
    upload.fields([{ name: "images", maxCount: 2 }]),
    diffCtrl.update,
);
router.delete("/admin/differences/:id", authMiddleware, diffCtrl.remove);

// Pricing plans
router.get("/admin/pricing", authMiddleware, pricingCtrl.getAllAdmin);
router.post("/admin/pricing", authMiddleware, pricingCtrl.create);
router.patch("/admin/pricing/:id", authMiddleware, pricingCtrl.update);
router.delete("/admin/pricing/:id", authMiddleware, pricingCtrl.remove);

// FAQs
router.get("/admin/faqs", authMiddleware, faqCtrl.getAllAdmin);
router.post("/admin/faqs", authMiddleware, faqCtrl.create);
router.patch("/admin/faqs/:id", authMiddleware, faqCtrl.update);
router.delete("/admin/faqs/:id", authMiddleware, faqCtrl.remove);

// Company logos - single image upload for 'src'
router.get("/admin/logos", authMiddleware, logoCtrl.getAllAdmin);
router.post("/admin/logos", authMiddleware, upload.single("src"), logoCtrl.create);
router.patch("/admin/logos/:id", authMiddleware, upload.single("src"), logoCtrl.update);
router.delete("/admin/logos/:id", authMiddleware, logoCtrl.remove);

export default router;
