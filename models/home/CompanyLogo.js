// models/home/CompanyLogo.js
import mongoose from "mongoose";

const companyLogoSchema = new mongoose.Schema(
    {
        src: {
            type: String,
            required: [true, "Logo image is required"],
        },
        altText: {
            type: String,
            trim: true,
            default: "Company Logo",
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
    { timestamps: true },
);

export default mongoose.model("HomeCompanyLogo", companyLogoSchema);
