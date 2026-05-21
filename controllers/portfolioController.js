// controllers/portfolioController.js
import Portfolio from "../models/Portfolio.js";
import { cloudinary } from "../config/cloudinary.js";

// ── Get Portfolio Data ──────────────────────────────────────────────────────────
export const getPortfolioData = async (req, res) => {
    try {
        const portfolio = await Portfolio.getSingleton();
        res.status(200).json({
            success: true,
            data: portfolio,
        });
    } catch (error) {
        console.error("Error fetching portfolio data:", error);
        res.status(500).json({ success: false, error: error.message });
    }
};

// ── Update Section (Generic) ───────────────────────────────────────────────────
export const updateSection = async (req, res) => {
    try {
        const { section } = req.params;
        const updateData = req.body;
        const portfolio = await Portfolio.getSingleton();

        const allowedSections = ["hero", "process", "featuredCase"];
        if (!allowedSections.includes(section)) {
            return res.status(400).json({ success: false, error: "Invalid section" });
        }

        portfolio[section] = { ...portfolio[section].toObject(), ...updateData };
        portfolio.lastUpdatedBy = req.adminId || "admin";
        await portfolio.save();

        res.status(200).json({ success: true, data: portfolio[section] });
    } catch (error) {
        console.error("Error updating section:", error);
        res.status(500).json({ success: false, error: error.message });
    }
};

// ── Work Examples CRUD ─────────────────────────────────────────────────────────
export const addWorkExample = async (req, res) => {
    try {
        const { service, title, description, order } = req.body;

        if (!req.file) {
            return res.status(400).json({ success: false, error: "Image is required" });
        }

        const portfolio = await Portfolio.getSingleton();

        const newExample = {
            image: req.file.path,
            imagePublicId: req.file.filename,
            service,
            title,
            description,
            order: order || portfolio.workExamples.length,
        };

        portfolio.workExamples.push(newExample);
        portfolio.lastUpdatedBy = req.adminId || "admin";
        await portfolio.save();

        res.status(201).json({ success: true, data: newExample });
    } catch (error) {
        if (req.file) {
            await cloudinary.uploader.destroy(req.file.filename);
        }
        res.status(500).json({ success: false, error: error.message });
    }
};

export const updateWorkExample = async (req, res) => {
    try {
        const { exampleId } = req.params;
        const { service, title, description, order } = req.body;
        const portfolio = await Portfolio.getSingleton();

        const example = portfolio.workExamples.id(exampleId);
        if (!example) {
            return res.status(404).json({ success: false, error: "Work example not found" });
        }

        if (req.file) {
            await cloudinary.uploader.destroy(example.imagePublicId);
            example.image = req.file.path;
            example.imagePublicId = req.file.filename;
        }

        if (service !== undefined) example.service = service;
        if (title !== undefined) example.title = title;
        if (description !== undefined) example.description = description;
        if (order !== undefined) example.order = order;

        portfolio.lastUpdatedBy = req.adminId || "admin";
        await portfolio.save();

        res.status(200).json({ success: true, data: example });
    } catch (error) {
        if (req.file) {
            await cloudinary.uploader.destroy(req.file.filename);
        }
        res.status(500).json({ success: false, error: error.message });
    }
};

