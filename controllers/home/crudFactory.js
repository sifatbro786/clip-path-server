// controllers/home/crudFactory.js
import {
    deleteImageFile,
    deleteMultipleImages,
} from "../../utils/imageHandler.js";

const crudFactory = (Model, modelName, imageFields = []) => {
    // imageFields can be:
    // - string: single image field name
    // - array: multiple image field names
    // - object: { fieldName: 'single' } or { fieldName: 'array' }

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
            // Handle image uploads from multer
            const bodyData = { ...req.body };

            // Process single image fields
            if (imageFields.length > 0) {
                if (typeof imageFields === "string") {
                    if (req.file) {
                        bodyData[imageFields] = `/uploads/${req.file.filename}`;
                    }
                } else if (Array.isArray(imageFields)) {
                    imageFields.forEach((field) => {
                        if (req.file && req.file.fieldname === field) {
                            bodyData[field] = `/uploads/${req.file.filename}`;
                        }
                    });
                } else if (typeof imageFields === "object") {
                    // Handle array fields like images: ['before', 'after']
                    Object.keys(imageFields).forEach((field) => {
                        if (imageFields[field] === "array" && req.files && req.files[field]) {
                            bodyData[field] = req.files[field].map(
                                (file) => `/uploads/${file.filename}`,
                            );
                        } else if (req.files && req.files[field]) {
                            bodyData[field] = `/uploads/${req.files[field][0].filename}`;
                        } else if (req.file && req.file.fieldname === field) {
                            bodyData[field] = `/uploads/${req.file.filename}`;
                        }
                    });
                }
            }

            const doc = await Model.create(bodyData);
            res.status(201).json({ success: true, data: doc });
        } catch (error) {
            // If validation fails, clean up uploaded images
            if (req.file) deleteImageFile(`/uploads/${req.file.filename}`);
            if (req.files) {
                Object.values(req.files)
                    .flat()
                    .forEach((file) => {
                        deleteImageFile(`/uploads/${file.filename}`);
                    });
            }

            if (error.name === "ValidationError") {
                const messages = Object.values(error.errors).map((e) => e.message);
                return res.status(400).json({ success: false, error: messages.join(", ") });
            }
            res.status(500).json({ success: false, error: error.message });
        }
    };

    const update = async (req, res) => {
        try {
            const existingDoc = await Model.findById(req.params.id);
            if (!existingDoc) {
                // Clean up uploaded files if doc not found
                if (req.file) deleteImageFile(`/uploads/${req.file.filename}`);
                if (req.files) {
                    Object.values(req.files)
                        .flat()
                        .forEach((file) => {
                            deleteImageFile(`/uploads/${file.filename}`);
                        });
                }
                return res.status(404).json({ success: false, error: `${modelName} not found` });
            }

            const bodyData = { ...req.body };

            // Handle image updates
            if (imageFields.length > 0) {
                if (typeof imageFields === "string") {
                    if (req.file) {
                        // Delete old image
                        if (existingDoc[imageFields]) {
                            deleteImageFile(existingDoc[imageFields]);
                        }
                        bodyData[imageFields] = `/uploads/${req.file.filename}`;
                    }
                } else if (Array.isArray(imageFields)) {
                    imageFields.forEach((field) => {
                        if (req.file && req.file.fieldname === field) {
                            if (existingDoc[field]) {
                                deleteImageFile(existingDoc[field]);
                            }
                            bodyData[field] = `/uploads/${req.file.filename}`;
                        }
                    });
                } else if (typeof imageFields === "object") {
                    Object.keys(imageFields).forEach((field) => {
                        if (imageFields[field] === "array" && req.files && req.files[field]) {
                            // Handle array fields
                            if (existingDoc[field] && existingDoc[field].length > 0) {
                                deleteMultipleImages(existingDoc[field]);
                            }
                            bodyData[field] = req.files[field].map(
                                (file) => `/uploads/${file.filename}`,
                            );
                        } else if (req.files && req.files[field]) {
                            // Handle single file in files object
                            if (existingDoc[field]) {
                                deleteImageFile(existingDoc[field]);
                            }
                            bodyData[field] = `/uploads/${req.files[field][0].filename}`;
                        } else if (req.file && req.file.fieldname === field) {
                            // Handle single file upload
                            if (existingDoc[field]) {
                                deleteImageFile(existingDoc[field]);
                            }
                            bodyData[field] = `/uploads/${req.file.filename}`;
                        }
                    });
                }
            }

            const doc = await Model.findByIdAndUpdate(req.params.id, bodyData, {
                new: true,
                runValidators: true,
            });

            res.status(200).json({ success: true, data: doc });
        } catch (error) {
            // Clean up uploaded files if error occurs
            if (req.file) deleteImageFile(`/uploads/${req.file.filename}`);
            if (req.files) {
                Object.values(req.files)
                    .flat()
                    .forEach((file) => {
                        deleteImageFile(`/uploads/${file.filename}`);
                    });
            }

            if (error.name === "ValidationError") {
                const messages = Object.values(error.errors).map((e) => e.message);
                return res.status(400).json({ success: false, error: messages.join(", ") });
            }
            res.status(500).json({ success: false, error: error.message });
        }
    };

    const remove = async (req, res) => {
        try {
            const doc = await Model.findById(req.params.id);
            if (!doc)
                return res.status(404).json({ success: false, error: `${modelName} not found` });

            // Delete associated images before removing document
            if (imageFields.length > 0) {
                if (typeof imageFields === "string") {
                    if (doc[imageFields]) {
                        deleteImageFile(doc[imageFields]);
                    }
                } else if (Array.isArray(imageFields)) {
                    imageFields.forEach((field) => {
                        if (doc[field]) {
                            deleteImageFile(doc[field]);
                        }
                    });
                } else if (typeof imageFields === "object") {
                    Object.keys(imageFields).forEach((field) => {
                        if (imageFields[field] === "array" && doc[field] && doc[field].length > 0) {
                            deleteMultipleImages(doc[field]);
                        } else if (doc[field]) {
                            deleteImageFile(doc[field]);
                        }
                    });
                }
            }

            await Model.findByIdAndDelete(req.params.id);
            res.status(200).json({ success: true, message: `${modelName} deleted successfully` });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    };

    return { getAll, getOne, getAllAdmin, create, update, remove };
};

export default crudFactory;
