// seeders/serviceSeeder.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import Service from "../models/Service.js";

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/rapid-clipping-path";

const seedServices = async () => {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log("✅ Connected to MongoDB");

        // Check if services already exist
        const existingCount = await Service.countDocuments();
        if (existingCount > 0) {
            console.log(`⚠️ Services already exist (${existingCount} services). Skipping seed.`);
            console.log("💡 To re-seed, run: node seeders/serviceSeeder.js --force");
            process.exit(0);
        }

        // Seed data
        const services = [
            // ============================================
            // MAIN SERVICES (isSecondary: false)
            // ============================================

            // Service 1: Clipping Path
            {
                slug: "clipping-path",
                title: "Clipping Path",
                isActive: true,
                isSecondary: false,
                num: "01",
                price: "From $0.39 / img",
                order: 1,
                cardDescription:
                    "Hand-drawn paths for flawless product isolation with pixel-perfect edges.",
                cardImage:
                    "https://res.cloudinary.com/demo/image/upload/v1/samples/ecommerce/shoes.jpg",

                // Hero Section
                hero: {
                    badge: "Clipping Path · Core Service",
                    counter: "No. 01 of 12",
                    headlinePrimary: "Precision",
                    headlineItalic: "Clipping Path",
                    description:
                        "Hand-drawn vector paths that deliver perfectly isolated products with clean, natural edges—ready for any background.",
                    ctaPrimaryLabel: "Start Free Trial",
                    ctaPrimaryHref: "/contact",
                    ctaSecondaryLabel: "See Sample Work",
                    ctaSecondaryHref: "/portfolio",
                    backgroundImage:
                        "https://res.cloudinary.com/demo/image/upload/v1/samples/landscapes/beach-boat.jpg",
                },

                // Overview Section
                overview: {
                    eyebrow: "What It Is",
                    heading: "The industry standard for",
                    italicHeading: "product isolation.",
                    body: "A clipping path is a closed vector path that cuts out a specific area of an image. Our hand-drawn paths ensure perfectly smooth edges—even around complex curves—so your products look natural on any background.",
                    quote: "'The cleanest paths we've ever seen. No jaggies, no artifacts—just perfect results every time.'",
                },

                // Meta SEO
                meta: {
                    metaTitle: "Professional Clipping Path Service | Rapid Clipping Path",
                    metaDescription:
                        "Hand-drawn clipping path services for e-commerce, catalogs, and product photography. 24-hour turnaround, free trial available.",
                    metaKeywords: "clipping path, product isolation, image background removal",
                    canonicalUrl: "https://rapidclippingpath.com/services/clipping-path",
                    indexStatus: true,
                    followStatus: true,
                },

                // Stats
                stats: {
                    pricingLabel: "Starting at",
                    pricingValue: "0.39",
                    pricingUnit: "per image",
                    turnaroundLabel: "Turnaround",
                    turnaroundValue: "24-48",
                    turnaroundUnit: "hours",
                    ledByLabel: "Led By",
                    ledByValue: "Razon Roy",
                    specialtyLabel: "Specialty",
                    specialtyValue: "High-end",
                    specialtyUnit: "product isolation",
                },

                // Retoucher
                retoucher: {
                    eyebrow: "Led By",
                    name: "Razon Roy",
                    designation: "Co-Founder · Senior Retoucher",
                    quote: "Every path is drawn by hand, not by algorithms. That's how we guarantee perfection.",
                    bodyParagraphs: [
                        "With over 12 years of experience in high-end photo retouching, Razon has worked with luxury brands from New York to Paris.",
                        "His philosophy is simple: treat every image as if it's going on a billboard—because it might be.",
                    ],
                    image: "",
                },
            },

            // Service 2: Photo Retouching
            {
                slug: "photo-retouching",
                title: "Photo Retouching",
                isActive: true,
                isSecondary: false,
                num: "02",
                price: "From $1.99 / img",
                order: 2,
                cardDescription:
                    "Professional retouching that enhances beauty while maintaining natural realism.",
                cardImage:
                    "https://res.cloudinary.com/demo/image/upload/v1/samples/people/jazz.jpg",

                hero: {
                    badge: "Retouching · Core Service",
                    counter: "No. 02 of 12",
                    headlinePrimary: "Flawless",
                    headlineItalic: "Photo Retouching",
                    description:
                        "Professional retouching that enhances beauty, removes imperfections, and delivers natural-looking results.",
                    ctaPrimaryLabel: "Start Free Trial",
                    ctaPrimaryHref: "/contact",
                    ctaSecondaryLabel: "See Sample Work",
                    ctaSecondaryHref: "/portfolio",
                    backgroundImage:
                        "https://res.cloudinary.com/demo/image/upload/v1/samples/people/band.jpg",
                },

                overview: {
                    eyebrow: "What It Is",
                    heading: "Enhance beauty while",
                    italicHeading: "keeping it real.",
                    body: "Our retouching service removes distractions, enhances features, and perfects skin—all while maintaining the natural texture and character of the original image.",
                    quote: "'Finally, a retoucher who understands subtlety. My models still look like themselves—just better.'",
                },

                meta: {
                    metaTitle: "Professional Photo Retouching Service | Rapid Clipping Path",
                    metaDescription:
                        "High-end photo retouching for fashion, beauty, and portrait photography. Natural results, fast turnaround.",
                    metaKeywords: "photo retouching, beauty retouching, portrait retouching",
                    canonicalUrl: "https://rapidclippingpath.com/services/photo-retouching",
                    indexStatus: true,
                    followStatus: true,
                },

                stats: {
                    pricingLabel: "Starting at",
                    pricingValue: "1.99",
                    pricingUnit: "per image",
                    turnaroundLabel: "Turnaround",
                    turnaroundValue: "24-48",
                    turnaroundUnit: "hours",
                    ledByLabel: "Led By",
                    ledByValue: "Razon Roy",
                    specialtyLabel: "Specialty",
                    specialtyValue: "High-end",
                    specialtyUnit: "beauty retouching",
                },

                retoucher: {
                    eyebrow: "Led By",
                    name: "Razon Roy",
                    designation: "Co-Founder · Senior Retoucher",
                    quote: "Great retouching is invisible. If someone notices it, we've done too much.",
                    bodyParagraphs: [
                        "Razon has retouched over 50,000 images for brands including Nike, Sephora, and L'Oréal.",
                        "His approach balances commercial polish with natural authenticity.",
                    ],
                    image: "",
                },
            },

            // Service 3: Image Masking
            {
                slug: "image-masking",
                title: "Image Masking",
                isActive: true,
                isSecondary: true, // Secondary service
                num: "03",
                price: "From $0.89 / img",
                order: 3,
                cardDescription:
                    "Complex masking for hair, fur, and transparent objects with natural edge retention.",
                cardImage:
                    "https://res.cloudinary.com/demo/image/upload/v1/samples/animals/cat.jpg",

                hero: {
                    badge: "Masking · Secondary Service",
                    counter: "No. 03 of 12",
                    headlinePrimary: "Complex",
                    headlineItalic: "Image Masking",
                    description:
                        "Advanced masking techniques for hair, fur, lace, and transparent objects—preserving every delicate detail.",
                    ctaPrimaryLabel: "Start Free Trial",
                    ctaPrimaryHref: "/contact",
                    ctaSecondaryLabel: "See Sample Work",
                    ctaSecondaryHref: "/portfolio",
                    backgroundImage:
                        "https://res.cloudinary.com/demo/image/upload/v1/samples/animals/lion.jpg",
                },

                overview: {
                    eyebrow: "What It Is",
                    heading: "Preserve every strand,",
                    italicHeading: "every detail.",
                    body: "Image masking creates complex selections that clipping paths can't handle—like hair, fur, smoke, and transparent objects. Our masked images retain natural edge transitions.",
                    quote: "'I've never seen hair this perfectly extracted. No halos, no missing strands—just perfection.'",
                },

                meta: {
                    metaTitle: "Professional Image Masking Service | Rapid Clipping Path",
                    metaDescription:
                        "Expert image masking for hair, fur, and transparent objects. Flawless results with natural edge retention.",
                    metaKeywords: "image masking, hair masking, fur masking, complex masking",
                    canonicalUrl: "https://rapidclippingpath.com/services/image-masking",
                    indexStatus: true,
                    followStatus: true,
                },

                stats: {
                    pricingLabel: "Starting at",
                    pricingValue: "0.89",
                    pricingUnit: "per image",
                    turnaroundLabel: "Turnaround",
                    turnaroundValue: "24-48",
                    turnaroundUnit: "hours",
                    ledByLabel: "Led By",
                    ledByValue: "Razon Roy",
                    specialtyLabel: "Specialty",
                    specialtyValue: "Complex",
                    specialtyUnit: "masking",
                },

                retoucher: {
                    eyebrow: "Led By",
                    name: "Razon Roy",
                    designation: "Co-Founder · Senior Retoucher",
                    quote: "Masking is an art form. Anyone can use a computer to do it—but only experience teaches you how to do it right.",
                    bodyParagraphs: [
                        "Razon mastered masking techniques working with luxury catalogs that demanded perfection.",
                        "His team handles up to 5,000 complex masks per week without compromising quality.",
                    ],
                    image: "",
                },
            },

            // Service 4: Shadow Creation
            {
                slug: "shadow-creation",
                title: "Shadow Creation",
                isActive: true,
                isSecondary: true, // Secondary service
                num: "04",
                price: "From $0.49 / img",
                order: 4,
                cardDescription:
                    "Natural drop shadows, cast shadows, and reflection shadows for realistic product presentation.",
                cardImage:
                    "https://res.cloudinary.com/demo/image/upload/v1/samples/ecommerce/shoes.jpg",

                hero: {
                    badge: "Shadow · Secondary Service",
                    counter: "No. 04 of 12",
                    headlinePrimary: "Realistic",
                    headlineItalic: "Shadow Creation",
                    description:
                        "Professional shadow creation that adds depth and realism to your product images—natural, drop, cast, and reflection shadows.",
                    ctaPrimaryLabel: "Start Free Trial",
                    ctaPrimaryHref: "/contact",
                    ctaSecondaryLabel: "See Sample Work",
                    ctaSecondaryHref: "/portfolio",
                    backgroundImage:
                        "https://res.cloudinary.com/demo/image/upload/v1/samples/ecommerce/couch.jpg",
                },

                overview: {
                    eyebrow: "What It Is",
                    heading: "Add depth and",
                    italicHeading: "realism.",
                    body: "Professional shadows make products look grounded and natural. We create drop shadows, cast shadows, reflection shadows, and natural shadows—customized to your product and background.",
                    quote: "'The shadows look so natural, I had to check twice to make sure they weren't original.'",
                },

                meta: {
                    metaTitle: "Professional Shadow Creation Service | Rapid Clipping Path",
                    metaDescription:
                        "Expert shadow creation for e-commerce product photos. Natural, drop, cast, and reflection shadows available.",
                    metaKeywords: "shadow creation, drop shadow, cast shadow, reflection shadow",
                    canonicalUrl: "https://rapidclippingpath.com/services/shadow-creation",
                    indexStatus: true,
                    followStatus: true,
                },

                stats: {
                    pricingLabel: "Starting at",
                    pricingValue: "0.49",
                    pricingUnit: "per image",
                    turnaroundLabel: "Turnaround",
                    turnaroundValue: "24-48",
                    turnaroundUnit: "hours",
                    ledByLabel: "Led By",
                    ledByValue: "Razon Roy",
                    specialtyLabel: "Specialty",
                    specialtyValue: "Natural",
                    specialtyUnit: "shadows",
                },

                retoucher: {
                    eyebrow: "Led By",
                    name: "Razon Roy",
                    designation: "Co-Founder · Senior Retoucher",
                    quote: "A product without a shadow looks like it's floating. We ground your products in reality.",
                    bodyParagraphs: [
                        "Razon developed proprietary shadow techniques working with furniture and jewelry brands.",
                        "His shadows are mathematically precise yet visually natural.",
                    ],
                    image: "",
                },
            },

            // Service 5: Color Correction
            {
                slug: "color-correction",
                title: "Color Correction",
                isActive: true,
                isSecondary: true, // Secondary service
                num: "05",
                price: "From $0.79 / img",
                order: 5,
                cardDescription:
                    "Professional color grading and correction for consistent, accurate colors across your catalog.",
                cardImage:
                    "https://res.cloudinary.com/demo/image/upload/v1/samples/landscapes/beach-boat.jpg",

                hero: {
                    badge: "Color · Secondary Service",
                    counter: "No. 05 of 12",
                    headlinePrimary: "Perfect",
                    headlineItalic: "Color Correction",
                    description:
                        "Ensure consistent, accurate colors across your entire product catalog with our professional color correction service.",
                    ctaPrimaryLabel: "Start Free Trial",
                    ctaPrimaryHref: "/contact",
                    ctaSecondaryLabel: "See Sample Work",
                    ctaSecondaryHref: "/portfolio",
                    backgroundImage:
                        "https://res.cloudinary.com/demo/image/upload/v1/samples/landscapes/nature.jpg",
                },

                overview: {
                    eyebrow: "What It Is",
                    heading: "Consistent colors,",
                    italicHeading: "every time.",
                    body: "Color correction adjusts white balance, exposure, contrast, and saturation to ensure every image in your catalog looks consistent—matching the actual product colors exactly.",
                    quote: "'Finally, a service that understands color management. My white products are actually white now.'",
                },

                meta: {
                    metaTitle: "Professional Color Correction Service | Rapid Clipping Path",
                    metaDescription:
                        "Expert color correction and grading for e-commerce photography. Consistent, accurate colors across your entire catalog.",
                    metaKeywords:
                        "color correction, color grading, white balance, photo color correction",
                    canonicalUrl: "https://rapidclippingpath.com/services/color-correction",
                    indexStatus: true,
                    followStatus: true,
                },

                stats: {
                    pricingLabel: "Starting at",
                    pricingValue: "0.79",
                    pricingUnit: "per image",
                    turnaroundLabel: "Turnaround",
                    turnaroundValue: "24-48",
                    turnaroundUnit: "hours",
                    ledByLabel: "Led By",
                    ledByValue: "Razon Roy",
                    specialtyLabel: "Specialty",
                    specialtyValue: "Color",
                    specialtyUnit: "accuracy",
                },

                retoucher: {
                    eyebrow: "Led By",
                    name: "Razon Roy",
                    designation: "Co-Founder · Senior Retoucher",
                    quote: "Color is science and art. We master both.",
                    bodyParagraphs: [
                        "Razon is certified in color management and uses calibrated monitors for every project.",
                        "His team follows strict color profiles to match your brand's exact specifications.",
                    ],
                    image: "",
                },
            },

            // Service 6: Ghost Mannequin
            {
                slug: "ghost-mannequin",
                title: "Ghost Mannequin",
                isActive: true,
                isSecondary: true, // Secondary service
                num: "06",
                price: "From $2.49 / img",
                order: 6,
                cardDescription:
                    "Remove mannequins and create hollow-effect product images that appear natural and wearable.",
                cardImage:
                    "https://res.cloudinary.com/demo/image/upload/v1/samples/fashion/dress.jpg",

                hero: {
                    badge: "Ghost · Secondary Service",
                    counter: "No. 06 of 12",
                    headlinePrimary: "Invisible",
                    headlineItalic: "Ghost Mannequin",
                    description:
                        "Remove mannequins and create seamless hollow-effect images that make clothing look natural and wearable.",
                    ctaPrimaryLabel: "Start Free Trial",
                    ctaPrimaryHref: "/contact",
                    ctaSecondaryLabel: "See Sample Work",
                    ctaSecondaryHref: "/portfolio",
                    backgroundImage:
                        "https://res.cloudinary.com/demo/image/upload/v1/samples/fashion/shirt.jpg",
                },

                overview: {
                    eyebrow: "What It Is",
                    heading: "Remove the mannequin,",
                    italicHeading: "keep the shape.",
                    body: "Ghost mannequin service removes the mannequin from clothing photos while preserving the garment's natural shape—creating a clean, professional 'floating' effect that highlights the product.",
                    quote: "'The hollow effect looks so natural. My customers can finally see how the dress actually fits.'",
                },

                meta: {
                    metaTitle: "Professional Ghost Mannequin Service | Rapid Clipping Path",
                    metaDescription:
                        "Expert ghost mannequin photo editing for fashion e-commerce. Remove mannequins, create natural hollow effects.",
                    metaKeywords: "ghost mannequin, mannequin removal, fashion photo editing",
                    canonicalUrl: "https://rapidclippingpath.com/services/ghost-mannequin",
                    indexStatus: true,
                    followStatus: true,
                },

                stats: {
                    pricingLabel: "Starting at",
                    pricingValue: "2.49",
                    pricingUnit: "per image",
                    turnaroundLabel: "Turnaround",
                    turnaroundValue: "24-48",
                    turnaroundUnit: "hours",
                    ledByLabel: "Led By",
                    ledByValue: "Razon Roy",
                    specialtyLabel: "Specialty",
                    specialtyValue: "Fashion",
                    specialtyUnit: "editing",
                },

                retoucher: {
                    eyebrow: "Led By",
                    name: "Razon Roy",
                    designation: "Co-Founder · Senior Retoucher",
                    quote: "A great ghost mannequin edit makes you forget the mannequin was ever there.",
                    bodyParagraphs: [
                        "Razon has ghost-mannequin edited over 100,000 fashion products for brands like Zara, H&M, and ASOS.",
                        "His technique preserves fabric texture while removing all traces of the mannequin.",
                    ],
                    image: "",
                },
            },
        ];

        // Insert all services
        const result = await Service.insertMany(services);

        console.log("✅ Services seeded successfully!");
        console.log("📊 Summary:");
        console.log(`   - Total services: ${result.length}`);
        console.log(`   - Main services: ${result.filter((s) => !s.isSecondary).length}`);
        console.log(`   - Secondary services: ${result.filter((s) => s.isSecondary).length}`);
        console.log("\n📋 Services created:");
        result.forEach((service) => {
            console.log(
                `   - ${service.title} (${service.isSecondary ? "Secondary" : "Main"}) → /${service.slug}`,
            );
        });

        process.exit(0);
    } catch (error) {
        console.error("❌ Error seeding services:", error);
        process.exit(1);
    }
};

// Allow force re-seed with --force flag
if (process.argv.includes("--force")) {
    console.log("⚠️ Force mode enabled. Clearing existing data...");
    Service.deleteMany({})
        .then(() => {
            console.log("✅ Existing data cleared.");
            seedServices();
        })
        .catch((err) => {
            console.error("❌ Error clearing data:", err);
            process.exit(1);
        });
} else {
    seedServices();
}
