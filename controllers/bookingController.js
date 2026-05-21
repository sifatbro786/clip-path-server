// controllers/bookingController.js
import Booking from "../models/Booking.js";
import { cloudinary } from "../config/cloudinary.js";

// Get active booking data
export const getBooking = async (req, res) => {
    try {
        const booking = await Booking.getActive();
        res.status(200).json({
            success: true,
            data: booking,
        });
    } catch (error) {
        console.error("Error fetching booking:", error);
        res.status(500).json({
            success: false,
            error: "Failed to fetch booking data",
            details: error.message,
        });
    }
};

// Update entire booking
export const updateBooking = async (req, res) => {
    try {
        let booking = await Booking.findOne({ isActive: true });

        if (!booking) {
            booking = new Booking(req.body);
        } else {
            Object.assign(booking, req.body);
        }

        booking.updatedAt = Date.now();
        await booking.save();

        res.status(200).json({
            success: true,
            message: "Booking updated successfully",
            data: booking,
        });
    } catch (error) {
        console.error("Error updating booking:", error);
        res.status(500).json({
            success: false,
            error: "Failed to update booking",
            details: error.message,
        });
    }
};

// Update Hero Section
export const updateHero = async (req, res) => {
    try {
        const booking = await Booking.getActive();

        console.log("=== UPDATE HERO DEBUG ===");
        console.log("Received body:", JSON.stringify(req.body, null, 2));

        // Directly assign each field properly
        if (req.body.eyebrow !== undefined) booking.hero.eyebrow = req.body.eyebrow;
        if (req.body.paragraph !== undefined) booking.hero.paragraph = req.body.paragraph;
        if (req.body.afterButtons !== undefined) booking.hero.afterButtons = req.body.afterButtons;
        if (req.body.afterParagraph !== undefined)
            booking.hero.afterParagraph = req.body.afterParagraph;

        // Handle heading object
        if (req.body.heading) {
            if (req.body.heading.text !== undefined)
                booking.hero.heading.text = req.body.heading.text;
            if (req.body.heading.highlightedText !== undefined)
                booking.hero.heading.highlightedText = req.body.heading.highlightedText;
            if (req.body.heading.suffix !== undefined)
                booking.hero.heading.suffix = req.body.heading.suffix;
        }

        // Handle primaryBtn object
        if (req.body.primaryBtn) {
            if (req.body.primaryBtn.label !== undefined)
                booking.hero.primaryBtn.label = req.body.primaryBtn.label;
            if (req.body.primaryBtn.href !== undefined)
                booking.hero.primaryBtn.href = req.body.primaryBtn.href;
        }

        // Handle secondaryBtn object
        if (req.body.secondaryBtn) {
            if (req.body.secondaryBtn.label !== undefined)
                booking.hero.secondaryBtn.label = req.body.secondaryBtn.label;
            if (req.body.secondaryBtn.href !== undefined)
                booking.hero.secondaryBtn.href = req.body.secondaryBtn.href;
        }

        // Mark the path as modified
        booking.markModified("hero");

        await booking.save();

        console.log("Hero saved successfully");

        res.status(200).json({
            success: true,
            message: "Hero section updated successfully",
            data: booking.hero,
        });
    } catch (error) {
        console.error("Error updating hero:", error);
        res.status(500).json({
            success: false,
            error: "Failed to update hero section",
            details: error.message,
        });
    }
};

// Update Hero Image
export const updateHeroImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                error: "No image file provided",
            });
        }

        const booking = await Booking.getActive();

        // Delete old image from Cloudinary if exists
        if (booking.hero.image?.publicId) {
            await cloudinary.uploader.destroy(booking.hero.image.publicId);
        }

        booking.hero.image = {
            url: req.file.path,
            publicId: req.file.filename,
            alt: req.body.alt || "Hero image",
        };

        await booking.save();

        res.status(200).json({
            success: true,
            message: "Hero image updated successfully",
            data: booking.hero.image,
        });
    } catch (error) {
        console.error("Error updating hero image:", error);
        res.status(500).json({
            success: false,
            error: "Failed to update hero image",
            details: error.message,
        });
    }
};

