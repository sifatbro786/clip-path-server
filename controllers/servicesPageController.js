import ServicesPage from "../models/Servicespage.js";
import { cloudinary } from "../config/cloudinary.js";

// ── Helper: extract Cloudinary public_id from URL ─────────────────────────────
function getPublicId(url) {
    if (!url) return null;
    const match = url.match(/\/upload\/(?:v\d+\/)?(.+)\.[a-z]+$/i);
    return match ? match[1] : null;
}

async function deleteFromCloudinary(url) {
    const pid = getPublicId(url);
    if (pid) await cloudinary.uploader.destroy(pid).catch(() => {});
}

// ─────────────────────────────────────────────────────────────────────────────
// GET  /api/services-page
// Public — returns the single ServicesPage document
// ─────────────────────────────────────────────────────────────────────────────
export const getServicesPage = async (req, res) => {
    try {
        const page = await ServicesPage.findOne().lean();
        if (!page) {
            // Return empty structure if no data exists
            return res.json({
                hero: { slides: [] },
                difference: {
                    eyebrow: "What Makes Us Different",
                    headingPrimary: "The difference is",
                    headingHighlight: "in the detail.",
                    items: [],
                    isActive: true,
                },
                useCases: {
                    eyebrow: "When you need it",
                    headingPrimary: "Six common",
                    headingItalic: "use cases.",
                    items: [],
                },
                comparison: {
                    eyebrow: "HAND-DRAWN VS. AI",
                    heading: "Why we still draw by hand.",
                    headingItalic: "draw by hand.",
                    subtext: "",
                    rows: [],
                },
                deliverables: {
                    eyebrow: "WHAT YOU GET",
                    headingPrimary: "Every order, the",
                    headingItalic: "same standard.",
                    description: "",
                    items: [],
                },
                faq: {
                    eyebrow: "COMMON QUESTIONS",
                    headingPrimary: "Everything else",
                    headingItalic: "you might ask.",
                    items: [],
                },
            });
        }
        res.json(page);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// PUT  /api/services-page          (admin)
// Upsert the whole ServicesPage document at once
// ─────────────────────────────────────────────────────────────────────────────
export const upsertServicesPage = async (req, res) => {
    try {
        const page = await ServicesPage.findOneAndUpdate({}, req.body, {
            new: true,
            upsert: true,
            runValidators: true,
        });
        res.json({ message: "Services page updated.", page });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// ═══════════════════════════════════════════════════════════════════════════════
//  HERO SLIDES
// ═══════════════════════════════════════════════════════════════════════════════

// POST  /api/services-page/hero/slides
export const addHeroSlide = async (req, res) => {
    try {
        const imageUrl = req.file?.path || req.body.image;
        const slide = { ...req.body, image: imageUrl };

        const page = await ServicesPage.findOneAndUpdate(
            {},
            { $push: { "hero.slides": slide } },
            { new: true, upsert: true },
        );
        res.status(201).json({ message: "Slide added.", slides: page.hero.slides });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// PUT  /api/services-page/hero/slides/:slideId
export const updateHeroSlide = async (req, res) => {
    try {
        const { slideId } = req.params;
        const imageUrl = req.file?.path;

        const update = {};
        const fields = ["tag", "headlinePrimary", "headlineItalic", "sub", "cta", "ctaTo", "order"];
        fields.forEach((f) => {
            if (req.body[f] !== undefined) update[`hero.slides.$.${f}`] = req.body[f];
        });
        if (imageUrl) {
            const page = await ServicesPage.findOne(
                { "hero.slides._id": slideId },
                { "hero.slides.$": 1 },
            );
            if (page?.hero?.slides?.[0]?.image)
                await deleteFromCloudinary(page.hero.slides[0].image);
            update["hero.slides.$.image"] = imageUrl;
        }

        const updated = await ServicesPage.findOneAndUpdate(
            { "hero.slides._id": slideId },
            { $set: update },
            { new: true },
        );
        if (!updated) return res.status(404).json({ error: "Slide not found." });
        res.json({ message: "Slide updated.", slides: updated.hero.slides });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// DELETE  /api/services-page/hero/slides/:slideId
export const deleteHeroSlide = async (req, res) => {
    try {
        const { slideId } = req.params;

        const page = await ServicesPage.findOne(
            { "hero.slides._id": slideId },
            { "hero.slides.$": 1 },
        );
        if (page?.hero?.slides?.[0]?.image) await deleteFromCloudinary(page.hero.slides[0].image);

        const updated = await ServicesPage.findOneAndUpdate(
            {},
            { $pull: { "hero.slides": { _id: slideId } } },
            { new: true },
        );
        res.json({ message: "Slide deleted.", slides: updated.hero.slides });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ============================================
// DIFFERENCE SECTION (FIXED - Using ServicesPage model)
// ============================================

// PUT /api/services-page/difference - Update section settings
export const updateDifferenceSection = async (req, res) => {
    try {
        const update = {};
        if (req.body.eyebrow !== undefined) update["difference.eyebrow"] = req.body.eyebrow;
        if (req.body.headingPrimary !== undefined)
            update["difference.headingPrimary"] = req.body.headingPrimary;
        if (req.body.headingHighlight !== undefined)
            update["difference.headingHighlight"] = req.body.headingHighlight;
        if (req.body.isActive !== undefined) update["difference.isActive"] = req.body.isActive;

        const updated = await ServicesPage.findOneAndUpdate(
            {},
            { $set: update },
            { new: true, upsert: true },
        );
        res.json({ message: "Difference section updated.", difference: updated.difference });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// POST /api/services-page/difference - Add difference item
export const addDifferenceItem = async (req, res) => {
    try {
        const beforeImage = req.files?.beforeImage?.[0]?.path || req.body.beforeImage;
        const afterImage = req.files?.afterImage?.[0]?.path || req.body.afterImage;

        let builtFor = req.body.builtFor;
        if (typeof builtFor === "string") {
            try {
                builtFor = JSON.parse(builtFor);
            } catch {
                builtFor = builtFor.split(",").map((s) => s.trim());
            }
        }

        const item = {
            ...req.body,
            beforeImage,
            afterImage,
            builtFor: builtFor || [],
        };

        const page = await ServicesPage.findOneAndUpdate(
            {},
            { $push: { "difference.items": item } },
            { new: true, upsert: true },
        );
        res.status(201).json({
            message: "Difference item added.",
            items: page.difference.items,
        });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// PUT /api/services-page/difference/:itemId - Update difference item
export const updateDifferenceItem = async (req, res) => {
    try {
        const { itemId } = req.params;
        const update = {};

        if (req.files?.beforeImage?.[0]) {
            const page = await ServicesPage.findOne(
                { "difference.items._id": itemId },
                { "difference.items.$": 1 },
            );
            await deleteFromCloudinary(page?.difference?.items?.[0]?.beforeImage);
            update["difference.items.$.beforeImage"] = req.files.beforeImage[0].path;
        }
        if (req.files?.afterImage?.[0]) {
            const page = await ServicesPage.findOne(
                { "difference.items._id": itemId },
                { "difference.items.$": 1 },
            );
            await deleteFromCloudinary(page?.difference?.items?.[0]?.afterImage);
            update["difference.items.$.afterImage"] = req.files.afterImage[0].path;
        }

        ["title", "description", "left", "order"].forEach((f) => {
            if (req.body[f] !== undefined) update[`difference.items.$.${f}`] = req.body[f];
        });

        if (req.body.builtFor !== undefined) {
            let builtFor = req.body.builtFor;
            if (typeof builtFor === "string") {
                try {
                    builtFor = JSON.parse(builtFor);
                } catch {
                    builtFor = builtFor.split(",").map((s) => s.trim());
                }
            }
            update["difference.items.$.builtFor"] = builtFor;
        }

        const updated = await ServicesPage.findOneAndUpdate(
            { "difference.items._id": itemId },
            { $set: update },
            { new: true },
        );
        if (!updated) return res.status(404).json({ error: "Difference item not found." });
        res.json({ message: "Difference item updated.", items: updated.difference.items });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// DELETE /api/services-page/difference/:itemId - Delete difference item
export const deleteDifferenceItem = async (req, res) => {
    try {
        const { itemId } = req.params;
        const page = await ServicesPage.findOne(
            { "difference.items._id": itemId },
            { "difference.items.$": 1 },
        );
        const item = page?.difference?.items?.[0];
        if (item) {
            await deleteFromCloudinary(item.beforeImage);
            await deleteFromCloudinary(item.afterImage);
        }

        const updated = await ServicesPage.findOneAndUpdate(
            {},
            { $pull: { "difference.items": { _id: itemId } } },
            { new: true },
        );
        res.json({ message: "Difference item deleted.", items: updated.difference.items });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ═══════════════════════════════════════════════════════════════════════════════
//  USE CASES
// ═══════════════════════════════════════════════════════════════════════════════

// POST  /api/services-page/use-cases
export const addUseCase = async (req, res) => {
    try {
        const page = await ServicesPage.findOneAndUpdate(
            {},
            { $push: { "useCases.items": req.body } },
            { new: true, upsert: true },
        );
        res.status(201).json({ message: "Use case added.", items: page.useCases.items });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// PUT  /api/services-page/use-cases/:itemId
export const updateUseCase = async (req, res) => {
    try {
        const { itemId } = req.params;
        const update = {};
        ["title", "description", "order"].forEach((f) => {
            if (req.body[f] !== undefined) update[`useCases.items.$.${f}`] = req.body[f];
        });
        const updated = await ServicesPage.findOneAndUpdate(
            { "useCases.items._id": itemId },
            { $set: update },
            { new: true },
        );
        if (!updated) return res.status(404).json({ error: "Use case not found." });
        res.json({ message: "Use case updated.", items: updated.useCases.items });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// DELETE  /api/services-page/use-cases/:itemId
export const deleteUseCase = async (req, res) => {
    try {
        const { itemId } = req.params;
        const updated = await ServicesPage.findOneAndUpdate(
            {},
            { $pull: { "useCases.items": { _id: itemId } } },
            { new: true },
        );
        res.json({ message: "Use case deleted.", items: updated.useCases.items });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ═══════════════════════════════════════════════════════════════════════════════
//  COMPARISON ROWS  (HandDrawn table)
// ═══════════════════════════════════════════════════════════════════════════════

// POST  /api/services-page/comparison/rows
export const addComparisonRow = async (req, res) => {
    try {
        const page = await ServicesPage.findOneAndUpdate(
            {},
            { $push: { "comparison.rows": req.body } },
            { new: true, upsert: true },
        );
        res.status(201).json({ message: "Row added.", rows: page.comparison.rows });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// PUT  /api/services-page/comparison/rows/:rowId
export const updateComparisonRow = async (req, res) => {
    try {
        const { rowId } = req.params;
        const update = {};
        ["feature", "aiResult", "ourResult", "order"].forEach((f) => {
            if (req.body[f] !== undefined) update[`comparison.rows.$.${f}`] = req.body[f];
        });
        const updated = await ServicesPage.findOneAndUpdate(
            { "comparison.rows._id": rowId },
            { $set: update },
            { new: true },
        );
        if (!updated) return res.status(404).json({ error: "Row not found." });
        res.json({ message: "Row updated.", rows: updated.comparison.rows });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// DELETE  /api/services-page/comparison/rows/:rowId
export const deleteComparisonRow = async (req, res) => {
    try {
        const { rowId } = req.params;
        const updated = await ServicesPage.findOneAndUpdate(
            {},
            { $pull: { "comparison.rows": { _id: rowId } } },
            { new: true },
        );
        res.json({ message: "Row deleted.", rows: updated.comparison.rows });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ═══════════════════════════════════════════════════════════════════════════════
//  DELIVERABLES  (WhatYouGet)
// ═══════════════════════════════════════════════════════════════════════════════

// POST  /api/services-page/deliverables
export const addDeliverable = async (req, res) => {
    try {
        const page = await ServicesPage.findOneAndUpdate(
            {},
            { $push: { "deliverables.items": req.body } },
            { new: true, upsert: true },
        );
        res.status(201).json({ message: "Deliverable added.", items: page.deliverables.items });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// PUT  /api/services-page/deliverables/:itemId
export const updateDeliverable = async (req, res) => {
    try {
        const { itemId } = req.params;
        const update = {};
        ["title", "description", "order"].forEach((f) => {
            if (req.body[f] !== undefined) update[`deliverables.items.$.${f}`] = req.body[f];
        });
        const updated = await ServicesPage.findOneAndUpdate(
            { "deliverables.items._id": itemId },
            { $set: update },
            { new: true },
        );
        if (!updated) return res.status(404).json({ error: "Deliverable not found." });
        res.json({ message: "Deliverable updated.", items: updated.deliverables.items });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// DELETE  /api/services-page/deliverables/:itemId
export const deleteDeliverable = async (req, res) => {
    try {
        const { itemId } = req.params;
        const updated = await ServicesPage.findOneAndUpdate(
            {},
            { $pull: { "deliverables.items": { _id: itemId } } },
            { new: true },
        );
        res.json({ message: "Deliverable deleted.", items: updated.deliverables.items });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ═══════════════════════════════════════════════════════════════════════════════
//  FAQ  (Questions — serviceFaq)
// ═══════════════════════════════════════════════════════════════════════════════

// POST  /api/services-page/faq
export const addFaq = async (req, res) => {
    try {
        const page = await ServicesPage.findOneAndUpdate(
            {},
            { $push: { "faq.items": req.body } },
            { new: true, upsert: true },
        );
        res.status(201).json({ message: "FAQ added.", items: page.faq.items });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// PUT  /api/services-page/faq/:itemId
export const updateFaq = async (req, res) => {
    try {
        const { itemId } = req.params;
        const update = {};
        ["question", "answer", "order"].forEach((f) => {
            if (req.body[f] !== undefined) update[`faq.items.$.${f}`] = req.body[f];
        });
        const updated = await ServicesPage.findOneAndUpdate(
            { "faq.items._id": itemId },
            { $set: update },
            { new: true },
        );
        if (!updated) return res.status(404).json({ error: "FAQ not found." });
        res.json({ message: "FAQ updated.", items: updated.faq.items });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// DELETE  /api/services-page/faq/:itemId
export const deleteFaq = async (req, res) => {
    try {
        const { itemId } = req.params;
        const updated = await ServicesPage.findOneAndUpdate(
            {},
            { $pull: { "faq.items": { _id: itemId } } },
            { new: true },
        );
        res.json({ message: "FAQ deleted.", items: updated.faq.items });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
