// controllers/aboutController.js
import About from "../models/About.js";
import { cloudinary } from "../config/cloudinary.js";

// ── Get About Page Data ──────────────────────────────────────────────────────
export const getAboutData = async (req, res) => {
    try {
        const aboutData = await About.getSingleton();
        res.status(200).json({
            success: true,
            data: aboutData,
        });
    } catch (error) {
        console.error("Error fetching about data:", error);
        res.status(500).json({ success: false, error: error.message });
    }
};

// ── Update Hero Section ───────────────────────────────────────────────────────
export const updateHero = async (req, res) => {
    try {
        const { establishmentYear, location, headline, highlightedText, description } = req.body;
        const about = await About.getSingleton();

        about.hero = {
            establishmentYear: establishmentYear || about.hero.establishmentYear,
            location: location || about.hero.location,
            headline: headline || about.hero.headline,
            highlightedText: highlightedText || about.hero.highlightedText,
            description: description || about.hero.description,
        };
        about.lastUpdatedBy = req.adminId || "admin";

        await about.save();
        res.status(200).json({ success: true, data: about.hero });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// ── Update Our Story Section ──────────────────────────────────────────────────
export const updateOurStory = async (req, res) => {
    try {
        const { title, description, paragraphs, blockquoteText, blockquoteAuthor } = req.body;
        const about = await About.getSingleton();

        about.ourStory = {
            title: title || about.ourStory.title,
            description: description || about.ourStory.description,
            paragraphs: paragraphs || about.ourStory.paragraphs,
            blockquote: {
                text: blockquoteText || about.ourStory.blockquote?.text,
                author: blockquoteAuthor || about.ourStory.blockquote?.author,
            },
        };
        about.lastUpdatedBy = req.adminId || "admin";

        await about.save();
        res.status(200).json({ success: true, data: about.ourStory });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// ── Update Choose Section (Stats) ─────────────────────────────────────────────
export const updateChooseSectionMeta = async (req, res) => {
    try {
        const { badge, heading } = req.body;
        const about = await About.getSingleton();

        about.chooseSection.badge = badge || about.chooseSection.badge;
        about.chooseSection.heading = heading || about.chooseSection.heading;
        about.lastUpdatedBy = req.adminId || "admin";

        await about.save();
        res.status(200).json({ success: true, data: about.chooseSection });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// ── CRUD for Stats ────────────────────────────────────────────────────────────
export const addStat = async (req, res) => {
    try {
        const { value, suffix, description, color, isItalic, order } = req.body;
        const about = await About.getSingleton();

        const newStat = {
            value,
            suffix: suffix || "",
            description,
            color: color || "primary",
            isItalic: isItalic || false,
            order: order || about.chooseSection.stats.length,
        };

        about.chooseSection.stats.push(newStat);
        about.lastUpdatedBy = req.adminId || "admin";
        await about.save();

        res.status(201).json({ success: true, data: newStat });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const updateStat = async (req, res) => {
    try {
        const { statId } = req.params;
        const { value, suffix, description, color, isItalic, order } = req.body;
        const about = await About.getSingleton();

        const stat = about.chooseSection.stats.id(statId);
        if (!stat) {
            return res.status(404).json({ success: false, error: "Stat not found" });
        }

        if (value !== undefined) stat.value = value;
        if (suffix !== undefined) stat.suffix = suffix;
        if (description !== undefined) stat.description = description;
        if (color !== undefined) stat.color = color;
        if (isItalic !== undefined) stat.isItalic = isItalic;
        if (order !== undefined) stat.order = order;

        about.lastUpdatedBy = req.adminId || "admin";
        await about.save();

        res.status(200).json({ success: true, data: stat });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const deleteStat = async (req, res) => {
    try {
        const { statId } = req.params;
        const about = await About.getSingleton();

        about.chooseSection.stats = about.chooseSection.stats.filter(
            (stat) => stat._id.toString() !== statId,
        );
        about.lastUpdatedBy = req.adminId || "admin";
        await about.save();

        res.status(200).json({ success: true, message: "Stat deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// ── Update Work Section Meta ──────────────────────────────────────────────────
export const updateWorkSectionMeta = async (req, res) => {
    try {
        const { badge, heading, highlightedText } = req.body;
        const about = await About.getSingleton();

        about.workSection.badge = badge || about.workSection.badge;
        about.workSection.heading = heading || about.workSection.heading;
        about.workSection.highlightedText = highlightedText || about.workSection.highlightedText;
        about.lastUpdatedBy = req.adminId || "admin";

        await about.save();
        res.status(200).json({ success: true, data: about.workSection });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// ── CRUD for Principles ────────────────────────────────────────────────────────
export const addPrinciple = async (req, res) => {
    try {
        const { id, title, description, order } = req.body;
        const about = await About.getSingleton();

        const newPrinciple = {
            id,
            title,
            description,
            order: order || about.workSection.principles.length,
        };

        about.workSection.principles.push(newPrinciple);
        about.lastUpdatedBy = req.adminId || "admin";
        await about.save();

        res.status(201).json({ success: true, data: newPrinciple });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const updatePrinciple = async (req, res) => {
    try {
        const { principleId } = req.params;
        const { id, title, description, order } = req.body;
        const about = await About.getSingleton();

        const principle = about.workSection.principles.id(principleId);
        if (!principle) {
            return res.status(404).json({ success: false, error: "Principle not found" });
        }

        if (id !== undefined) principle.id = id;
        if (title !== undefined) principle.title = title;
        if (description !== undefined) principle.description = description;
        if (order !== undefined) principle.order = order;

        about.lastUpdatedBy = req.adminId || "admin";
        await about.save();

        res.status(200).json({ success: true, data: principle });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const deletePrinciple = async (req, res) => {
    try {
        const { principleId } = req.params;
        const about = await About.getSingleton();

        about.workSection.principles = about.workSection.principles.filter(
            (principle) => principle._id.toString() !== principleId,
        );
        about.lastUpdatedBy = req.adminId || "admin";
        await about.save();

        res.status(200).json({ success: true, message: "Principle deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// ── Update Where We Work Section ───────────────────────────────────────────────
export const updateWhereWeWorkMeta = async (req, res) => {
    try {
        const { badge, heading, highlightedText, description } = req.body;
        const about = await About.getSingleton();

        about.whereWeWork.badge = badge || about.whereWeWork.badge;
        about.whereWeWork.heading = heading || about.whereWeWork.heading;
        about.whereWeWork.highlightedText = highlightedText || about.whereWeWork.highlightedText;
        about.whereWeWork.description = description || about.whereWeWork.description;
        about.lastUpdatedBy = req.adminId || "admin";

        await about.save();
        res.status(200).json({ success: true, data: about.whereWeWork });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// ── CRUD for Locations ─────────────────────────────────────────────────────────
export const addLocation = async (req, res) => {
    try {
        const { type, title, address, hoursOrPhone, note, order } = req.body;
        const about = await About.getSingleton();

        // Check required fields
        if (!type || !title || !address || !hoursOrPhone) {
            return res.status(400).json({
                success: false,
                error: "Type, title, address, and hoursOrPhone are required fields",
            });
        }

        const newLocation = {
            type,
            title,
            address,
            hoursOrPhone,
            note: note || "",
            order: order !== undefined ? order : about.whereWeWork.locations.length,
        };

        about.whereWeWork.locations.push(newLocation);
        about.lastUpdatedBy = req.adminId || "admin";
        await about.save();

        // Return the newly added location
        const savedLocation = about.whereWeWork.locations[about.whereWeWork.locations.length - 1];

        res.status(201).json({ success: true, data: savedLocation });
    } catch (error) {
        console.error("Error adding location:", error);
        res.status(500).json({ success: false, error: error.message });
    }
};

export const updateLocation = async (req, res) => {
    try {
        const { locationId } = req.params;
        const { type, title, address, hoursOrPhone, note, order } = req.body;
        const about = await About.getSingleton();

        const location = about.whereWeWork.locations.id(locationId);
        if (!location) {
            return res.status(404).json({ success: false, error: "Location not found" });
        }

        if (type !== undefined) location.type = type;
        if (title !== undefined) location.title = title;
        if (address !== undefined) location.address = address;
        if (hoursOrPhone !== undefined) location.hoursOrPhone = hoursOrPhone;
        if (note !== undefined) location.note = note;
        if (order !== undefined) location.order = order;

        about.lastUpdatedBy = req.adminId || "admin";
        await about.save();

        res.status(200).json({ success: true, data: location });
    } catch (error) {
        console.error("Error updating location:", error);
        res.status(500).json({ success: false, error: error.message });
    }
};

export const deleteLocation = async (req, res) => {
    try {
        const { locationId } = req.params;
        const about = await About.getSingleton();

        about.whereWeWork.locations = about.whereWeWork.locations.filter(
            (location) => location._id.toString() !== locationId,
        );
        about.lastUpdatedBy = req.adminId || "admin";
        await about.save();

        res.status(200).json({ success: true, message: "Location deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// ── Update Quote Section ───────────────────────────────────────────────────────
export const updateQuote = async (req, res) => {
    try {
        const { text, author } = req.body;
        const about = await About.getSingleton();

        about.quote.text = text || about.quote.text;
        about.quote.author = author || about.quote.author;
        about.lastUpdatedBy = req.adminId || "admin";

        await about.save();
        res.status(200).json({ success: true, data: about.quote });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// ── Founder CRUD with Cloudinary ───────────────────────────────────────────────
export const addFounder = async (req, res) => {
    try {
        const { name, nickname, subRole, bioParagraphs, socials, order } = req.body;

        if (!req.file) {
            return res.status(400).json({ success: false, error: "Founder image is required" });
        }

        const about = await About.getSingleton();

        const newFounder = {
            name,
            nickname: nickname || "",
            subRole,
            imageUrl: req.file.path,
            imagePublicId: req.file.filename,
            bioParagraphs: JSON.parse(bioParagraphs),
            socials: JSON.parse(socials),
            order: order || about.founders.foundersList.length,
        };

        about.founders.foundersList.push(newFounder);
        about.lastUpdatedBy = req.adminId || "admin";
        await about.save();

        res.status(201).json({ success: true, data: newFounder });
    } catch (error) {
        // Clean up uploaded image if error occurs
        if (req.file) {
            await cloudinary.uploader.destroy(req.file.filename);
        }
        res.status(500).json({ success: false, error: error.message });
    }
};

export const updateFounder = async (req, res) => {
    try {
        const { founderId } = req.params;
        const { name, nickname, subRole, bioParagraphs, socials, order } = req.body;
        const about = await About.getSingleton();

        const founder = about.founders.foundersList.id(founderId);
        if (!founder) {
            return res.status(404).json({ success: false, error: "Founder not found" });
        }

        // Handle image update if new image provided
        if (req.file) {
            // Delete old image from Cloudinary
            await cloudinary.uploader.destroy(founder.imagePublicId);
            founder.imageUrl = req.file.path;
            founder.imagePublicId = req.file.filename;
        }

        if (name !== undefined) founder.name = name;
        if (nickname !== undefined) founder.nickname = nickname;
        if (subRole !== undefined) founder.subRole = subRole;
        if (bioParagraphs !== undefined) founder.bioParagraphs = JSON.parse(bioParagraphs);
        if (socials !== undefined) founder.socials = JSON.parse(socials);
        if (order !== undefined) founder.order = order;

        about.lastUpdatedBy = req.adminId || "admin";
        await about.save();

        res.status(200).json({ success: true, data: founder });
    } catch (error) {
        // Clean up newly uploaded image if error occurs
        if (req.file) {
            await cloudinary.uploader.destroy(req.file.filename);
        }
        res.status(500).json({ success: false, error: error.message });
    }
};

export const deleteFounder = async (req, res) => {
    try {
        const { founderId } = req.params;
        const about = await About.getSingleton();

        const founder = about.founders.foundersList.id(founderId);
        if (!founder) {
            return res.status(404).json({ success: false, error: "Founder not found" });
        }

        // Delete image from Cloudinary
        await cloudinary.uploader.destroy(founder.imagePublicId);

        about.founders.foundersList = about.founders.foundersList.filter(
            (f) => f._id.toString() !== founderId,
        );
        about.lastUpdatedBy = req.adminId || "admin";
        await about.save();

        res.status(200).json({ success: true, message: "Founder deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// ── Update Founders Section Meta ───────────────────────────────────────────────
export const updateFoundersMeta = async (req, res) => {
    try {
        const { title, headingPrefix, headingHighlighted, paragraph } = req.body;
        const about = await About.getSingleton();

        about.founders.title = title || about.founders.title;
        about.founders.headingPrefix = headingPrefix || about.founders.headingPrefix;
        about.founders.headingHighlighted = headingHighlighted || about.founders.headingHighlighted;
        about.founders.paragraph = paragraph || about.founders.paragraph;
        about.lastUpdatedBy = req.adminId || "admin";

        await about.save();
        res.status(200).json({ success: true, data: about.founders });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// ── Reorder Stats ──────────────────────────────────────────────────────────────
export const reorderStats = async (req, res) => {
    try {
        const { statOrders } = req.body; // Array of { id, order }
        const about = await About.getSingleton();

        for (const { id, order } of statOrders) {
            const stat = about.chooseSection.stats.id(id);
            if (stat) {
                stat.order = order;
            }
        }

        // Sort stats by order
        about.chooseSection.stats.sort((a, b) => a.order - b.order);
        about.lastUpdatedBy = req.adminId || "admin";
        await about.save();

        res.status(200).json({ success: true, data: about.chooseSection.stats });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// ── Reorder Principles ─────────────────────────────────────────────────────────
export const reorderPrinciples = async (req, res) => {
    try {
        const { principleOrders } = req.body; // Array of { id, order }
        const about = await About.getSingleton();

        for (const { id, order } of principleOrders) {
            const principle = about.workSection.principles.id(id);
            if (principle) {
                principle.order = order;
            }
        }

        about.workSection.principles.sort((a, b) => a.order - b.order);
        about.lastUpdatedBy = req.adminId || "admin";
        await about.save();

        res.status(200).json({ success: true, data: about.workSection.principles });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
