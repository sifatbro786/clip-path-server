// models/About.js
import mongoose from "mongoose";

const statsSchema = new mongoose.Schema({
    value: { type: String, required: true },
    suffix: { type: String, default: "" },
    description: { type: String, required: true },
    color: { type: String, enum: ["primary", "secondary"], default: "primary" },
    isItalic: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
});

const principleSchema = new mongoose.Schema({
    id: { type: String, required: true }, // "— 01 —"
    title: { type: String, required: true },
    description: { type: String, required: true },
    order: { type: Number, default: 0 },
});

const locationCardSchema = new mongoose.Schema({
    type: { type: String, enum: ["PRODUCTION STUDIO", "BUSINESS OPERATIONS"], required: true },
    title: { type: String, required: true }, // "Dhaka, Bangladesh" or "Norman, Oklahoma · USA"
    address: { type: String, required: true },
    hoursOrPhone: { type: String, required: true }, // Time zone info or phone number
    note: { type: String, default: "" }, // Additional italic note
    order: { type: Number, default: 0 },
});

const founderSocialSchema = new mongoose.Schema({
    label: { type: String, required: true }, // "FIVERR", "LINKEDIN", "UPWORK", "EMAIL"
    url: { type: String, required: true },
});

const founderSchema = new mongoose.Schema({
    name: { type: String, required: true },
    nickname: { type: String, default: "" }, // " — Fizz"
    subRole: { type: String, required: true }, // "CO-FOUNDER · HEAD OF PRODUCT"
    imageUrl: { type: String, required: true },
    imagePublicId: { type: String, required: true }, // For Cloudinary deletion
    bioParagraphs: [{ type: String, required: true }], // Array of paragraphs
    socials: [founderSocialSchema],
    order: { type: Number, default: 0 },
});

const aboutSchema = new mongoose.Schema(
    {
        // Hero Section
        hero: {
            establishmentYear: { type: String, default: "2014" },
            location: { type: String, default: "Dhaka, Bangladesh" },
            headline: { type: String, default: "Built By Craftsmen. Made For The World." },
            highlightedText: { type: String, default: "The World." },
            description: { type: String, required: true },
        },

        // Our Story Section
        ourStory: {
            title: { type: String, default: "Fifteen years of craft, brought into focus." },
            description: { type: String, required: true },
            paragraphs: [{ type: String, required: true }],
            blockquote: {
                text: { type: String, required: true },
                author: { type: String, default: "" },
            },
        },

        // Founders Section
        founders: {
            title: { type: String, default: "The founders" },
            headingPrefix: { type: String, default: "Two backgrounds. One " },
            headingHighlighted: { type: String, default: "studio." },
            paragraph: {
                type: String,
                default:
                    "A senior craftsman and a returning entrepreneur, building a photo editing studio shaped by both.",
            },
            foundersList: [founderSchema],
        },

        // Choose Section (Stats)
        chooseSection: {
            badge: { type: String, default: "BY THE NUMBERS" },
            heading: { type: String, default: "A studio measured in detail, not declarations." },
            stats: [statsSchema],
        },

        // Work Section (Principles)
        workSection: {
            badge: { type: String, default: "HOW WE WORK" },
            heading: { type: String, default: "Four principles. Held since 2014." },
            highlightedText: { type: String, default: "principles" },
            principles: [principleSchema],
        },

        // Where We Work Section
        whereWeWork: {
            badge: { type: String, default: "WHERE WE WORK" },
            heading: { type: String, default: "From Dhaka, for the world." },
            highlightedText: { type: String, default: "Dhaka" },
            description: { type: String, required: true },
            locations: [locationCardSchema],
        },

        // Quote Section
        quote: {
            text: { type: String, required: true },
            author: { type: String, default: "RAZON ROY & FIZZ RAHMAN, CO-FOUNDERS" },
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
aboutSchema.statics.getSingleton = async function () {
    let about = await this.findOne();
    if (!about) {
        about = await this.create({});
    }
    return about;
};

const About = mongoose.model("About", aboutSchema);
export default About;
