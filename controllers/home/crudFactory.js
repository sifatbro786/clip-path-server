// controllers/home/crudFactory.js

const crudFactory = (Model, modelName) => {
    // ── PUBLIC ──────────────────────────────────────────────────────────────

    const getAll = async (req, res) => {
        try {
            const docs = await Model.find({ isActive: true })
                .sort({ order: 1, createdAt: 1 })
                .lean();
            res.status(200).json({ success: true, data: docs });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    };

    const getOne = async (req, res) => {
        try {
            const doc = await Model.findOne({ _id: req.params.id, isActive: true }).lean();
            if (!doc)
                return res.status(404).json({ success: false, error: `${modelName} not found` });
            res.status(200).json({ success: true, data: doc });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    };

    // ── ADMIN ───────────────────────────────────────────────────────────────

    const getAllAdmin = async (req, res) => {
        try {
            const docs = await Model.find().sort({ order: 1, createdAt: 1 }).lean();
            res.status(200).json({ success: true, data: docs });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    };

    const create = async (req, res) => {
        try {
            const doc = await Model.create(req.body);
            res.status(201).json({ success: true, data: doc });
        } catch (error) {
            if (error.name === "ValidationError") {
                const messages = Object.values(error.errors).map((e) => e.message);
                return res.status(400).json({ success: false, error: messages.join(", ") });
            }
            res.status(500).json({ success: false, error: error.message });
        }
    };

    const update = async (req, res) => {
        try {
            const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
                new: true,
                runValidators: true,
            });
            if (!doc)
                return res.status(404).json({ success: false, error: `${modelName} not found` });
            res.status(200).json({ success: true, data: doc });
        } catch (error) {
            if (error.name === "ValidationError") {
                const messages = Object.values(error.errors).map((e) => e.message);
                return res.status(400).json({ success: false, error: messages.join(", ") });
            }
            res.status(500).json({ success: false, error: error.message });
        }
    };

    const remove = async (req, res) => {
        try {
            const doc = await Model.findByIdAndDelete(req.params.id);
            if (!doc)
                return res.status(404).json({ success: false, error: `${modelName} not found` });
            res.status(200).json({ success: true, message: `${modelName} deleted successfully` });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    };

    return { getAll, getOne, getAllAdmin, create, update, remove };
};

export default crudFactory;
