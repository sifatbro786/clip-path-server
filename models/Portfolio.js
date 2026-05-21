// models/Portfolio.js - সম্পূর্ণ ফাইল replace করুন

import mongoose from "mongoose";

// Hero Stats Schema
const heroStatSchema = new mongoose.Schema({
    value: { type: String, default: "" },
    label: { type: String, default: "" },
    accent: { type: Boolean, default: false },
});

// Hero CTA Schema
const heroCTASchema = new mongoose.Schema({
    label: { type: String, default: "Start Free Trial" },
    href: { type: String, default: "/trial" },
});

// Hero Schema
const heroSchema = new mongoose.Schema(
    {
        eyebrow: { type: String, default: "Our Work" },
        heading: { type: String, default: "Transforming eCommerce" },
        headingAccent: { type: String, default: "through precision editing." },
        body: {
            type: String,
            default: "See how we've helped brands scale with quality image editing.",
        },
        cta: { type: heroCTASchema, default: () => ({}) },
        stats: { type: [heroStatSchema], default: [] },
    },
    { _id: false },
);

// Process Step Schema
const processStepSchema = new mongoose.Schema({
    num: { type: String, default: "" },
    title: { type: String, default: "" },
    desc: { type: String, default: "" },
});

// Process Schema
const processSchema = new mongoose.Schema(
    {
        eyebrow: { type: String, default: "How We Work" },
        heading: { type: String, default: "A process built for" },
        headingAccent: { type: String, default: "speed and quality." },
        steps: { type: [processStepSchema], default: [] },
    },
    { _id: false },
);

// Featured Case Quote Schema
const featuredCaseQuoteSchema = new mongoose.Schema(
    {
        text: { type: String, default: "" },
        author: { type: String, default: "" },
        role: { type: String, default: "" },
    },
    { _id: false },
);

// Featured Case Stat Schema
const featuredCaseStatSchema = new mongoose.Schema(
    {
        value: { type: String, default: "" },
        label: { type: String, default: "" },
    },
    { _id: false },
);

// Featured Case Schema
const featuredCaseSchema = new mongoose.Schema({
    image: { type: String, default: "" },
    imagePublicId: { type: String, default: "" },
    eyebrow: { type: String, default: "Featured Case Study" },
    title: { type: String, default: "Scaling a luxury" },
    titleAccent: { type: String, default: "watch brand." },
    challenge: { type: String, default: "" },
    stats: { type: [featuredCaseStatSchema], default: [] },
    quote: { type: featuredCaseQuoteSchema, default: () => ({}) },
});

// Work Example Schema
const workExampleSchema = new mongoose.Schema({
    image: { type: String, default: "" },
    imagePublicId: { type: String, default: "" },
    service: { type: String, default: "" },
    title: { type: String, default: "" },
    description: { type: String, default: "" },
    order: { type: Number, default: 0 },
});

// Case Study Schema
const caseStudySchema = new mongoose.Schema({
    image: { type: String, default: "" },
    imagePublicId: { type: String, default: "" },
    num: { type: String, default: "" },
    title: { type: String, default: "" },
    category: { type: String, default: "E-commerce" },
    service: { type: String, default: "" },
    volume: { type: String, default: "" },
    turnaround: { type: String, default: "" },
    challenge: { type: String, default: "" },
    result: { type: String, default: "" },
    order: { type: Number, default: 0 },
});

// Testimonial Schema
const testimonialSchema = new mongoose.Schema({
    quote: { type: String, default: "" },
    author: { type: String, default: "" },
    role: { type: String, default: "" },
    company: { type: String, default: "" },
    category: { type: String, default: "" },
    order: { type: Number, default: 0 },
});

// Main Portfolio Schema
const portfolioSchema = new mongoose.Schema(
    {
        version: { type: String, default: "1.0" },
        hero: { type: heroSchema, default: () => ({}) },
        process: { type: processSchema, default: () => ({}) },
        featuredCase: { type: featuredCaseSchema, default: () => ({}) },
        workExamples: { type: [workExampleSchema], default: [] },
        caseStudies: { type: [caseStudySchema], default: [] },
        testimonials: { type: [testimonialSchema], default: [] },
        isActive: { type: Boolean, default: true },
        lastUpdatedBy: { type: String, default: "admin" },
    },
    {
        timestamps: true,
    },
);

// Ensure only one document exists (singleton pattern)
portfolioSchema.statics.getSingleton = async function () {
    let portfolio = await this.findOne({ isActive: true });
    if (!portfolio) {
        portfolio = await this.create({
            version: "1.0",
            hero: {
                eyebrow: "Our Work",
                heading: "Transforming eCommerce",
                headingAccent: "through precision editing.",
                body: "See how we've helped brands scale with quality image editing.",
                cta: { label: "Start Free Trial", href: "/trial" },
                stats: [
                    { value: "4,000+", label: "Brands Served", accent: false },
                    { value: "2.5M+", label: "Images Edited", accent: true },
                    { value: "32", label: "Countries", accent: false },
                ],
            },
            process: {
                eyebrow: "How We Work",
                heading: "A process built for",
                headingAccent: "speed and quality.",
                steps: [],
            },
            featuredCase: {
                image: "",
                imagePublicId: "",
                eyebrow: "Featured Case Study",
                title: "Scaling a luxury",
                titleAccent: "watch brand.",
                challenge: "",
                stats: [],
                quote: { text: "", author: "", role: "" },
            },
            workExamples: [],
            caseStudies: [],
            testimonials: [],
        });
    }
    return portfolio;
};

const Portfolio = mongoose.model("Portfolio", portfolioSchema);
export default Portfolio;
