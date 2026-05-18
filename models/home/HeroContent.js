// models/home/HeroContent.js
import mongoose from "mongoose";

const heroContentSchema = new mongoose.Schema(
    {
        eyebrow: {
            type: String,
            required: [true, "Eyebrow text is required"],
            trim: true,
        },
        headingPlain: {
            type: String,
            required: [true, "Heading plain text is required"],
            trim: true,
        },
        headingItalic: {
            type: String,
            required: [true, "Heading italic text is required"],
            trim: true,
        },
        paragraph: {
            type: String,
            required: [true, "Paragraph is required"],
            trim: true,
        },
        primaryBtn: {
            label: { type: String, required: true, trim: true },
            href: { type: String, required: true, trim: true },
        },
        secondaryBtn: {
            label: { type: String, required: true, trim: true },
            href: { type: String, required: true, trim: true },
        },
        heroImage: {
            type: String,
            required: [true, "Hero image is required"],
        },
    },
    { timestamps: true },
);

export default mongoose.model("HomeHeroContent", heroContentSchema);
