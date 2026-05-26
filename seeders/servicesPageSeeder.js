// seeders/servicesPageSeeder.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import ServicesPage from "../models/ServicesPage.js";

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/rapid-clipping-path";

const seedServicesPage = async () => {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log("Connected to MongoDB");

        // Check if data already exists
        const existing = await ServicesPage.findOne();
        if (existing) {
            console.log("Services page data already exists. Skipping seed.");
            process.exit(0);
        }

        // Seed data
        const servicesPageData = {
            hero: {
                slides: [
                    {
                        tag: "Core Services",
                        headlinePrimary: "Precision Clipping",
                        headlineItalic: "Path experts",
                        sub: "Hand-drawn paths for flawless product isolation",
                        cta: "Explore Service",
                        ctaTo: "/services/clipping-path",
                        image: "https://res.cloudinary.com/demo/image/upload/v1/samples/landscapes/beach-boat.jpg",
                        order: 1,
                    },
                    {
                        tag: "Core Services",
                        headlinePrimary: "Professional",
                        headlineItalic: "Photo Retouching",
                        sub: "High-end retouching for jewelry, fashion, and products",
                        cta: "Explore Service",
                        ctaTo: "/services/photo-retouching",
                        image: "https://res.cloudinary.com/demo/image/upload/v1/samples/people/jazz.jpg",
                        order: 2,
                    },
                    {
                        tag: "Core Services",
                        headlinePrimary: "Advanced",
                        headlineItalic: "Image Masking",
                        sub: "Complex hair, fur, and transparent object masking",
                        cta: "Explore Service",
                        ctaTo: "/services/image-masking",
                        image: "https://res.cloudinary.com/demo/image/upload/v1/samples/fashion/woman-posing.jpg",
                        order: 3,
                    },
                ],
            },
            useCases: {
                eyebrow: "When you need it",
                headingPrimary: "Six common",
                headingItalic: "use cases.",
                items: [
                    {
                        title: "E-commerce Product Photography",
                        description:
                            "Clean, consistent product images for online stores that increase conversion rates.",
                        order: 1,
                    },
                    {
                        title: "Catalog & Lookbook Production",
                        description:
                            "Bulk image processing for seasonal catalogs and marketing materials.",
                        order: 2,
                    },
                    {
                        title: "Jewelry & Luxury Goods",
                        description: "High-end retouching that preserves sparkle and detail.",
                        order: 3,
                    },
                    {
                        title: "Real Estate Photography",
                        description: "Virtual staging, sky replacement, and property enhancement.",
                        order: 4,
                    },
                    {
                        title: "Fashion & Portrait",
                        description: "Skin smoothing, color correction, and body sculpting.",
                        order: 5,
                    },
                    {
                        title: "Automotive Photography",
                        description:
                            "Reflection control, background cleanup, and paint perfection.",
                        order: 6,
                    },
                ],
            },
            comparison: {
                eyebrow: "HAND-DRAWN VS. AI",
                heading: "Why we still draw by hand.",
                headingItalic: "draw by hand.",
                subtext:
                    "AI tools are fast, but they can't match the precision of a human hand. Here's why.",
                rows: [
                    {
                        feature: "Hair and fur edges",
                        aiResult: "Soft, blurry, often cropped",
                        ourResult: "Pixel-perfect at full zoom",
                        order: 1,
                    },
                    {
                        feature: "Transparent objects (glass, jewelry)",
                        aiResult: "Loses transparency, looks fake",
                        ourResult: "Preserves natural transparency and sparkle",
                        order: 2,
                    },
                    {
                        feature: "Complex shapes (cars, furniture)",
                        aiResult: "Jagged edges, color bleeding",
                        ourResult: "Smooth, precise vector paths",
                        order: 3,
                    },
                    {
                        feature: "Shadow creation",
                        aiResult: "Basic drop shadows only",
                        ourResult: "Natural cast shadows with depth",
                        order: 4,
                    },
                    {
                        feature: "Batch consistency",
                        aiResult: "Inconsistent between images",
                        ourResult: "Uniform across entire catalog",
                        order: 5,
                    },
                ],
            },
            deliverables: {
                eyebrow: "WHAT YOU GET",
                headingPrimary: "Every order, the",
                headingItalic: "same standard.",
                description:
                    "We deliver more than just edited images. Here's what's included with every order.",
                items: [
                    {
                        title: "Hand-drawn Photoshop paths",
                        description:
                            "Vector paths created manually for perfect edges, not automated.",
                        order: 1,
                    },
                    {
                        title: "High-resolution output",
                        description:
                            "Images delivered at your required resolution, never compressed.",
                        order: 2,
                    },
                    {
                        title: "Layered PSD files",
                        description: "Editable source files with masks and adjustment layers.",
                        order: 3,
                    },
                    {
                        title: "Free trial (3 images)",
                        description: "Test our quality before committing to a paid order.",
                        order: 4,
                    },
                    {
                        title: "24-hour turnaround",
                        description: "Fast delivery without compromising quality.",
                        order: 5,
                    },
                    {
                        title: "Unlimited revisions",
                        description: "We work until you're completely satisfied.",
                        order: 6,
                    },
                ],
            },
            faq: {
                eyebrow: "COMMON QUESTIONS",
                headingPrimary: "Everything else",
                headingItalic: "you might ask.",
                items: [
                    {
                        question: "What file formats do you accept?",
                        answer: "We accept JPEG, PNG, TIFF, PSD, RAW (CR2, NEF, ARW), and HEIC files. For bulk orders, we can accept ZIP archives.",
                        order: 1,
                    },
                    {
                        question: "How fast is your turnaround time?",
                        answer: "Standard turnaround is 24-48 hours. Rush orders can be completed in 12 hours for an additional 50% fee.",
                        order: 2,
                    },
                    {
                        question: "Do you offer bulk discounts?",
                        answer: "Yes! We offer volume discounts starting at 100 images. Contact our sales team for a custom quote.",
                        order: 3,
                    },
                    {
                        question: "How does the free trial work?",
                        answer: "Send us 3 sample images. We'll retouch them for free within 24 hours. No credit card required, no commitment to continue.",
                        order: 4,
                    },
                    {
                        question: "What's your quality guarantee?",
                        answer: "100% satisfaction guaranteed. If you're not happy with the results, we'll revise until you are — at no extra cost.",
                        order: 5,
                    },
                    {
                        question: "How do I place a bulk order?",
                        answer: "You can upload via our web platform, FTP, Google Drive, Dropbox, or WeTransfer. We'll provide instructions after you contact us.",
                        order: 6,
                    },
                ],
            },
        };

        const result = await ServicesPage.create(servicesPageData);
        console.log("✅ Services page seeded successfully!");
        console.log("📊 Data created:", {
            heroSlides: result.hero.slides.length,
            useCases: result.useCases.items.length,
            comparisonRows: result.comparison.rows.length,
            deliverables: result.deliverables.items.length,
            faqs: result.faq.items.length,
        });

        process.exit(0);
    } catch (error) {
        console.error("❌ Error seeding services page:", error);
        process.exit(1);
    }
};

seedServicesPage();
