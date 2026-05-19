// routes/home.js
import express from "express";
import Home from "../models/Home.js";
import { authMiddleware } from "../middleware/auth.js";
import {
    uploadHeroImage,
    uploadCompanyLogos,
    uploadServiceIcon,
    uploadDifferenceImages,
} from "../config/cloudinary.js";

const router = express.Router();

// ─────────────────────────────────────────────────────────────────────────────
// HELPER: get or create the single Home document
// ─────────────────────────────────────────────────────────────────────────────
async function getHome() {
    let home = await Home.findOne();
    if (!home) home = await Home.create({});
    return home;
}

// ═════════════════════════════════════════════════════════════════════════════
// PUBLIC — GET full home data (used by the frontend)
// GET /api/home
// ═════════════════════════════════════════════════════════════════════════════
router.get("/", async (req, res) => {
    try {
        const home = await getHome();
        res.json({ success: true, data: home });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// ═════════════════════════════════════════════════════════════════════════════
//  HERO SECTION
// ═════════════════════════════════════════════════════════════════════════════

/**
 * PUT /api/home/hero
 * Body (multipart/form-data):
 *   image   — file (required when updating image)
 *   eyebrow — string
 *   heading — string
 *   paragraph — string
 *
 * Image is ALWAYS uploaded via Cloudinary. If you only want to update text,
 * omit the `image` field — the existing Cloudinary URL is kept.
 */
router.put(
    "/hero",
    authMiddleware,
    (req, res, next) => {
        uploadHeroImage(req, res, (err) => {
            if (err) return res.status(400).json({ success: false, error: err.message });
            next();
        });
    },
    async (req, res) => {
        try {
            const home = await getHome();

            const { eyebrow, heading, paragraph } = req.body;

            if (eyebrow !== undefined) home.hero.eyebrow = eyebrow;
            if (heading !== undefined) home.hero.heading = heading;
            if (paragraph !== undefined) home.hero.paragraph = paragraph;

            // Image upload — Cloudinary URL from multer-storage-cloudinary
            if (req.file) {
                home.hero.image = req.file.path; // Cloudinary delivers the URL via .path
            } else if (!home.hero.image) {
                return res.status(400).json({ success: false, error: "Hero image is required." });
            }

            await home.save();
            res.json({ success: true, data: home.hero });
        } catch (err) {
            res.status(500).json({ success: false, error: err.message });
        }
    },
);

// ═════════════════════════════════════════════════════════════════════════════
//  COMPANY SECTION
// ═════════════════════════════════════════════════════════════════════════════

/**
 * PUT /api/home/company/meta
 * Body (application/json): { title, heading }
 */
router.put("/company/meta", authMiddleware, async (req, res) => {
    try {
        const home = await getHome();
        const { title, heading } = req.body;

        if (title !== undefined) home.company.title = title;
        if (heading !== undefined) home.company.heading = heading;

        await home.save();
        res.json({
            success: true,
            data: { title: home.company.title, heading: home.company.heading },
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

/**
 * POST /api/home/company/logos
 * Body (multipart/form-data):
 *   logos[] — files (1–20 images)
 *
 * Appends new logos to the existing list.
 */
router.post(
    "/company/logos",
    authMiddleware,
    (req, res, next) => {
        uploadCompanyLogos(req, res, (err) => {
            if (err) return res.status(400).json({ success: false, error: err.message });
            next();
        });
    },
    async (req, res) => {
        try {
            if (!req.files || req.files.length === 0) {
                return res
                    .status(400)
                    .json({ success: false, error: "At least one logo image is required." });
            }

            const home = await getHome();
            const newLogos = req.files.map((f) => ({ image: f.path }));
            home.company.logos.push(...newLogos);

            await home.save();
            res.json({ success: true, data: home.company.logos });
        } catch (err) {
            res.status(500).json({ success: false, error: err.message });
        }
    },
);

/**
 * DELETE /api/home/company/logos/:logoId
 * Removes a single logo by its _id.
 */
router.delete("/company/logos/:logoId", authMiddleware, async (req, res) => {
    try {
        const home = await getHome();
        const before = home.company.logos.length;
        home.company.logos = home.company.logos.filter(
            (l) => l._id.toString() !== req.params.logoId,
        );

        if (home.company.logos.length === before) {
            return res.status(404).json({ success: false, error: "Logo not found." });
        }

        await home.save();
        res.json({ success: true, data: home.company.logos });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// ═════════════════════════════════════════════════════════════════════════════
//  SERVICES SECTION
// ═════════════════════════════════════════════════════════════════════════════

/**
 * PUT /api/home/services/meta
 * Body (application/json): { sectionTitle, sectionHeading }
 */
router.put("/services/meta", authMiddleware, async (req, res) => {
    try {
        const home = await getHome();
        const { sectionTitle, sectionHeading } = req.body;

        if (sectionTitle !== undefined) home.services.sectionTitle = sectionTitle;
        if (sectionHeading !== undefined) home.services.sectionHeading = sectionHeading;

        await home.save();
        res.json({
            success: true,
            data: {
                sectionTitle: home.services.sectionTitle,
                sectionHeading: home.services.sectionHeading,
            },
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

/**
 * POST /api/home/services
 * Body (multipart/form-data):
 *   icon        — file (required)
 *   title       — string (required)
 *   description — string (required)
 */
router.post(
    "/services",
    authMiddleware,
    (req, res, next) => {
        uploadServiceIcon(req, res, (err) => {
            if (err) return res.status(400).json({ success: false, error: err.message });
            next();
        });
    },
    async (req, res) => {
        try {
            const { title, description } = req.body;

            if (!title || !description) {
                return res
                    .status(400)
                    .json({ success: false, error: "title and description are required." });
            }
            if (!req.file) {
                return res
                    .status(400)
                    .json({ success: false, error: "Service icon image is required." });
            }

            const home = await getHome();
            home.services.items.push({ title, description, icon: req.file.path });

            await home.save();
            res.status(201).json({ success: true, data: home.services.items });
        } catch (err) {
            res.status(500).json({ success: false, error: err.message });
        }
    },
);

/**
 * PUT /api/home/services/:serviceId
 * Body (multipart/form-data):
 *   icon        — file (optional — only send if changing the icon)
 *   title       — string
 *   description — string
 */
router.put(
    "/services/:serviceId",
    authMiddleware,
    (req, res, next) => {
        uploadServiceIcon(req, res, (err) => {
            if (err) return res.status(400).json({ success: false, error: err.message });
            next();
        });
    },
    async (req, res) => {
        try {
            const home = await getHome();
            const item = home.services.items.id(req.params.serviceId);

            if (!item)
                return res.status(404).json({ success: false, error: "Service item not found." });

            const { title, description } = req.body;
            if (title !== undefined) item.title = title;
            if (description !== undefined) item.description = description;
            if (req.file) item.icon = req.file.path;

            await home.save();
            res.json({ success: true, data: home.services.items });
        } catch (err) {
            res.status(500).json({ success: false, error: err.message });
        }
    },
);

/**
 * DELETE /api/home/services/:serviceId
 */
router.delete("/services/:serviceId", authMiddleware, async (req, res) => {
    try {
        const home = await getHome();
        const before = home.services.items.length;
        home.services.items = home.services.items.filter(
            (s) => s._id.toString() !== req.params.serviceId,
        );

        if (home.services.items.length === before) {
            return res.status(404).json({ success: false, error: "Service item not found." });
        }

        await home.save();
        res.json({ success: true, data: home.services.items });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// ═════════════════════════════════════════════════════════════════════════════
//  DIFFERENCE SECTION
// ═════════════════════════════════════════════════════════════════════════════

/**
 * PUT /api/home/difference/meta
 * Body (application/json): { sectionTitle, sectionHeading }
 */
router.put("/difference/meta", authMiddleware, async (req, res) => {
    try {
        const home = await getHome();
        const { sectionTitle, sectionHeading } = req.body;

        if (sectionTitle !== undefined) home.difference.sectionTitle = sectionTitle;
        if (sectionHeading !== undefined) home.difference.sectionHeading = sectionHeading;

        await home.save();
        res.json({
            success: true,
            data: {
                sectionTitle: home.difference.sectionTitle,
                sectionHeading: home.difference.sectionHeading,
            },
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

/**
 * POST /api/home/difference
 * Body (multipart/form-data):
 *   beforeImage — file (required)
 *   afterImage  — file (required)
 *   title       — string (required)
 *   description — string (required)
 *   builtFor    — JSON array string, e.g. '["eCommerce","Brands"]'
 *   left        — boolean string ("true" | "false")
 */
router.post(
    "/difference",
    authMiddleware,
    (req, res, next) => {
        uploadDifferenceImages(req, res, (err) => {
            if (err) return res.status(400).json({ success: false, error: err.message });
            next();
        });
    },
    async (req, res) => {
        try {
            const { title, description, builtFor, left } = req.body;

            if (!title || !description) {
                return res
                    .status(400)
                    .json({ success: false, error: "title and description are required." });
            }
            if (!req.files?.beforeImage?.[0] || !req.files?.afterImage?.[0]) {
                return res.status(400).json({
                    success: false,
                    error: "Both beforeImage and afterImage are required.",
                });
            }

            const home = await getHome();
            home.difference.items.push({
                title,
                description,
                builtFor: builtFor ? JSON.parse(builtFor) : [],
                left: left !== undefined ? left === "true" : true,
                beforeImage: req.files.beforeImage[0].path,
                afterImage: req.files.afterImage[0].path,
            });

            await home.save();
            res.status(201).json({ success: true, data: home.difference.items });
        } catch (err) {
            res.status(500).json({ success: false, error: err.message });
        }
    },
);

/**
 * PUT /api/home/difference/:itemId
 * Body (multipart/form-data):
 *   beforeImage — file (optional)
 *   afterImage  — file (optional)
 *   title, description, builtFor, left — all optional
 */
router.put(
    "/difference/:itemId",
    authMiddleware,
    (req, res, next) => {
        uploadDifferenceImages(req, res, (err) => {
            if (err) return res.status(400).json({ success: false, error: err.message });
            next();
        });
    },
    async (req, res) => {
        try {
            const home = await getHome();
            const item = home.difference.items.id(req.params.itemId);

            if (!item)
                return res
                    .status(404)
                    .json({ success: false, error: "Difference item not found." });

            const { title, description, builtFor, left } = req.body;
            if (title !== undefined) item.title = title;
            if (description !== undefined) item.description = description;
            if (builtFor !== undefined) item.builtFor = JSON.parse(builtFor);
            if (left !== undefined) item.left = left === "true";

            if (req.files?.beforeImage?.[0]) item.beforeImage = req.files.beforeImage[0].path;
            if (req.files?.afterImage?.[0]) item.afterImage = req.files.afterImage[0].path;

            await home.save();
            res.json({ success: true, data: home.difference.items });
        } catch (err) {
            res.status(500).json({ success: false, error: err.message });
        }
    },
);

/**
 * DELETE /api/home/difference/:itemId
 */
router.delete("/difference/:itemId", authMiddleware, async (req, res) => {
    try {
        const home = await getHome();
        const before = home.difference.items.length;
        home.difference.items = home.difference.items.filter(
            (d) => d._id.toString() !== req.params.itemId,
        );

        if (home.difference.items.length === before) {
            return res.status(404).json({ success: false, error: "Difference item not found." });
        }

        await home.save();
        res.json({ success: true, data: home.difference.items });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// ═════════════════════════════════════════════════════════════════════════════
//  FAQ SECTION
// ═════════════════════════════════════════════════════════════════════════════

/**
 * PUT /api/home/faq/meta
 * Body (application/json): { sectionTitle, sectionHeading }
 */
router.put("/faq/meta", authMiddleware, async (req, res) => {
    try {
        const home = await getHome();
        const { sectionTitle, sectionHeading } = req.body;

        if (sectionTitle !== undefined) home.faq.sectionTitle = sectionTitle;
        if (sectionHeading !== undefined) home.faq.sectionHeading = sectionHeading;

        await home.save();
        res.json({
            success: true,
            data: { sectionTitle: home.faq.sectionTitle, sectionHeading: home.faq.sectionHeading },
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

/**
 * POST /api/home/faq
 * Body (application/json): { question, answer }
 */
router.post("/faq", authMiddleware, async (req, res) => {
    try {
        const { question, answer } = req.body;

        if (!question || !answer) {
            return res
                .status(400)
                .json({ success: false, error: "question and answer are required." });
        }

        const home = await getHome();
        home.faq.items.push({ question, answer });

        await home.save();
        res.status(201).json({ success: true, data: home.faq.items });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

/**
 * PUT /api/home/faq/:faqId
 * Body (application/json): { question, answer }
 */
router.put("/faq/:faqId", authMiddleware, async (req, res) => {
    try {
        const home = await getHome();
        const item = home.faq.items.id(req.params.faqId);

        if (!item) return res.status(404).json({ success: false, error: "FAQ item not found." });

        const { question, answer } = req.body;
        if (question !== undefined) item.question = question;
        if (answer !== undefined) item.answer = answer;

        await home.save();
        res.json({ success: true, data: home.faq.items });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

/**
 * DELETE /api/home/faq/:faqId
 */
router.delete("/faq/:faqId", authMiddleware, async (req, res) => {
    try {
        const home = await getHome();
        const before = home.faq.items.length;
        home.faq.items = home.faq.items.filter((f) => f._id.toString() !== req.params.faqId);

        if (home.faq.items.length === before) {
            return res.status(404).json({ success: false, error: "FAQ item not found." });
        }

        await home.save();
        res.json({ success: true, data: home.faq.items });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

export default router;