// Update What We Cover Section - COMPLETE FIX
export const updateWhatWeCover = async (req, res) => {
    try {
        const booking = await Booking.getActive();

        console.log("=== UPDATE WHAT WE COVER DEBUG ===");
        console.log("Received body:", JSON.stringify(req.body, null, 2));

        // Directly assign each field
        if (req.body.subtitle !== undefined) booking.whatWeCover.subtitle = req.body.subtitle;
        if (req.body.title !== undefined) booking.whatWeCover.title = req.body.title;
        if (req.body.highlightedText !== undefined)
            booking.whatWeCover.highlightedText = req.body.highlightedText;

        // Handle steps array
        if (req.body.steps !== undefined) {
            booking.whatWeCover.steps = req.body.steps;
        }

        // Mark as modified
        booking.markModified("whatWeCover");

        await booking.save();

        console.log("WhatWeCover saved successfully");

        res.status(200).json({
            success: true,
            message: "What We Cover section updated successfully",
            data: booking.whatWeCover,
        });
    } catch (error) {
        console.error("Error updating what we cover:", error);
        res.status(500).json({
            success: false,
            error: "Failed to update what we cover section",
            details: error.message,
        });
    }
};

// Add/Update Step in What We Cover
export const updateStep = async (req, res) => {
    try {
        const { stepIndex } = req.params;
        const stepData = req.body;

        const booking = await Booking.getActive();

        if (stepIndex === "new") {
            // Add new step
            const newStep = {
                stepNumber: booking.whatWeCover.steps.length + 1,
                ...stepData,
            };
            booking.whatWeCover.steps.push(newStep);
        } else {
            // Update existing step
            const index = parseInt(stepIndex);
            if (booking.whatWeCover.steps[index]) {
                booking.whatWeCover.steps[index] = {
                    ...booking.whatWeCover.steps[index],
                    ...stepData,
                };
            } else {
                return res.status(404).json({
                    success: false,
                    error: "Step not found",
                });
            }
        }

        await booking.save();

        res.status(200).json({
            success: true,
            message: "Step updated successfully",
            data: booking.whatWeCover.steps,
        });
    } catch (error) {
        console.error("Error updating step:", error);
        res.status(500).json({
            success: false,
            error: "Failed to update step",
            details: error.message,
        });
    }
};

// Delete Step from What We Cover
export const deleteStep = async (req, res) => {
    try {
        const { stepIndex } = req.params;
        const booking = await Booking.getActive();

        if (booking.whatWeCover.steps[stepIndex]) {
            booking.whatWeCover.steps.splice(stepIndex, 1);
            // Reorder step numbers
            booking.whatWeCover.steps.forEach((step, idx) => {
                step.stepNumber = idx + 1;
            });
            await booking.save();

            res.status(200).json({
                success: true,
                message: "Step deleted successfully",
                data: booking.whatWeCover.steps,
            });
        } else {
            res.status(404).json({
                success: false,
                error: "Step not found",
            });
        }
    } catch (error) {
        console.error("Error deleting step:", error);
        res.status(500).json({
            success: false,
            error: "Failed to delete step",
            details: error.message,
        });
    }
};

// Update Who You Speak With Section - COMPLETE FIX
export const updateWhoYouSpeakWith = async (req, res) => {
    try {
        const booking = await Booking.getActive();

        console.log("=== UPDATE WHO YOU SPEAK WITH DEBUG ===");
        console.log("Received body:", JSON.stringify(req.body, null, 2));

        // Directly assign each field
        if (req.body.subtitle !== undefined) booking.whoYouSpeakWith.subtitle = req.body.subtitle;
        if (req.body.name !== undefined) booking.whoYouSpeakWith.name = req.body.name;
        if (req.body.nickname !== undefined) booking.whoYouSpeakWith.nickname = req.body.nickname;
        if (req.body.role !== undefined) booking.whoYouSpeakWith.role = req.body.role;
        if (req.body.description !== undefined)
            booking.whoYouSpeakWith.description = req.body.description;

        // Handle expectations array
        if (req.body.expectations !== undefined) {
            booking.whoYouSpeakWith.expectations = req.body.expectations;
        }

        // Handle image object (only if not coming from file upload)
        if (req.body.image && !req.file) {
            if (req.body.image.url !== undefined)
                booking.whoYouSpeakWith.image.url = req.body.image.url;
            if (req.body.image.alt !== undefined)
                booking.whoYouSpeakWith.image.alt = req.body.image.alt;
        }

        // Mark as modified
        booking.markModified("whoYouSpeakWith");

        await booking.save();

        console.log("WhoYouSpeakWith saved successfully");

        res.status(200).json({
            success: true,
            message: "Who You Speak With section updated successfully",
            data: booking.whoYouSpeakWith,
        });
    } catch (error) {
        console.error("Error updating who you speak with:", error);
        res.status(500).json({
            success: false,
            error: "Failed to update who you speak with section",
            details: error.message,
        });
    }
};

