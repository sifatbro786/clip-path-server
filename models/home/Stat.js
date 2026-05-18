// models/home/Stat.js
import mongoose from "mongoose";

const statSchema = new mongoose.Schema(
    {
        value: {
            type: String,
            required: [true, "Value is required"],
            trim: true,
        },
        suffix: {
            type: String,
            trim: true,
            default: null,
        },
        description: {
            type: String,
            required: [true, "Description is required"],
            trim: true,
        },
        color: {
            type: String,
            enum: ["primary", "secondary"],
            default: "primary",
        },
        isItalic: {
            type: Boolean,
            default: false,
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

export default mongoose.model("HomeStat", statSchema);
