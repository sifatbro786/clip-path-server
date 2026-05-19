// controllers/pricingController.js
import Pricing from "../models/Pricing.js";
import { cloudinary } from "../config/cloudinary.js";

// ── Get Pricing Data ──────────────────────────────────────────────────────────
export const getPricingData = async (req, res) => {
    try {
        const pricingData = await Pricing.getSingleton();
        res.status(200).json({
            success: true,
            data: pricingData,
        });
    } catch (error) {
        console.error("Error fetching pricing data:", error);
        res.status(500).json({ success: false, error: error.message });
    }
};

// ── Hero Section ──────────────────────────────────────────────────────────────
export const updateHero = async (req, res) => {
    try {
        const { badge, headingPrefix, headingHighlighted, description, features, navItems } =
            req.body;
        const pricing = await Pricing.getSingleton();

        pricing.hero = {
            badge: badge || pricing.hero.badge,
            heading: {
                prefix: headingPrefix || pricing.hero.heading?.prefix,
                highlighted: headingHighlighted || pricing.hero.heading?.highlighted,
            },
            description: description || pricing.hero.description,
            features: features || pricing.hero.features,
            navItems: navItems || pricing.hero.navItems,
        };
        pricing.lastUpdatedBy = req.adminId || "admin";
        await pricing.save();

        res.status(200).json({ success: true, data: pricing.hero });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// ── Per-Image Rates ───────────────────────────────────────────────────────────
export const updatePerImageRatesMeta = async (req, res) => {
    try {
        const { badge, heading, highlightedText, description, footnote } = req.body;
        const pricing = await Pricing.getSingleton();

        pricing.perImageRates.badge = badge || pricing.perImageRates.badge;
        pricing.perImageRates.heading = heading || pricing.perImageRates.heading;
        pricing.perImageRates.highlightedText =
            highlightedText || pricing.perImageRates.highlightedText;
        pricing.perImageRates.description = description || pricing.perImageRates.description;
        pricing.perImageRates.footnote = footnote || pricing.perImageRates.footnote;
        pricing.lastUpdatedBy = req.adminId || "admin";
        await pricing.save();

        res.status(200).json({ success: true, data: pricing.perImageRates });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// CRUD for Per-Image Rates
export const addPerImageRate = async (req, res) => {
    try {
        const { service, description, rates, order } = req.body;
        const pricing = await Pricing.getSingleton();

        const newRate = {
            service,
            description,
            rates: JSON.parse(rates),
            order: order || pricing.perImageRates.rates.length,
        };

        pricing.perImageRates.rates.push(newRate);
        pricing.lastUpdatedBy = req.adminId || "admin";
        await pricing.save();

        res.status(201).json({ success: true, data: newRate });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const updatePerImageRate = async (req, res) => {
    try {
        const { rateId } = req.params;
        const { service, description, rates, order } = req.body;
        const pricing = await Pricing.getSingleton();

        const rate = pricing.perImageRates.rates.id(rateId);
        if (!rate) {
            return res.status(404).json({ success: false, error: "Rate not found" });
        }

        if (service !== undefined) rate.service = service;
        if (description !== undefined) rate.description = description;
        if (rates !== undefined) rate.rates = JSON.parse(rates);
        if (order !== undefined) rate.order = order;

        pricing.lastUpdatedBy = req.adminId || "admin";
        await pricing.save();

        res.status(200).json({ success: true, data: rate });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const deletePerImageRate = async (req, res) => {
    try {
        const { rateId } = req.params;
        const pricing = await Pricing.getSingleton();

        pricing.perImageRates.rates = pricing.perImageRates.rates.filter(
            (rate) => rate._id.toString() !== rateId,
        );
        pricing.lastUpdatedBy = req.adminId || "admin";
        await pricing.save();

        res.status(200).json({ success: true, message: "Rate deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// CRUD for Tier Definitions
export const addTierDefinition = async (req, res) => {
    try {
        const { name, description, order } = req.body;
        const pricing = await Pricing.getSingleton();

        const newTier = {
            name,
            description,
            order: order || pricing.perImageRates.tierDefinitions.length,
        };
        pricing.perImageRates.tierDefinitions.push(newTier);
        pricing.lastUpdatedBy = req.adminId || "admin";
        await pricing.save();

        res.status(201).json({ success: true, data: newTier });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const updateTierDefinition = async (req, res) => {
    try {
        const { tierId } = req.params;
        const { name, description, order } = req.body;
        const pricing = await Pricing.getSingleton();

        const tier = pricing.perImageRates.tierDefinitions.id(tierId);
        if (!tier) {
            return res.status(404).json({ success: false, error: "Tier not found" });
        }

        if (name !== undefined) tier.name = name;
        if (description !== undefined) tier.description = description;
        if (order !== undefined) tier.order = order;

        pricing.lastUpdatedBy = req.adminId || "admin";
        await pricing.save();

        res.status(200).json({ success: true, data: tier });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const deleteTierDefinition = async (req, res) => {
    try {
        const { tierId } = req.params;
        const pricing = await Pricing.getSingleton();

        pricing.perImageRates.tierDefinitions = pricing.perImageRates.tierDefinitions.filter(
            (tier) => tier._id.toString() !== tierId,
        );
        pricing.lastUpdatedBy = req.adminId || "admin";
        await pricing.save();

        res.status(200).json({ success: true, message: "Tier deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// ── Recent Work/Samples with Cloudinary ───────────────────────────────────────
export const addSample = async (req, res) => {
    try {
        const { tier, title, price, order } = req.body;

        if (!req.files || !req.files.afterImage) {
            return res.status(400).json({ success: false, error: "After image is required" });
        }

        const pricing = await Pricing.getSingleton();

        const newSample = {
            tier,
            title,
            price,
            afterImageUrl: req.files.afterImage[0].path,
            afterImagePublicId: req.files.afterImage[0].filename,
            order: order || pricing.recentWork.samples.length,
        };

        if (req.files.beforeImage) {
            newSample.beforeImageUrl = req.files.beforeImage[0].path;
            newSample.beforeImagePublicId = req.files.beforeImage[0].filename;
        }

        pricing.recentWork.samples.push(newSample);
        pricing.lastUpdatedBy = req.adminId || "admin";
        await pricing.save();

        res.status(201).json({ success: true, data: newSample });
    } catch (error) {
        // Clean up uploaded images if error occurs
        if (req.files) {
            if (req.files.afterImage)
                await cloudinary.uploader.destroy(req.files.afterImage[0].filename);
            if (req.files.beforeImage)
                await cloudinary.uploader.destroy(req.files.beforeImage[0].filename);
        }
        res.status(500).json({ success: false, error: error.message });
    }
};

export const updateSample = async (req, res) => {
    try {
        const { sampleId } = req.params;
        const { tier, title, price, order } = req.body;
        const pricing = await Pricing.getSingleton();

        const sample = pricing.recentWork.samples.id(sampleId);
        if (!sample) {
            return res.status(404).json({ success: false, error: "Sample not found" });
        }

        // Handle image updates
        if (req.files) {
            if (req.files.afterImage) {
                await cloudinary.uploader.destroy(sample.afterImagePublicId);
                sample.afterImageUrl = req.files.afterImage[0].path;
                sample.afterImagePublicId = req.files.afterImage[0].filename;
            }
            if (req.files.beforeImage) {
                if (sample.beforeImagePublicId) {
                    await cloudinary.uploader.destroy(sample.beforeImagePublicId);
                }
                sample.beforeImageUrl = req.files.beforeImage[0].path;
                sample.beforeImagePublicId = req.files.beforeImage[0].filename;
            }
        }

        if (tier !== undefined) sample.tier = tier;
        if (title !== undefined) sample.title = title;
        if (price !== undefined) sample.price = price;
        if (order !== undefined) sample.order = order;

        pricing.lastUpdatedBy = req.adminId || "admin";
        await pricing.save();

        res.status(200).json({ success: true, data: sample });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const deleteSample = async (req, res) => {
    try {
        const { sampleId } = req.params;
        const pricing = await Pricing.getSingleton();

        const sample = pricing.recentWork.samples.id(sampleId);
        if (!sample) {
            return res.status(404).json({ success: false, error: "Sample not found" });
        }

        // Delete images from Cloudinary
        await cloudinary.uploader.destroy(sample.afterImagePublicId);
        if (sample.beforeImagePublicId) {
            await cloudinary.uploader.destroy(sample.beforeImagePublicId);
        }

        pricing.recentWork.samples = pricing.recentWork.samples.filter(
            (s) => s._id.toString() !== sampleId,
        );
        pricing.lastUpdatedBy = req.adminId || "admin";
        await pricing.save();

        res.status(200).json({ success: true, message: "Sample deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Update Recent Work Meta
export const updateRecentWorkMeta = async (req, res) => {
    try {
        const { title, headingPrefix, headingHighlighted, paragraph } = req.body;
        const pricing = await Pricing.getSingleton();

        pricing.recentWork.title = title || pricing.recentWork.title;
        pricing.recentWork.headingPrefix = headingPrefix || pricing.recentWork.headingPrefix;
        pricing.recentWork.headingHighlighted =
            headingHighlighted || pricing.recentWork.headingHighlighted;
        pricing.recentWork.paragraph = paragraph || pricing.recentWork.paragraph;
        pricing.lastUpdatedBy = req.adminId || "admin";
        await pricing.save();

        res.status(200).json({ success: true, data: pricing.recentWork });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// ── Monthly Packages (Pricing Plans) ──────────────────────────────────────────
export const updateMonthlyPackagesMeta = async (req, res) => {
    try {
        const { title, headingPrefix, headingHighlighted, paragraph, footerText } = req.body;
        const pricing = await Pricing.getSingleton();

        pricing.monthlyPackages.title = title || pricing.monthlyPackages.title;
        pricing.monthlyPackages.headingPrefix =
            headingPrefix || pricing.monthlyPackages.headingPrefix;
        pricing.monthlyPackages.headingHighlighted =
            headingHighlighted || pricing.monthlyPackages.headingHighlighted;
        pricing.monthlyPackages.paragraph = paragraph || pricing.monthlyPackages.paragraph;
        pricing.monthlyPackages.footerText = footerText || pricing.monthlyPackages.footerText;
        pricing.lastUpdatedBy = req.adminId || "admin";
        await pricing.save();

        res.status(200).json({ success: true, data: pricing.monthlyPackages });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const addPlan = async (req, res) => {
    try {
        const {
            name,
            subtitle,
            price,
            equivalent,
            isDark,
            isPopular,
            features,
            buttonText,
            order,
        } = req.body;
        const pricing = await Pricing.getSingleton();

        const newPlan = {
            name,
            subtitle,
            price,
            equivalent,
            isDark: isDark || false,
            isPopular: isPopular || false,
            features: JSON.parse(features),
            buttonText: buttonText || "Get Started",
            order: order || pricing.monthlyPackages.plans.length,
        };

        pricing.monthlyPackages.plans.push(newPlan);
        pricing.lastUpdatedBy = req.adminId || "admin";
        await pricing.save();

        res.status(201).json({ success: true, data: newPlan });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const updatePlan = async (req, res) => {
    try {
        const { planId } = req.params;
        const {
            name,
            subtitle,
            price,
            equivalent,
            isDark,
            isPopular,
            features,
            buttonText,
            order,
        } = req.body;
        const pricing = await Pricing.getSingleton();

        const plan = pricing.monthlyPackages.plans.id(planId);
        if (!plan) {
            return res.status(404).json({ success: false, error: "Plan not found" });
        }

        if (name !== undefined) plan.name = name;
        if (subtitle !== undefined) plan.subtitle = subtitle;
        if (price !== undefined) plan.price = price;
        if (equivalent !== undefined) plan.equivalent = equivalent;
        if (isDark !== undefined) plan.isDark = isDark;
        if (isPopular !== undefined) plan.isPopular = isPopular;
        if (features !== undefined) plan.features = JSON.parse(features);
        if (buttonText !== undefined) plan.buttonText = buttonText;
        if (order !== undefined) plan.order = order;

        pricing.lastUpdatedBy = req.adminId || "admin";
        await pricing.save();

        res.status(200).json({ success: true, data: plan });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const deletePlan = async (req, res) => {
    try {
        const { planId } = req.params;
        const pricing = await Pricing.getSingleton();

        pricing.monthlyPackages.plans = pricing.monthlyPackages.plans.filter(
            (plan) => plan._id.toString() !== planId,
        );
        pricing.lastUpdatedBy = req.adminId || "admin";
        await pricing.save();

        res.status(200).json({ success: true, message: "Plan deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// ── Retouching Services ───────────────────────────────────────────────────────
export const updateRetouchingMeta = async (req, res) => {
    try {
        const { badge, heading, highlightedText, description, ctaText } = req.body;
        const pricing = await Pricing.getSingleton();

        pricing.retouching.badge = badge || pricing.retouching.badge;
        pricing.retouching.heading = heading || pricing.retouching.heading;
        pricing.retouching.highlightedText = highlightedText || pricing.retouching.highlightedText;
        pricing.retouching.description = description || pricing.retouching.description;
        pricing.retouching.ctaText = ctaText || pricing.retouching.ctaText;
        pricing.lastUpdatedBy = req.adminId || "admin";
        await pricing.save();

        res.status(200).json({ success: true, data: pricing.retouching });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const addRetouchingService = async (req, res) => {
    try {
        const { title, description, price, order } = req.body;
        const pricing = await Pricing.getSingleton();

        const newService = {
            title,
            description,
            price,
            order: order || pricing.retouching.services.length,
        };

        pricing.retouching.services.push(newService);
        pricing.lastUpdatedBy = req.adminId || "admin";
        await pricing.save();

        res.status(201).json({ success: true, data: newService });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const updateRetouchingService = async (req, res) => {
    try {
        const { serviceId } = req.params;
        const { title, description, price, order } = req.body;
        const pricing = await Pricing.getSingleton();

        const service = pricing.retouching.services.id(serviceId);
        if (!service) {
            return res.status(404).json({ success: false, error: "Service not found" });
        }

        if (title !== undefined) service.title = title;
        if (description !== undefined) service.description = description;
        if (price !== undefined) service.price = price;
        if (order !== undefined) service.order = order;

        pricing.lastUpdatedBy = req.adminId || "admin";
        await pricing.save();

        res.status(200).json({ success: true, data: service });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const deleteRetouchingService = async (req, res) => {
    try {
        const { serviceId } = req.params;
        const pricing = await Pricing.getSingleton();

        pricing.retouching.services = pricing.retouching.services.filter(
            (service) => service._id.toString() !== serviceId,
        );
        pricing.lastUpdatedBy = req.adminId || "admin";
        await pricing.save();

        res.status(200).json({ success: true, message: "Service deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// ── Volume Discounts ──────────────────────────────────────────────────────────
export const updateVolumeDiscountsMeta = async (req, res) => {
    try {
        const { badge, heading, highlightedText, description, disclaimer } = req.body;
        const pricing = await Pricing.getSingleton();

        pricing.volumeDiscounts.badge = badge || pricing.volumeDiscounts.badge;
        pricing.volumeDiscounts.heading = heading || pricing.volumeDiscounts.heading;
        pricing.volumeDiscounts.highlightedText =
            highlightedText || pricing.volumeDiscounts.highlightedText;
        pricing.volumeDiscounts.description = description || pricing.volumeDiscounts.description;
        pricing.volumeDiscounts.disclaimer = disclaimer || pricing.volumeDiscounts.disclaimer;
        pricing.lastUpdatedBy = req.adminId || "admin";
        await pricing.save();

        res.status(200).json({ success: true, data: pricing.volumeDiscounts });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const addVolumeTier = async (req, res) => {
    try {
        const { range, rate, isSpecial, order } = req.body;
        const pricing = await Pricing.getSingleton();

        const newTier = {
            range,
            rate,
            isSpecial: isSpecial || false,
            order: order || pricing.volumeDiscounts.tiers.length,
        };

        pricing.volumeDiscounts.tiers.push(newTier);
        pricing.lastUpdatedBy = req.adminId || "admin";
        await pricing.save();

        res.status(201).json({ success: true, data: newTier });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const updateVolumeTier = async (req, res) => {
    try {
        const { tierId } = req.params;
        const { range, rate, isSpecial, order } = req.body;
        const pricing = await Pricing.getSingleton();

        const tier = pricing.volumeDiscounts.tiers.id(tierId);
        if (!tier) {
            return res.status(404).json({ success: false, error: "Tier not found" });
        }

        if (range !== undefined) tier.range = range;
        if (rate !== undefined) tier.rate = rate;
        if (isSpecial !== undefined) tier.isSpecial = isSpecial;
        if (order !== undefined) tier.order = order;

        pricing.lastUpdatedBy = req.adminId || "admin";
        await pricing.save();

        res.status(200).json({ success: true, data: tier });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const deleteVolumeTier = async (req, res) => {
    try {
        const { tierId } = req.params;
        const pricing = await Pricing.getSingleton();

        pricing.volumeDiscounts.tiers = pricing.volumeDiscounts.tiers.filter(
            (tier) => tier._id.toString() !== tierId,
        );
        pricing.lastUpdatedBy = req.adminId || "admin";
        await pricing.save();

        res.status(200).json({ success: true, message: "Tier deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// ── Always Included Features ──────────────────────────────────────────────────
export const updateAlwaysIncludedMeta = async (req, res) => {
    try {
        const { title, headingPrefix, headingHighlighted } = req.body;
        const pricing = await Pricing.getSingleton();

        pricing.alwaysIncluded.title = title || pricing.alwaysIncluded.title;
        pricing.alwaysIncluded.headingPrefix =
            headingPrefix || pricing.alwaysIncluded.headingPrefix;
        pricing.alwaysIncluded.headingHighlighted =
            headingHighlighted || pricing.alwaysIncluded.headingHighlighted;
        pricing.lastUpdatedBy = req.adminId || "admin";
        await pricing.save();

        res.status(200).json({ success: true, data: pricing.alwaysIncluded });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const addFeature = async (req, res) => {
    try {
        const { number, title, description, order } = req.body;
        const pricing = await Pricing.getSingleton();

        const newFeature = {
            number,
            title,
            description,
            order: order || pricing.alwaysIncluded.features.length,
        };

        pricing.alwaysIncluded.features.push(newFeature);
        pricing.lastUpdatedBy = req.adminId || "admin";
        await pricing.save();

        res.status(201).json({ success: true, data: newFeature });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const updateFeature = async (req, res) => {
    try {
        const { featureId } = req.params;
        const { number, title, description, order } = req.body;
        const pricing = await Pricing.getSingleton();

        const feature = pricing.alwaysIncluded.features.id(featureId);
        if (!feature) {
            return res.status(404).json({ success: false, error: "Feature not found" });
        }

        if (number !== undefined) feature.number = number;
        if (title !== undefined) feature.title = title;
        if (description !== undefined) feature.description = description;
        if (order !== undefined) feature.order = order;

        pricing.lastUpdatedBy = req.adminId || "admin";
        await pricing.save();

        res.status(200).json({ success: true, data: feature });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const deleteFeature = async (req, res) => {
    try {
        const { featureId } = req.params;
        const pricing = await Pricing.getSingleton();

        pricing.alwaysIncluded.features = pricing.alwaysIncluded.features.filter(
            (feature) => feature._id.toString() !== featureId,
        );
        pricing.lastUpdatedBy = req.adminId || "admin";
        await pricing.save();

        res.status(200).json({ success: true, message: "Feature deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// ── FAQ ────────────────────────────────────────────────────────────────────────
export const updateFaqMeta = async (req, res) => {
    try {
        const { badge, heading, highlightedText } = req.body;
        const pricing = await Pricing.getSingleton();

        pricing.faq.badge = badge || pricing.faq.badge;
        pricing.faq.heading = heading || pricing.faq.heading;
        pricing.faq.highlightedText = highlightedText || pricing.faq.highlightedText;
        pricing.lastUpdatedBy = req.adminId || "admin";
        await pricing.save();

        res.status(200).json({ success: true, data: pricing.faq });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const addFaq = async (req, res) => {
    try {
        const { question, answer, order } = req.body;
        const pricing = await Pricing.getSingleton();

        const newFaq = {
            question,
            answer,
            order: order || pricing.faq.items.length,
        };

        pricing.faq.items.push(newFaq);
        pricing.lastUpdatedBy = req.adminId || "admin";
        await pricing.save();

        res.status(201).json({ success: true, data: newFaq });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const updateFaq = async (req, res) => {
    try {
        const { faqId } = req.params;
        const { question, answer, order } = req.body;
        const pricing = await Pricing.getSingleton();

        const faq = pricing.faq.items.id(faqId);
        if (!faq) {
            return res.status(404).json({ success: false, error: "FAQ not found" });
        }

        if (question !== undefined) faq.question = question;
        if (answer !== undefined) faq.answer = answer;
        if (order !== undefined) faq.order = order;

        pricing.lastUpdatedBy = req.adminId || "admin";
        await pricing.save();

        res.status(200).json({ success: true, data: faq });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const deleteFaq = async (req, res) => {
    try {
        const { faqId } = req.params;
        const pricing = await Pricing.getSingleton();

        pricing.faq.items = pricing.faq.items.filter((faq) => faq._id.toString() !== faqId);
        pricing.lastUpdatedBy = req.adminId || "admin";
        await pricing.save();

        res.status(200).json({ success: true, message: "FAQ deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