export const deleteWorkExample = async (req, res) => {
    try {
        const { exampleId } = req.params;
        const portfolio = await Portfolio.getSingleton();

        const example = portfolio.workExamples.id(exampleId);
        if (!example) {
            return res.status(404).json({ success: false, error: "Work example not found" });
        }

        await cloudinary.uploader.destroy(example.imagePublicId);

        portfolio.workExamples = portfolio.workExamples.filter(
            (ex) => ex._id.toString() !== exampleId,
        );
        portfolio.lastUpdatedBy = req.adminId || "admin";
        await portfolio.save();

        res.status(200).json({ success: true, message: "Work example deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// ── Update Featured Case with Image ───────────────────────────────────────────
export const updateFeaturedCase = async (req, res) => {
    try {
        console.log("=== updateFeaturedCase START ===");
        console.log("req.file:", req.file);
        console.log("req.body:", req.body);

        const portfolio = await Portfolio.getSingleton();

        // বর্তমান featuredCase ডাটা নিন
        let updatedData = { ...portfolio.featuredCase.toObject() };

        // body থেকে ডাটা আপডেট করুন
        const { eyebrow, title, titleAccent, challenge, quoteText, quoteAuthor, quoteRole } =
            req.body;

        if (eyebrow !== undefined) updatedData.eyebrow = eyebrow;
        if (title !== undefined) updatedData.title = title;
        if (titleAccent !== undefined) updatedData.titleAccent = titleAccent;
        if (challenge !== undefined) updatedData.challenge = challenge;

        // Quote আপডেট
        if (quoteText !== undefined || quoteAuthor !== undefined || quoteRole !== undefined) {
            updatedData.quote = {
                text:
                    quoteText !== undefined ? quoteText : portfolio.featuredCase.quote?.text || "",
                author:
                    quoteAuthor !== undefined
                        ? quoteAuthor
                        : portfolio.featuredCase.quote?.author || "",
                role:
                    quoteRole !== undefined ? quoteRole : portfolio.featuredCase.quote?.role || "",
            };
        }

        // Stats আপডেট (যদি পাঠানো হয়)
        if (req.body.stats) {
            updatedData.stats = JSON.parse(req.body.stats);
        }

        // Image আপডেট (যদি নতুন ফাইল আসে)
        if (req.file) {
            // পুরনো ইমেজ ডিলিট করুন
            if (portfolio.featuredCase.imagePublicId) {
                try {
                    await cloudinary.uploader.destroy(portfolio.featuredCase.imagePublicId);
                    console.log("Old image deleted:", portfolio.featuredCase.imagePublicId);
                } catch (err) {
                    console.error("Error deleting old image:", err);
                }
            }

            updatedData.image = req.file.path;
            updatedData.imagePublicId = req.file.filename;
            console.log("New image uploaded:", req.file.path);
        }

        // আপডেট করা ডাটা সেট করুন
        portfolio.featuredCase = updatedData;
        portfolio.lastUpdatedBy = req.adminId || "admin";
        await portfolio.save();

        console.log("Featured case updated successfully");
        res.status(200).json({ success: true, data: portfolio.featuredCase });
    } catch (error) {
        console.error("Error updating featured case:", error);
        // নতুন আপলোড করা ইমেজ ডিলিট করুন যদি error হয়
        if (req.file) {
            try {
                await cloudinary.uploader.destroy(req.file.filename);
            } catch (err) {
                console.error("Cleanup error:", err);
            }
        }
        res.status(500).json({ success: false, error: error.message });
    }
};

// ── Case Studies CRUD ──────────────────────────────────────────────────────────
export const addCaseStudy = async (req, res) => {
    try {
        const { num, title, category, service, volume, turnaround, challenge, result, order } =
            req.body;

        if (!req.file) {
            return res.status(400).json({ success: false, error: "Image is required" });
        }

        const portfolio = await Portfolio.getSingleton();

        const newCaseStudy = {
            image: req.file.path,
            imagePublicId: req.file.filename,
            num,
            title,
            category,
            service,
            volume,
            turnaround,
            challenge,
            result,
            order: order || portfolio.caseStudies.length,
        };

        portfolio.caseStudies.push(newCaseStudy);
        portfolio.lastUpdatedBy = req.adminId || "admin";
        await portfolio.save();

        res.status(201).json({ success: true, data: newCaseStudy });
    } catch (error) {
        if (req.file) {
            await cloudinary.uploader.destroy(req.file.filename);
        }
        res.status(500).json({ success: false, error: error.message });
    }
};

export const updateCaseStudy = async (req, res) => {
    try {
        const { caseId } = req.params;
        const { num, title, category, service, volume, turnaround, challenge, result, order } =
            req.body;
        const portfolio = await Portfolio.getSingleton();

        const caseStudy = portfolio.caseStudies.id(caseId);
        if (!caseStudy) {
            return res.status(404).json({ success: false, error: "Case study not found" });
        }

        if (req.file) {
            await cloudinary.uploader.destroy(caseStudy.imagePublicId);
            caseStudy.image = req.file.path;
            caseStudy.imagePublicId = req.file.filename;
        }

        if (num !== undefined) caseStudy.num = num;
        if (title !== undefined) caseStudy.title = title;
        if (category !== undefined) caseStudy.category = category;
        if (service !== undefined) caseStudy.service = service;
        if (volume !== undefined) caseStudy.volume = volume;
        if (turnaround !== undefined) caseStudy.turnaround = turnaround;
        if (challenge !== undefined) caseStudy.challenge = challenge;
        if (result !== undefined) caseStudy.result = result;
        if (order !== undefined) caseStudy.order = order;

        portfolio.lastUpdatedBy = req.adminId || "admin";
        await portfolio.save();

        res.status(200).json({ success: true, data: caseStudy });
    } catch (error) {
        if (req.file) {
            await cloudinary.uploader.destroy(req.file.filename);
        }
        res.status(500).json({ success: false, error: error.message });
    }
};

export const deleteCaseStudy = async (req, res) => {
    try {
        const { caseId } = req.params;
        const portfolio = await Portfolio.getSingleton();

        const caseStudy = portfolio.caseStudies.id(caseId);
        if (!caseStudy) {
            return res.status(404).json({ success: false, error: "Case study not found" });
        }

        await cloudinary.uploader.destroy(caseStudy.imagePublicId);

        portfolio.caseStudies = portfolio.caseStudies.filter((cs) => cs._id.toString() !== caseId);
        portfolio.lastUpdatedBy = req.adminId || "admin";
        await portfolio.save();

        res.status(200).json({ success: true, message: "Case study deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// ── Testimonials CRUD ──────────────────────────────────────────────────────────
export const addTestimonial = async (req, res) => {
    try {
        const { quote, author, role, company, category, order } = req.body;
        const portfolio = await Portfolio.getSingleton();

        const newTestimonial = {
            quote,
            author,
            role,
            company,
            category,
            order: order || portfolio.testimonials.length,
        };

        portfolio.testimonials.push(newTestimonial);
        portfolio.lastUpdatedBy = req.adminId || "admin";
        await portfolio.save();

        res.status(201).json({ success: true, data: newTestimonial });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const updateTestimonial = async (req, res) => {
    try {
        const { testimonialId } = req.params;
        const { quote, author, role, company, category, order } = req.body;
        const portfolio = await Portfolio.getSingleton();

        const testimonial = portfolio.testimonials.id(testimonialId);
        if (!testimonial) {
            return res.status(404).json({ success: false, error: "Testimonial not found" });
        }

        if (quote !== undefined) testimonial.quote = quote;
        if (author !== undefined) testimonial.author = author;
        if (role !== undefined) testimonial.role = role;
        if (company !== undefined) testimonial.company = company;
        if (category !== undefined) testimonial.category = category;
        if (order !== undefined) testimonial.order = order;

        portfolio.lastUpdatedBy = req.adminId || "admin";
        await portfolio.save();

        res.status(200).json({ success: true, data: testimonial });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const deleteTestimonial = async (req, res) => {
    try {
        const { testimonialId } = req.params;
        const portfolio = await Portfolio.getSingleton();

        portfolio.testimonials = portfolio.testimonials.filter(
            (t) => t._id.toString() !== testimonialId,
        );
        portfolio.lastUpdatedBy = req.adminId || "admin";
        await portfolio.save();

        res.status(200).json({ success: true, message: "Testimonial deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
