// models/Pricing.js
import mongoose from "mongoose";

// Per-Image Rate Schema
const perImageRateSchema = new mongoose.Schema({
    service: { type: String, required: true }, // "Clipping path"
    description: { type: String, required: true }, // "Hand-drawn cutouts, transparent backgrounds"
    rates: {
        basic: { type: String, required: true }, // "$0.39"
        simple: { type: String, required: true }, // "$0.69"
        medium: { type: String, required: true }, // "$1.25"
        complex: { type: String, required: true }, // "$2.50"
        superComplex: { type: String, required: true }, // "$4.50 +"
    },
    order: { type: Number, default: 0 },
});

// Tier Definition Schema (for bottom footnote)
const tierDefinitionSchema = new mongoose.Schema({
    name: { type: String, required: true }, // "BASIC", "SIMPLE", etc.
    description: { type: String, required: true },
    order: { type: Number, default: 0 },
});

// Sample/Recent Work Schema
const sampleWorkSchema = new mongoose.Schema({
    tier: { type: String, required: true }, // "BASIC TIER"
    title: { type: String, required: true }, // "Bottle on white background"
    price: { type: String, required: true }, // "$0.39 per image"
    afterImageUrl: { type: String, required: true },
    afterImagePublicId: { type: String, required: true },
    beforeImageUrl: { type: String, default: "" },
    beforeImagePublicId: { type: String, default: "" },
    order: { type: Number, default: 0 },
});

// Pricing Plan Schema
const pricingPlanSchema = new mongoose.Schema({
    name: { type: String, required: true }, // "Starter"
    subtitle: { type: String, required: true }, // "For small businesses"
    price: { type: Number, required: true }, // 299
    equivalent: { type: String, required: true }, // "$0.49 per image"
    isDark: { type: Boolean, default: false },
    isPopular: { type: Boolean, default: false },
    features: [{ type: String, required: true }],
    buttonText: { type: String, default: "Get Started" },
    order: { type: Number, default: 0 },
});

// Retouching Service Schema
const retouchingServiceSchema = new mongoose.Schema({
    title: { type: String, required: true }, // "Single-image retouching"
    description: { type: String, required: true }, // "Skin, beauty, editorial portrait work"
    price: { type: String, required: true }, // "$35 – $120"
    order: { type: Number, default: 0 },
});

// Volume Discount Tier Schema
const volumeDiscountSchema = new mongoose.Schema({
    range: { type: String, required: true }, // "1 – 499 images per month"
    rate: { type: String, required: true }, // "Standard rates"
    isSpecial: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
});

// Always Included Feature Schema
const alwaysIncludedFeatureSchema = new mongoose.Schema({
    number: { type: String, required: true }, // "—01"
    title: { type: String, required: true }, // "Hand-edited in Photoshop."
    description: { type: String, required: true },
    order: { type: Number, default: 0 },
});

// FAQ Schema
const faqSchema = new mongoose.Schema({
    question: { type: String, required: true },
    answer: { type: String, required: true },
    order: { type: Number, default: 0 },
});

// Main Pricing Schema
const pricingSchema = new mongoose.Schema(
    {
        // Hero Section
        hero: {
            badge: { type: String, default: "Transparent Pricing" },
            heading: {
                prefix: { type: String, default: "No hidden fees." },
                highlighted: { type: String, default: "No surprises." },
            },
            description: {
                type: String,
                default:
                    "Per-image rates for one-off orders. Monthly packages for ongoing work. Custom quotes for high-end projects. The numbers below are what you'll actually pay.",
            },
            features: {
                type: [String],
                default: ["No minimums", "Free revisions", "24-hour turnaround", "No contracts"],
            },
            navItems: {
                type: [String],
                default: [
                    "PER-IMAGE",
                    "SAMPLES",
                    "MONTHLY PACKAGES",
                    "HIGH-END RETOUCHING",
                    "VOLUME DISCOUNTS",
                    "COMMON QUESTIONS",
                ],
            },
        },

        // Per-Image Rates Section
        perImageRates: {
            badge: { type: String, default: "PER-IMAGE RATES" },
            heading: { type: String, default: "Pay only for what you order." },
            highlightedText: { type: String, default: "what you order." },
            description: {
                type: String,
                default:
                    "Our standard rates by service and complexity. Volume discounts apply automatically — see below for details.",
            },
            rates: [perImageRateSchema],
            tierDefinitions: [tierDefinitionSchema],
            footnote: {
                type: String,
                default:
                    "Not sure which tier applies? Send us a sample image — we'll tell you the complexity, and if we misjudge, we adjust mid-order at no extra cost.",
            },
        },

        // Recent Work/Samples Section
        recentWork: {
            title: { type: String, default: "See the work" },
            headingPrefix: { type: String, default: "What " },
            headingHighlighted: { type: String, default: "$0.39 buys you.." },
            paragraph: {
                type: String,
                default:
                    "Real samples across our most-used services. Hover any image to see the original.",
            },
            samples: [sampleWorkSchema],
        },

        // Monthly Packages Section
        monthlyPackages: {
            title: { type: String, default: "Monthly packages" },
            headingPrefix: { type: String, default: "For ongoing " },
            headingHighlighted: { type: String, default: "partnerships." },
            paragraph: {
                type: String,
                default:
                    "Predictable monthly capacity for brands and photographers with continuous editing needs. Priority queue, dedicated PM, rollover credits — and a better per-image rate than ad-hoc orders.",
            },
            plans: [pricingPlanSchema],
            footerText: {
                type: String,
                default:
                    "Need more than 600 images per month? We build custom enterprise packages for catalog companies, agencies, and photography studios.",
            },
        },

        // High-End Retouching Section
        retouching: {
            badge: { type: String, default: "High-End Retouching" },
            heading: { type: String, default: "Quoted per project." },
            highlightedText: { type: String, default: "per project." },
            description: {
                type: String,
                default:
                    "Editorial work, luxury product photography, and campaign-level retouching is priced by scope, not per image. Razon Roy leads every high-end engagement personally.",
            },
            services: [retouchingServiceSchema],
            ctaText: { type: String, default: "Email a brief" },
        },

        // Volume Discounts Section
        volumeDiscounts: {
            badge: { type: String, default: "Volume Discounts" },
            heading: { type: String, default: "The more you ship, the less you pay." },
            highlightedText: { type: String, default: "less you pay." },
            description: {
                type: String,
                default:
                    "Discounts apply automatically based on monthly image volume. No contracts, no commitments — just better pricing as you scale.",
            },
            tiers: [volumeDiscountSchema],
            disclaimer: {
                type: String,
                default: "Discounts calculated per calendar month, applied at invoicing.",
            },
        },

        // Always Included Section
        alwaysIncluded: {
            title: { type: String, default: "Always included" },
            headingPrefix: { type: String, default: "What's in " },
            headingHighlighted: { type: String, default: "every order." },
            features: [alwaysIncludedFeatureSchema],
        },

        // FAQ Section
        faq: {
            badge: { type: String, default: "Common Questions" },
            heading: { type: String, default: "Everything else you might ask." },
            highlightedText: { type: String, default: "you might ask." },
            items: [faqSchema],
        },

        // Metadata
        lastUpdatedBy: { type: String, default: "admin" },
        isActive: { type: Boolean, default: true },
    },
    {
        timestamps: true,
    },
);

// Ensure only one document exists (singleton pattern)
pricingSchema.statics.getSingleton = async function () {
    let pricing = await this.findOne();
    if (!pricing) {
        pricing = await this.create({});
    }
    return pricing;
};

const Pricing = mongoose.model("Pricing", pricingSchema);
export default Pricing;
