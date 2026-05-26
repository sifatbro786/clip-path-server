import mongoose from "mongoose";
import Service from "../models/Service.js";
import { cloudinary } from "../config/cloudinary.js";

// ── Helper Functions ─────────────────────────────────────────────────────────
function getPublicId(url) {
    if (!url) return null;
    const match = url.match(/\/upload\/(?:v\d+\/)?(.+)\.[a-z]+$/i);
    return match ? match[1] : null;
}

async function deleteFromCloudinary(url) {
    const pid = getPublicId(url);
    if (pid) await cloudinary.uploader.destroy(pid).catch(() => {});
}

// ============================================
// PUBLIC ROUTES
// ============================================

export const getAllServices = async (req, res) => {
    try {
        const services = await Service.find({ isActive: true, isSecondary: false })
            .sort({ order: 1 })
            .select("slug num title cardDescription cardImage price order")
            .lean();
        res.json(services);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const getSecondaryServices = async (req, res) => {
    try {
        const services = await Service.find({ isActive: true, isSecondary: true })
            .sort({ order: 1 })
            .select("slug num title cardDescription cardImage price order")
            .lean();
        res.json(services);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const getServiceBySlug = async (req, res) => {
    try {
        const service = await Service.findOne({
            slug: req.params.slug,
            isActive: true,
        })
            .populate("relatedServices.items", "slug title price cardImage cardDescription")
            .lean();
        if (!service) return res.status(404).json({ error: "Service not found." });
        res.json(service);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ============================================
// ADMIN - SERVICE CRUD
// ============================================

export const getAllServicesAdmin = async (req, res) => {
    try {
        const services = await Service.find().sort({ order: 1 }).lean();
        res.json(services);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const createService = async (req, res) => {
    try {
        const cardImage = req.file?.path || req.body.cardImage;
        const data = { ...req.body, cardImage };
        const service = await Service.create(data);
        res.status(201).json({ message: "Service created.", service });
    } catch (err) {
        if (err.code === 11000) return res.status(409).json({ error: "Slug already exists." });
        res.status(400).json({ error: err.message });
    }
};

export const updateService = async (req, res) => {
    try {
        const { slug } = req.params;
        const service = await Service.findOne({ slug });
        if (!service) return res.status(404).json({ error: "Service not found." });

        if (req.file) {
            await deleteFromCloudinary(service.cardImage);
            req.body.cardImage = req.file.path;
        }

        const updated = await Service.findOneAndUpdate({ slug }, req.body, {
            new: true,
            runValidators: true,
        });
        res.json({ message: "Service updated.", service: updated });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

export const deleteService = async (req, res) => {
    try {
        const service = await Service.findOneAndDelete({ slug: req.params.slug });
        if (!service) return res.status(404).json({ error: "Service not found." });

        const toDelete = [
            service.cardImage,
            service.hero?.backgroundImage,
            ...(service.samples?.items?.flatMap((s) => [s.beforeImage, s.afterImage]) ?? []),
            ...(service.difference?.items?.flatMap((d) => [d.beforeImage, d.afterImage]) ?? []),
            service.retoucher?.image,
        ];
        await Promise.all(toDelete.filter(Boolean).map(deleteFromCloudinary));

        res.json({ message: "Service deleted." });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ============================================
// SAMPLES (Before/After)
// ============================================

export const addSample = async (req, res) => {
    try {
        const beforeImage = req.files?.beforeImage?.[0]?.path || req.body.beforeImage;
        const afterImage = req.files?.afterImage?.[0]?.path || req.body.afterImage;
        const item = {
            ...req.body,
            beforeImage,
            afterImage,
            title: req.body.title || "",
            description: req.body.description || "",
            category: req.body.category || "",
            order: req.body.order || 0,
        };

        const service = await Service.findOneAndUpdate(
            { slug: req.params.slug },
            { $push: { "samples.items": item } },
            { new: true },
        );
        if (!service) return res.status(404).json({ error: "Service not found." });
        res.status(201).json({ message: "Sample added.", items: service.samples.items });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

export const updateSample = async (req, res) => {
    try {
        const { slug, sampleId } = req.params;
        const update = {};

        if (req.files?.beforeImage?.[0]) {
            const svc = await Service.findOne(
                { slug, "samples.items._id": sampleId },
                { "samples.items.$": 1 },
            );
            await deleteFromCloudinary(svc?.samples?.items?.[0]?.beforeImage);
            update["samples.items.$.beforeImage"] = req.files.beforeImage[0].path;
        }
        if (req.files?.afterImage?.[0]) {
            const svc = await Service.findOne(
                { slug, "samples.items._id": sampleId },
                { "samples.items.$": 1 },
            );
            await deleteFromCloudinary(svc?.samples?.items?.[0]?.afterImage);
            update["samples.items.$.afterImage"] = req.files.afterImage[0].path;
        }

        if (req.body.title !== undefined) update["samples.items.$.title"] = req.body.title;
        if (req.body.description !== undefined)
            update["samples.items.$.description"] = req.body.description;
        if (req.body.category !== undefined) update["samples.items.$.category"] = req.body.category;
        if (req.body.order !== undefined) update["samples.items.$.order"] = req.body.order;

        const updated = await Service.findOneAndUpdate(
            { slug, "samples.items._id": sampleId },
            { $set: update },
            { new: true },
        );
        if (!updated) return res.status(404).json({ error: "Sample not found." });
        res.json({ message: "Sample updated.", items: updated.samples.items });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

export const deleteSample = async (req, res) => {
    try {
        const { slug, sampleId } = req.params;
        const svc = await Service.findOne(
            { slug, "samples.items._id": sampleId },
            { "samples.items.$": 1 },
        );
        const sample = svc?.samples?.items?.[0];
        if (sample) {
            await deleteFromCloudinary(sample.beforeImage);
            await deleteFromCloudinary(sample.afterImage);
        }
        const updated = await Service.findOneAndUpdate(
            { slug },
            { $pull: { "samples.items": { _id: sampleId } } },
            { new: true },
        );
        if (!updated) return res.status(404).json({ error: "Service not found." });
        res.json({ message: "Sample deleted.", items: updated.samples.items });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ============================================
// PROCESS STEPS
// ============================================

export const addProcessStep = async (req, res) => {
    try {
        const service = await Service.findOneAndUpdate(
            { slug: req.params.slug },
            { $push: { "process.steps": req.body } },
            { new: true },
        );
        if (!service) return res.status(404).json({ error: "Service not found." });
        res.status(201).json({ message: "Step added.", steps: service.process.steps });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

export const updateProcessStep = async (req, res) => {
    try {
        const { slug, stepId } = req.params;
        const update = {};
        ["number", "title", "description", "tradeDetail", "order"].forEach((f) => {
            if (req.body[f] !== undefined) update[`process.steps.$.${f}`] = req.body[f];
        });
        const updated = await Service.findOneAndUpdate(
            { slug, "process.steps._id": stepId },
            { $set: update },
            { new: true },
        );
        if (!updated) return res.status(404).json({ error: "Step not found." });
        res.json({ message: "Step updated.", steps: updated.process.steps });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

export const deleteProcessStep = async (req, res) => {
    try {
        const { slug, stepId } = req.params;
        const updated = await Service.findOneAndUpdate(
            { slug },
            { $pull: { "process.steps": { _id: stepId } } },
            { new: true },
        );
        if (!updated) return res.status(404).json({ error: "Service not found." });
        res.json({ message: "Step deleted.", steps: updated.process.steps });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ============================================
// PRICING TIERS
// ============================================

export const addPricingTier = async (req, res) => {
    try {
        const service = await Service.findOneAndUpdate(
            { slug: req.params.slug },
            { $push: { "pricing.tiers": req.body } },
            { new: true },
        );
        if (!service) return res.status(404).json({ error: "Service not found." });
        res.status(201).json({ message: "Tier added.", tiers: service.pricing.tiers });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

export const updatePricingTier = async (req, res) => {
    try {
        const { slug, tierId } = req.params;
        const update = {};
        ["name", "description", "price", "order"].forEach((f) => {
            if (req.body[f] !== undefined) update[`pricing.tiers.$.${f}`] = req.body[f];
        });
        if (req.body.features !== undefined) {
            update[`pricing.tiers.$.features`] = Array.isArray(req.body.features)
                ? req.body.features
                : JSON.parse(req.body.features);
        }
        const updated = await Service.findOneAndUpdate(
            { slug, "pricing.tiers._id": tierId },
            { $set: update },
            { new: true },
        );
        if (!updated) return res.status(404).json({ error: "Tier not found." });
        res.json({ message: "Tier updated.", tiers: updated.pricing.tiers });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

export const deletePricingTier = async (req, res) => {
    try {
        const { slug, tierId } = req.params;
        const updated = await Service.findOneAndUpdate(
            { slug },
            { $pull: { "pricing.tiers": { _id: tierId } } },
            { new: true },
        );
        if (!updated) return res.status(404).json({ error: "Service not found." });
        res.json({ message: "Tier deleted.", tiers: updated.pricing.tiers });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ============================================
// WHO WE WORK WITH
// ============================================

export const addWhoWeWorkCard = async (req, res) => {
    try {
        const service = await Service.findOneAndUpdate(
            { slug: req.params.slug },
            { $push: { "whoWeWork.cards": req.body } },
            { new: true },
        );
        if (!service) return res.status(404).json({ error: "Service not found." });
        res.status(201).json({ message: "Card added.", cards: service.whoWeWork.cards });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

export const updateWhoWeWorkCard = async (req, res) => {
    try {
        const { slug, cardId } = req.params;
        const update = {};
        ["label", "title", "description", "order"].forEach((f) => {
            if (req.body[f] !== undefined) update[`whoWeWork.cards.$.${f}`] = req.body[f];
        });
        const updated = await Service.findOneAndUpdate(
            { slug, "whoWeWork.cards._id": cardId },
            { $set: update },
            { new: true },
        );
        if (!updated) return res.status(404).json({ error: "Card not found." });
        res.json({ message: "Card updated.", cards: updated.whoWeWork.cards });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

export const deleteWhoWeWorkCard = async (req, res) => {
    try {
        const { slug, cardId } = req.params;
        const updated = await Service.findOneAndUpdate(
            { slug },
            { $pull: { "whoWeWork.cards": { _id: cardId } } },
            { new: true },
        );
        if (!updated) return res.status(404).json({ error: "Service not found." });
        res.json({ message: "Card deleted.", cards: updated.whoWeWork.cards });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const updateWhoWeWorkSection = async (req, res) => {
    try {
        const { slug } = req.params;
        const update = {};
        if (req.body.eyebrow !== undefined) update["whoWeWork.eyebrow"] = req.body.eyebrow;
        if (req.body.heading !== undefined) update["whoWeWork.heading"] = req.body.heading;
        if (req.body.italicHeading !== undefined)
            update["whoWeWork.italicHeading"] = req.body.italicHeading;
        if (req.body.description !== undefined)
            update["whoWeWork.description"] = req.body.description;

        const updated = await Service.findOneAndUpdate({ slug }, { $set: update }, { new: true });
        if (!updated) return res.status(404).json({ error: "Service not found." });
        res.json({ message: "Section updated.", whoWeWork: updated.whoWeWork });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// ============================================
// FAQ
// ============================================

export const addServiceFaq = async (req, res) => {
    try {
        const service = await Service.findOneAndUpdate(
            { slug: req.params.slug },
            { $push: { "faq.items": req.body } },
            { new: true },
        );
        if (!service) return res.status(404).json({ error: "Service not found." });
        res.status(201).json({ message: "FAQ added.", items: service.faq.items });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

export const updateServiceFaq = async (req, res) => {
    try {
        const { slug, itemId } = req.params;
        const update = {};
        ["question", "answer", "order"].forEach((f) => {
            if (req.body[f] !== undefined) update[`faq.items.$.${f}`] = req.body[f];
        });
        const updated = await Service.findOneAndUpdate(
            { slug, "faq.items._id": itemId },
            { $set: update },
            { new: true },
        );
        if (!updated) return res.status(404).json({ error: "FAQ not found." });
        res.json({ message: "FAQ updated.", items: updated.faq.items });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

export const deleteServiceFaq = async (req, res) => {
    try {
        const { slug, itemId } = req.params;
        const updated = await Service.findOneAndUpdate(
            { slug },
            { $pull: { "faq.items": { _id: itemId } } },
            { new: true },
        );
        if (!updated) return res.status(404).json({ error: "Service not found." });
        res.json({ message: "FAQ deleted.", items: updated.faq.items });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ============================================
// RELATED SERVICES
// ============================================

export const updateRelatedServices = async (req, res) => {
    try {
        const { slug } = req.params;
        const ids = req.body.ids ?? [];

        const valid = ids.filter((id) => mongoose.isValidObjectId(id));
        if (valid.length !== ids.length) {
            return res.status(400).json({ error: "One or more invalid service IDs." });
        }

        const self = await Service.findOne({ slug }, "_id").lean();
        if (!self) return res.status(404).json({ error: "Service not found." });

        const filtered = valid.filter((id) => id.toString() !== self._id.toString());

        const updated = await Service.findOneAndUpdate(
            { slug },
            { $set: { "relatedServices.items": filtered } },
            { new: true },
        ).populate("relatedServices.items", "slug title price cardImage cardDescription");

        res.json({
            message: "Related services updated.",
            relatedServices: updated.relatedServices,
        });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// ============================================
// STATS BAR
// ============================================

export const updateStats = async (req, res) => {
    try {
        const updated = await Service.findOneAndUpdate(
            { slug: req.params.slug },
            { $set: { stats: req.body } },
            { new: true, runValidators: true },
        );
        if (!updated) return res.status(404).json({ error: "Service not found." });
        res.json({ message: "Stats updated.", stats: updated.stats });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// ============================================
// RETOUCHER SECTION
// ============================================
export const updateRetoucher = async (req, res) => {
    try {
        const { slug } = req.params;
        const service = await Service.findOne({ slug });
        if (!service) return res.status(404).json({ error: "Service not found." });

        // Get existing retoucher data
        const existingRetoucher = service.retoucher || {};

        // Prepare update object
        const updateData = {};

        // Handle text fields - keep existing if not provided
        updateData["retoucher.eyebrow"] =
            req.body.eyebrow !== undefined ? req.body.eyebrow : existingRetoucher.eyebrow;
        updateData["retoucher.name"] =
            req.body.name !== undefined ? req.body.name : existingRetoucher.name;
        updateData["retoucher.designation"] =
            req.body.designation !== undefined
                ? req.body.designation
                : existingRetoucher.designation;
        updateData["retoucher.quote"] =
            req.body.quote !== undefined ? req.body.quote : existingRetoucher.quote;

        // Handle bodyParagraphs
        if (req.body.bodyParagraphs !== undefined) {
            let bodyParagraphs = req.body.bodyParagraphs;
            if (typeof bodyParagraphs === "string") {
                try {
                    bodyParagraphs = JSON.parse(bodyParagraphs);
                } catch {
                    bodyParagraphs = bodyParagraphs.split(",").map((s) => s.trim());
                }
            }
            updateData["retoucher.bodyParagraphs"] = bodyParagraphs;
        }

        // Handle image - ONLY update if a new file is uploaded
        if (req.file) {
            // Delete old image if exists
            if (existingRetoucher.image) {
                await deleteFromCloudinary(existingRetoucher.image);
            }
            updateData["retoucher.image"] = req.file.path;
        }
        // IMPORTANT: If no req.file, DO NOT touch the existing image
        // So we don't set updateData["retoucher.image"] at all

        // Also handle case where image removal is explicitly requested
        if (req.body.removeImage === "true") {
            if (existingRetoucher.image) {
                await deleteFromCloudinary(existingRetoucher.image);
            }
            updateData["retoucher.image"] = "";
        }

        const updated = await Service.findOneAndUpdate(
            { slug },
            { $set: updateData },
            { new: true, runValidators: true },
        );

        res.json({ message: "Retoucher section updated.", retoucher: updated.retoucher });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};
// ============================================
// TESTIMONIALS
// ============================================

export const addTestimonial = async (req, res) => {
    try {
        const service = await Service.findOneAndUpdate(
            { slug: req.params.slug },
            { $push: { "testimonials.items": req.body } },
            { new: true },
        );
        if (!service) return res.status(404).json({ error: "Service not found." });
        res.status(201).json({ message: "Testimonial added.", items: service.testimonials.items });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

export const updateTestimonial = async (req, res) => {
    try {
        const { slug, testimonialId } = req.params;
        const update = {};
        ["eyebrow", "quote", "clientName", "clientMeta", "rating", "order"].forEach((f) => {
            if (req.body[f] !== undefined) update[`testimonials.items.$.${f}`] = req.body[f];
        });
        const updated = await Service.findOneAndUpdate(
            { slug, "testimonials.items._id": testimonialId },
            { $set: update },
            { new: true },
        );
        if (!updated) return res.status(404).json({ error: "Testimonial not found." });
        res.json({ message: "Testimonial updated.", items: updated.testimonials.items });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

export const deleteTestimonial = async (req, res) => {
    try {
        const { slug, testimonialId } = req.params;
        const updated = await Service.findOneAndUpdate(
            { slug },
            { $pull: { "testimonials.items": { _id: testimonialId } } },
            { new: true },
        );
        if (!updated) return res.status(404).json({ error: "Service not found." });
        res.json({ message: "Testimonial deleted.", items: updated.testimonials.items });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
