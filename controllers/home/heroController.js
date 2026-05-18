// controllers/home/heroController.js
import HeroContent from "../../models/home/HeroContent.js";
import { deleteImageFile, handleImageUpdate } from "../../utils/imageHandler.js";

const getHero = async (req, res) => {
    try {
        const hero = await HeroContent.findOne().lean();
        if (!hero) return res.status(404).json({ success: false, error: "Hero content not found" });
        res.status(200).json({ success: true, data: hero });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// PUT — upsert: create if none exists, update if exists
const upsertHero = async (req, res) => {
    try {
        const existing = await HeroContent.findOne();

        // Parse JSON fields if they come as strings
        let bodyData = { ...req.body };

        // Parse primaryBtn and secondaryBtn if they are strings
        if (typeof bodyData.primaryBtn === "string") {
            bodyData.primaryBtn = JSON.parse(bodyData.primaryBtn);
        }
        if (typeof bodyData.secondaryBtn === "string") {
            bodyData.secondaryBtn = JSON.parse(bodyData.secondaryBtn);
        }

        // Handle hero image
        let heroImage = existing?.heroImage;
        if (req.file) {
            if (existing && existing.heroImage) {
                deleteImageFile(existing.heroImage);
            }
            heroImage = `/uploads/${req.file.filename}`;
            bodyData.heroImage = heroImage;
        }

        // Update or create
        const hero = existing
            ? await HeroContent.findByIdAndUpdate(existing._id, bodyData, {
                  new: true,
                  runValidators: true,
              })
            : await HeroContent.create(bodyData);

        res.status(200).json({ success: true, data: hero });
    } catch (error) {
        console.error("Hero upsert error:", error);
        if (req.file) {
            deleteImageFile(`/uploads/${req.file.filename}`);
        }
        if (error.name === "ValidationError") {
            const messages = Object.values(error.errors).map((e) => e.message);
            return res.status(400).json({ success: false, error: messages.join(", ") });
        }
        res.status(500).json({ success: false, error: error.message });
    }
};

export { getHero, upsertHero };
