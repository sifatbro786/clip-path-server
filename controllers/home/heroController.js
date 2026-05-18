// controllers/home/heroController.js
import HeroContent from "../../models/home/HeroContent.js";

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
        const hero = existing
            ? await HeroContent.findByIdAndUpdate(existing._id, req.body, {
                  new: true,
                  runValidators: true,
              })
            : await HeroContent.create(req.body);

        res.status(200).json({ success: true, data: hero });
    } catch (error) {
        if (error.name === "ValidationError") {
            const messages = Object.values(error.errors).map((e) => e.message);
            return res.status(400).json({ success: false, error: messages.join(", ") });
        }
        res.status(500).json({ success: false, error: error.message });
    }
};

export { getHero, upsertHero };
