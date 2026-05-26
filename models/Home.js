// models/Home.js
import mongoose from "mongoose";

// ── Sub-schemas ───────────────────────────────────────────────────────────────

const heroSchema = new mongoose.Schema(
    {
        eyebrow: { type: String, default: "Book a free 30-minute call" },
        headingPrimary: { type: String, default: "Professional Photo Editing Services for" },
        headingHighlight: { type: String, default: "eCommerce & Brands" },
        paragraph: { type: String, default: "" },
        image: { type: String, required: true }, // Cloudinary URL
    },
    { _id: false },
);

const companySchema = new mongoose.Schema(
    {
        eyebrow: { type: String, default: "Trusted by 4,000+ brands across 32 countries" },
        headingPrimary: { type: String, default: "Edits That Sell. Delivered While" },
        headingHighlight: { type: String, default: "You Sleep" },
        logos: [
            { image: { type: String, required: true } }, // Cloudinary URL
        ],
    },
    { _id: false },
);

const faqItemSchema = new mongoose.Schema({
    question: { type: String, required: true },
    answer: { type: String, required: true },
});

const faqSchema = new mongoose.Schema(
    {
        eyebrow: { type: String, default: "Common questions" },
        headingPrimary: { type: String, default: "A few things" },
        headingHighlight: { type: String, default: "people ask." },
        items: [faqItemSchema],
    },
    { _id: false },
);

// ── Root schema ───────────────────────────────────────────────────────────────

const homeSchema = new mongoose.Schema(
    {
        hero: heroSchema,
        company: companySchema,
        faq: faqSchema,
    },
    { timestamps: true },
);

export default mongoose.model("Home", homeSchema);
