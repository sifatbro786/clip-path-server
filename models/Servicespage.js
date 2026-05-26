import mongoose from "mongoose";

const { Schema } = mongoose;

// ── Hero Slide ────────────────────────────────────────────────────────────────
const HeroSlideSchema = new Schema({
    tag: { type: String, required: true }, // "Core Services"
    headlinePrimary: { type: String, required: true }, // "Precision Clipping"
    headlineItalic: { type: String, required: true }, // "Path experts"
    sub: { type: String, required: true },
    cta: { type: String, default: "Explore Service" },
    ctaTo: { type: String, required: true }, // "/services/clipping-path"
    image: { type: String, required: true }, // Cloudinary URL
    order: { type: Number, default: 0 },
});

// ── Difference Item ───────────────────────────────────────────────────────────
const DifferenceItemSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    beforeImage: { type: String, required: true },
    afterImage: { type: String, required: true },
    builtFor: [{ type: String }],
    left: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
});

// ── Difference Section ────────────────────────────────────────────────────────
const DifferenceSectionSchema = new Schema({
    eyebrow: { type: String, default: "What Makes Us Different" },
    headingPrimary: { type: String, default: "The difference is" },
    headingHighlight: { type: String, default: "in the detail." },
    items: [DifferenceItemSchema],
    isActive: { type: Boolean, default: true },
});

// ── Use Case Item ─────────────────────────────────────────────────────────────
const UseCaseSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    order: { type: Number, default: 0 },
});

// ── Comparison Row (HandDrawn table) ──────────────────────────────────────────
const ComparisonRowSchema = new Schema({
    feature: { type: String, required: true }, // "Hair and fur edges"
    aiResult: { type: String, required: true }, // "Soft, blurry, often cropped"
    ourResult: { type: String, required: true }, // "Pixel-perfect at full zoom"
    order: { type: Number, default: 0 },
});

// ── Deliverable Item (WhatYouGet) ─────────────────────────────────────────────
const DeliverableSchema = new Schema({
    title: { type: String, required: true }, // "Hand-drawn Photoshop paths"
    description: { type: String, required: true },
    order: { type: Number, default: 0 },
});

// ── FAQ Item ──────────────────────────────────────────────────────────────────
const FaqSchema = new Schema({
    question: { type: String, required: true },
    answer: { type: String, required: true },
    order: { type: Number, default: 0 },
});

// ── Main ServicesPage Schema ──────────────────────────────────────────────────
const ServicesPageSchema = new Schema(
    {
        // ServiceHero component
        hero: {
            slides: [HeroSlideSchema],
        },
        
        difference: DifferenceSectionSchema,
        // UseCases component
        useCases: {
            eyebrow: { type: String, default: "When you need it" },
            headingPrimary: { type: String, default: "Six common" },
            headingItalic: { type: String, default: "use cases." },
            items: [UseCaseSchema],
        },

        // HandDrawn component (comparison table)
        comparison: {
            eyebrow: { type: String, default: "HAND-DRAWN VS. AI" },
            heading: { type: String, default: "Why we still draw by hand." },
            headingItalic: { type: String, default: "draw by hand." },
            subtext: { type: String },
            rows: [ComparisonRowSchema],
        },

        // WhatYouGet component
        deliverables: {
            eyebrow: { type: String, default: "WHAT YOU GET" },
            headingPrimary: { type: String, default: "Every order, the" },
            headingItalic: { type: String, default: "same standard." },
            description: { type: String },
            items: [DeliverableSchema],
        },

        // Questions component (serviceFaq)
        faq: {
            eyebrow: { type: String, default: "COMMON QUESTIONS" },
            headingPrimary: { type: String, default: "Everything else" },
            headingItalic: { type: String, default: "you might ask." },
            items: [FaqSchema],
        },
    },
    {
        timestamps: true,
    },
);

export default mongoose.model("ServicesPage", ServicesPageSchema);
