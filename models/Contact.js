// models/Contact.js
//
// Mongoose discriminator pattern:
//   Base schema  → shared _id, type, timestamps only
//   Submission   → form fields (jobName, email, etc.)
//   PageContent  → all CMS text fields (hero, assurance, formLeft)
//
// This is the correct fix for the "page content defaults leaking into
// submission documents" problem. Each discriminator has its OWN schema,
// so mongoose never injects the other's defaults.

import mongoose from "mongoose";

// ═════════════════════════════════════════════════════════════════════════════
// BASE SCHEMA  — only what every document shares
// ═════════════════════════════════════════════════════════════════════════════
const baseOptions = {
    discriminatorKey: "type", // stored as "type" field in MongoDB
    timestamps: true,
    collection: "contacts", // single collection for both kinds
};

const contactBaseSchema = new mongoose.Schema({}, baseOptions);

contactBaseSchema.index({ type: 1, createdAt: -1 });

const Contact = mongoose.model("Contact", contactBaseSchema);

// ═════════════════════════════════════════════════════════════════════════════
// DISCRIMINATOR 1 — Submission
// Only these fields are written when a user submits the contact form.
// ═════════════════════════════════════════════════════════════════════════════
const submissionSchema = new mongoose.Schema({
    jobName: {
        type: String,
        required: [true, "Job name is required"],
        trim: true,
        maxlength: [200, "Job name cannot exceed 200 characters"],
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        trim: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address"],
    },
    instructions: {
        type: String,
        trim: true,
        maxlength: [5000, "Instructions cannot exceed 5000 characters"],
    },
    estimatedTime: {
        type: String,
        trim: true,
    },
    filePaths: {
        type: [String],
        default: [],
    },
    status: {
        type: String,
        enum: ["new", "in_progress", "completed", "archived"],
        default: "new",
    },
});

export const Submission = Contact.discriminator("submission", submissionSchema);

// ═════════════════════════════════════════════════════════════════════════════
// DISCRIMINATOR 2 — PageContent
// One singleton document. Hero + Assurance + FormLeft — every text field named.
// ═════════════════════════════════════════════════════════════════════════════

const heroStatSchema = new mongoose.Schema(
    {
        stat: { type: String, default: "", trim: true },
        label: { type: String, default: "", trim: true },
        accent: { type: Boolean, default: false },
    },
    { _id: false },
);

const assuranceCardSchema = new mongoose.Schema(
    {
        num: { type: String, default: "" },
        title: { type: String, default: "", trim: true },
        body: { type: String, default: "", trim: true },
    },
    { _id: false },
);

const channelSchema = new mongoose.Schema(
    {
        label: { type: String, default: "", trim: true },
        email: { type: String, default: "", trim: true },
    },
    { _id: false },
);

const pageContentSchema = new mongoose.Schema({
    // ── Hero ─────────────────────────────────────────────────────────────────
    hero: {
        eyebrow: { type: String, default: "Get in touch", trim: true },
        headingLine1: { type: String, default: "Let\u2019s bring your craft", trim: true },
        headingLine2Italic: { type: String, default: "into focus.", trim: true },
        bodyText: {
            type: String,
            default:
                "Whether you have a batch of 10 or 10,000 \u2014 tell us what you need. We respond to every inquiry within one business day.",
            trim: true,
        },
        stats: {
            type: [heroStatSchema],
            default: [
                { stat: "24hr", label: "Response guarantee", accent: true },
                { stat: "4,500+", label: "Brands served", accent: false },
                { stat: "99.4%", label: "Satisfaction rate", accent: false },
            ],
        },
    },

    // ── Assurance Strip ───────────────────────────────────────────────────────
    assurance: {
        eyebrow: { type: String, default: "Before you hit send", trim: true },
        subtext: { type: String, default: "A few things we want you to know.", trim: true },
        cards: {
            type: [assuranceCardSchema],
            default: [
                {
                    num: "01",
                    title: "Free trial \u2014 3 images",
                    body: "Test our quality before committing to anything. No card required.",
                },
                {
                    num: "02",
                    title: "Revision until right",
                    body: "If an edge isn\u2019t perfect, we redraw it. No arguments, no extra charge.",
                },
                {
                    num: "03",
                    title: "NDA on request",
                    body: "Confidentiality agreements available for agencies and studios handling client IP.",
                },
                {
                    num: "04",
                    title: "Dedicated account manager",
                    body: "For orders above 500 images/month, you get a single point of contact.",
                },
            ],
        },
    },

    // ── Form left sidebar ─────────────────────────────────────────────────────
    formLeft: {
        eyebrow: { type: String, default: "Direct channels", trim: true },
        channels: {
            type: [channelSchema],
            default: [
                { label: "General Enquiries", email: "hello@rapidclipping.com" },
                { label: "Ongoing Projects", email: "support@rapidclipping.com" },
                { label: "Press & Partnerships", email: "press@rapidclipping.com" },
            ],
        },
        workingHoursLabel: { type: String, default: "Working hours", trim: true },
        workingHoursText: {
            type: String,
            default: "Monday \u2013 Saturday\n9:00 AM \u2013 7:00 PM (GMT+6)",
            trim: true,
        },
        trialBadgeHeading: { type: String, default: "First time here?", trim: true },
        trialBadgeBody: {
            type: String,
            default:
                "Try 3 images free \u2014 no card required. Send us your files and we\u2019ll show you what we can do.",
            trim: true,
        },
    },
});

// Singleton helpers
pageContentSchema.statics.getSingleton = function () {
    return this.findOne().lean();
};

pageContentSchema.statics.updateSingleton = function (fields) {
    // Strip any attempt to overwrite the discriminator key
    const { type: _t, _id, ...safe } = fields;
    return this.findOneAndUpdate(
        {},
        { $set: safe },
        { new: true, upsert: true, runValidators: true },
    );
};

export const PageContent = Contact.discriminator("page_content", pageContentSchema);

export default Contact;
