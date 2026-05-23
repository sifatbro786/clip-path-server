// models/PageContent.js
import mongoose from "mongoose";

const pageContentSchema = new mongoose.Schema(
    {
        sectionName: {
            type: String,
            required: [true, "Section name is required"],
            trim: true,
            unique: true,
        },
        content: {
            type: mongoose.Schema.Types.Mixed,
            required: [true, "Content is required"],
        },
    },
    {
        timestamps: true,
    },
);

// Ensure sectionName lookups are fast
pageContentSchema.index({ sectionName: 1 });

export default mongoose.model("PageContent", pageContentSchema);