// Update Founder Image
export const updateFounderImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                error: "No image file provided",
            });
        }

        const booking = await Booking.getActive();

        // Delete old image from Cloudinary if exists
        if (booking.whoYouSpeakWith.image?.publicId) {
            await cloudinary.uploader.destroy(booking.whoYouSpeakWith.image.publicId);
        }

        booking.whoYouSpeakWith.image = {
            url: req.file.path,
            publicId: req.file.filename,
            alt: req.body.alt || "Founder portrait",
        };

        await booking.save();

        res.status(200).json({
            success: true,
            message: "Founder image updated successfully",
            data: booking.whoYouSpeakWith.image,
        });
    } catch (error) {
        console.error("Error updating founder image:", error);
        res.status(500).json({
            success: false,
            error: "Failed to update founder image",
            details: error.message,
        });
    }
};

// Add/Update Expectation in Who You Speak With
export const updateExpectation = async (req, res) => {
    try {
        const { expectationIndex } = req.params;
        const { text } = req.body;

        const booking = await Booking.getActive();

        if (expectationIndex === "new") {
            // Add new expectation
            booking.whoYouSpeakWith.expectations.push({ text });
        } else {
            // Update existing expectation
            const index = parseInt(expectationIndex);
            if (booking.whoYouSpeakWith.expectations[index]) {
                booking.whoYouSpeakWith.expectations[index].text = text;
            } else {
                return res.status(404).json({
                    success: false,
                    error: "Expectation not found",
                });
            }
        }

        await booking.save();

        res.status(200).json({
            success: true,
            message: "Expectation updated successfully",
            data: booking.whoYouSpeakWith.expectations,
        });
    } catch (error) {
        console.error("Error updating expectation:", error);
        res.status(500).json({
            success: false,
            error: "Failed to update expectation",
            details: error.message,
        });
    }
};

// Delete Expectation from Who You Speak With
export const deleteExpectation = async (req, res) => {
    try {
        const { expectationIndex } = req.params;
        const booking = await Booking.getActive();

        if (booking.whoYouSpeakWith.expectations[expectationIndex]) {
            booking.whoYouSpeakWith.expectations.splice(expectationIndex, 1);
            await booking.save();

            res.status(200).json({
                success: true,
                message: "Expectation deleted successfully",
                data: booking.whoYouSpeakWith.expectations,
            });
        } else {
            res.status(404).json({
                success: false,
                error: "Expectation not found",
            });
        }
    } catch (error) {
        console.error("Error deleting expectation:", error);
        res.status(500).json({
            success: false,
            error: "Failed to delete expectation",
            details: error.message,
        });
    }
};

// Update Do You Need Call Section - COMPLETE FIX
export const updateDoYouNeedCall = async (req, res) => {
    try {
        const booking = await Booking.getActive();

        console.log("=== UPDATE DO YOU NEED CALL DEBUG ===");
        console.log("Received body:", JSON.stringify(req.body, null, 2));

        // Directly assign each field
        if (req.body.subtitle !== undefined) booking.doYouNeedCall.subtitle = req.body.subtitle;
        if (req.body.title !== undefined) booking.doYouNeedCall.title = req.body.title;
        if (req.body.highlightedText !== undefined)
            booking.doYouNeedCall.highlightedText = req.body.highlightedText;
        if (req.body.description !== undefined)
            booking.doYouNeedCall.description = req.body.description;

        // Handle decisionPaths array
        if (req.body.decisionPaths !== undefined) {
            booking.doYouNeedCall.decisionPaths = req.body.decisionPaths;
        }

        // Mark as modified
        booking.markModified("doYouNeedCall");

        await booking.save();

        console.log("DoYouNeedCall saved successfully");

        res.status(200).json({
            success: true,
            message: "Do You Need Call section updated successfully",
            data: booking.doYouNeedCall,
        });
    } catch (error) {
        console.error("Error updating do you need call:", error);
        res.status(500).json({
            success: false,
            error: "Failed to update do you need call section",
            details: error.message,
        });
    }
};

