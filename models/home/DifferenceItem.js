// models/home/DifferenceItem.js
import mongoose from "mongoose";

const differenceItemSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Title is required"],
            trim: true,
        },
        description: {
            type: String,
            required: [true, "Description is required"],
            trim: true,
        },
        builtFor: {
            type: [String],
            required: [true, "builtFor is required"],
            validate: {
                validator: (arr) => arr.length > 0,
                message: "builtFor must have at least one item",
            },
        },
        images: {
            type: [String], // [beforeImageUrl, afterImageUrl]
            required: [true, "Both before and after images are required"],
            validate: {
                validator: (arr) => arr.length === 2,
                message: "Exactly 2 images required (before and after)",
            },
        },
        left: {
            type: Boolean,
            default: true,
        },
        order: {
            type: Number,
            default: 0,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

export default mongoose.model("HomeDifferenceItem", differenceItemSchema);
