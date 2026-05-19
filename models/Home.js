// models/Home.js
import mongoose from "mongoose";

// ── Sub-schemas ───────────────────────────────────────────────────────────────

const heroSchema = new mongoose.Schema(
    {
        eyebrow: { type: String, default: "Book a free 30-minute call" },
        heading: {
            type: String,
            default: "Professional Photo Editing Services for eCommerce & Brands",
        },
        paragraph: { type: String, default: "" },
        image: { type: String, required: true }, // Cloudinary URL — always uploaded
    },
    { _id: false },
);

const companySchema = new mongoose.Schema(
    {
        title: { type: String, default: "Trusted by 4,000+ brands across 32 countries" },
        heading: { type: String, default: "Edits That Sell. Delivered While You Sleep" },
        logos: [
            {
                image: { type: String, required: true }, // Cloudinary URL — always uploaded
            },
        ],
    },
    { _id: false },
);

const serviceItemSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    icon: { type: String, required: true }, // Cloudinary URL — always uploaded
});

const servicesSchema = new mongoose.Schema(
    {
        sectionTitle: { type: String, default: "Our Professional Services" },
        sectionHeading: {
            type: String,
            default:
                "We provide a wide range of photo editing services tailored for your business needs",
        },
        items: [serviceItemSchema],
    },
    { _id: false },
);

const differenceItemSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    builtFor: [{ type: String }],
    beforeImage: { type: String, required: true }, // Cloudinary URL — always uploaded
    afterImage: { type: String, required: true }, // Cloudinary URL — always uploaded
    left: { type: Boolean, default: true },
});

const differenceSchema = new mongoose.Schema(
    {
        sectionTitle: { type: String, default: "See the Difference" },
        sectionHeading: {
            type: String,
            default: "Compare before and after results of our professional editing services",
        },
        items: [differenceItemSchema],
    },
    { _id: false },
);

const faqItemSchema = new mongoose.Schema({
    question: { type: String, required: true },
    answer: { type: String, required: true },
});

const faqSchema = new mongoose.Schema(
    {
        sectionTitle: { type: String, default: "Common questions" },
        sectionHeading: { type: String, default: "A few things people ask." },
        items: [faqItemSchema],
    },
    { _id: false },
);

// ── Root schema ───────────────────────────────────────────────────────────────

const homeSchema = new mongoose.Schema(
    {
        hero: heroSchema,
        company: companySchema,
        services: servicesSchema,
        difference: differenceSchema,
        faq: faqSchema,
    },
    { timestamps: true },
);

export default mongoose.model("Home", homeSchema);