// Add/Update Decision Path
export const updateDecisionPath = async (req, res) => {
    try {
        const { pathType } = req.params;
        const pathData = req.body;

        const booking = await Booking.getActive();
        const pathIndex = booking.doYouNeedCall.decisionPaths.findIndex((p) => p.type === pathType);

        if (pathIndex !== -1) {
            booking.doYouNeedCall.decisionPaths[pathIndex] = {
                ...booking.doYouNeedCall.decisionPaths[pathIndex],
                ...pathData,
            };
        } else if (pathType === "new") {
            booking.doYouNeedCall.decisionPaths.push(pathData);
        } else {
            return res.status(404).json({
                success: false,
                error: "Decision path not found",
            });
        }

        await booking.save();

        res.status(200).json({
            success: true,
            message: "Decision path updated successfully",
            data: booking.doYouNeedCall.decisionPaths,
        });
    } catch (error) {
        console.error("Error updating decision path:", error);
        res.status(500).json({
            success: false,
            error: "Failed to update decision path",
            details: error.message,
        });
    }
};

// Delete Decision Path
export const deleteDecisionPath = async (req, res) => {
    try {
        const { pathType } = req.params;
        const booking = await Booking.getActive();

        const pathIndex = booking.doYouNeedCall.decisionPaths.findIndex((p) => p.type === pathType);

        if (pathIndex !== -1) {
            booking.doYouNeedCall.decisionPaths.splice(pathIndex, 1);
            await booking.save();

            res.status(200).json({
                success: true,
                message: "Decision path deleted successfully",
                data: booking.doYouNeedCall.decisionPaths,
            });
        } else {
            res.status(404).json({
                success: false,
                error: "Decision path not found",
            });
        }
    } catch (error) {
        console.error("Error deleting decision path:", error);
        res.status(500).json({
            success: false,
            error: "Failed to delete decision path",
            details: error.message,
        });
    }
};

// Update FAQ Section - COMPLETE FIX
export const updateFAQ = async (req, res) => {
    try {
        const booking = await Booking.getActive();

        console.log("=== UPDATE FAQ DEBUG ===");
        console.log("Received body:", JSON.stringify(req.body, null, 2));

        // Directly assign each field
        if (req.body.subtitle !== undefined) booking.faq.subtitle = req.body.subtitle;
        if (req.body.title !== undefined) booking.faq.title = req.body.title;
        if (req.body.highlightedText !== undefined)
            booking.faq.highlightedText = req.body.highlightedText;

        // Handle faqs array
        if (req.body.faqs !== undefined) {
            booking.faq.faqs = req.body.faqs;
        }

        // Mark as modified
        booking.markModified("faq");

        await booking.save();

        console.log("FAQ saved successfully");

        res.status(200).json({
            success: true,
            message: "FAQ section updated successfully",
            data: booking.faq,
        });
    } catch (error) {
        console.error("Error updating FAQ:", error);
        res.status(500).json({
            success: false,
            error: "Failed to update FAQ section",
            details: error.message,
        });
    }
};

// Add/Update FAQ Item
export const updateFaqItem = async (req, res) => {
    try {
        const { faqIndex } = req.params;
        const faqData = req.body;

        const booking = await Booking.getActive();

        if (faqIndex === "new") {
            // Add new FAQ
            const newFaq = {
                order: booking.faq.faqs.length + 1,
                ...faqData,
            };
            booking.faq.faqs.push(newFaq);
        } else {
            // Update existing FAQ
            const index = parseInt(faqIndex);
            if (booking.faq.faqs[index]) {
                booking.faq.faqs[index] = {
                    ...booking.faq.faqs[index],
                    ...faqData,
                };
            } else {
                return res.status(404).json({
                    success: false,
                    error: "FAQ not found",
                });
            }
        }

        await booking.save();

        res.status(200).json({
            success: true,
            message: "FAQ updated successfully",
            data: booking.faq.faqs,
        });
    } catch (error) {
        console.error("Error updating FAQ:", error);
        res.status(500).json({
            success: false,
            error: "Failed to update FAQ",
            details: error.message,
        });
    }
};

// Delete FAQ Item
export const deleteFaqItem = async (req, res) => {
    try {
        const { faqIndex } = req.params;
        const booking = await Booking.getActive();

        if (booking.faq.faqs[faqIndex]) {
            booking.faq.faqs.splice(faqIndex, 1);
            // Reorder remaining FAQs
            booking.faq.faqs.forEach((faq, idx) => {
                faq.order = idx + 1;
            });
            await booking.save();

            res.status(200).json({
                success: true,
                message: "FAQ deleted successfully",
                data: booking.faq.faqs,
            });
        } else {
            res.status(404).json({
                success: false,
                error: "FAQ not found",
            });
        }
    } catch (error) {
        console.error("Error deleting FAQ:", error);
        res.status(500).json({
            success: false,
            error: "Failed to delete FAQ",
            details: error.message,
        });
    }
};
