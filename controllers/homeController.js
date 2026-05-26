// controllers/homeController.js
import Home from "../models/Home.js";

// ── Helper ────────────────────────────────────────────────────────────────────
async function getHome() {
    let home = await Home.findOne();
    if (!home) home = await Home.create({});
    return home;
}

// ═════════════════════════════════════════════════════════════════════════════
//  PUBLIC
// ═════════════════════════════════════════════════════════════════════════════

export const getHomeData = async (req, res) => {
    try {
        const home = await getHome();
        res.json({ success: true, data: home });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// ═════════════════════════════════════════════════════════════════════════════
//  HERO
// ═════════════════════════════════════════════════════════════════════════════

export const updateHero = async (req, res) => {
    try {
        const home = await getHome();
        const { eyebrow, headingPrimary, headingHighlight, paragraph } = req.body;

        if (eyebrow !== undefined) home.hero.eyebrow = eyebrow;
        if (headingPrimary !== undefined) home.hero.headingPrimary = headingPrimary;
        if (headingHighlight !== undefined) home.hero.headingHighlight = headingHighlight;
        if (paragraph !== undefined) home.hero.paragraph = paragraph;

        if (req.file) {
            home.hero.image = req.file.path;
        } else if (!home.hero.image) {
            return res.status(400).json({ success: false, error: "Hero image is required." });
        }

        await home.save();
        res.json({ success: true, data: home.hero });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// ═════════════════════════════════════════════════════════════════════════════
//  COMPANY
// ═════════════════════════════════════════════════════════════════════════════

export const updateCompanyMeta = async (req, res) => {
    try {
        const home = await getHome();
        const { eyebrow, headingPrimary, headingHighlight } = req.body;

        if (eyebrow !== undefined) home.company.eyebrow = eyebrow;
        if (headingPrimary !== undefined) home.company.headingPrimary = headingPrimary;
        if (headingHighlight !== undefined) home.company.headingHighlight = headingHighlight;

        await home.save();
        res.json({ success: true, data: home.company });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

export const addCompanyLogos = async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res
                .status(400)
                .json({ success: false, error: "At least one logo image is required." });
        }
        const home = await getHome();
        home.company.logos.push(...req.files.map((f) => ({ image: f.path })));
        await home.save();
        res.json({ success: true, data: home.company.logos });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

export const deleteCompanyLogo = async (req, res) => {
    try {
        const home = await getHome();
        const before = home.company.logos.length;
        home.company.logos = home.company.logos.filter(
            (l) => l._id.toString() !== req.params.logoId,
        );
        if (home.company.logos.length === before) {
            return res.status(404).json({ success: false, error: "Logo not found." });
        }
        await home.save();
        res.json({ success: true, data: home.company.logos });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// ═════════════════════════════════════════════════════════════════════════════
//  FAQ
// ═════════════════════════════════════════════════════════════════════════════

export const updateFaqMeta = async (req, res) => {
    try {
        const home = await getHome();
        const { eyebrow, headingPrimary, headingHighlight } = req.body;

        if (eyebrow !== undefined) home.faq.eyebrow = eyebrow;
        if (headingPrimary !== undefined) home.faq.headingPrimary = headingPrimary;
        if (headingHighlight !== undefined) home.faq.headingHighlight = headingHighlight;

        await home.save();
        res.json({ success: true, data: home.faq });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

export const addFaq = async (req, res) => {
    try {
        const { question, answer } = req.body;
        if (!question || !answer) {
            return res
                .status(400)
                .json({ success: false, error: "question and answer are required." });
        }
        const home = await getHome();
        home.faq.items.push({ question, answer });
        await home.save();
        res.status(201).json({ success: true, data: home.faq.items });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

export const updateFaq = async (req, res) => {
    try {
        const home = await getHome();
        const item = home.faq.items.id(req.params.faqId);
        if (!item) return res.status(404).json({ success: false, error: "FAQ item not found." });

        const { question, answer } = req.body;
        if (question !== undefined) item.question = question;
        if (answer !== undefined) item.answer = answer;

        await home.save();
        res.json({ success: true, data: home.faq.items });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

export const deleteFaq = async (req, res) => {
    try {
        const home = await getHome();
        const before = home.faq.items.length;
        home.faq.items = home.faq.items.filter((f) => f._id.toString() !== req.params.faqId);
        if (home.faq.items.length === before) {
            return res.status(404).json({ success: false, error: "FAQ item not found." });
        }
        await home.save();
        res.json({ success: true, data: home.faq.items });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};
