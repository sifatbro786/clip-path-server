// models/home/PricingPlan.js
import mongoose from "mongoose";

const pricingPlanSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Plan name is required"],
            trim: true,
        },
        subtitle: {
            type: String,
            required: [true, "Subtitle is required"],
            trim: true,
        },
        price: {
            type: Number,
            required: [true, "Price is required"],
            min: [0, "Price cannot be negative"],
        },
        features: {
            type: [String],
            required: [true, "Features are required"],
            validate: {
                validator: (arr) => arr.length > 0,
                message: "At least one feature is required",
            },
        },
        equivalent: {
            type: String,
            required: [true, "Equivalent rate is required"],
            trim: true,
        },
        buttonText: {
            type: String,
            required: [true, "Button text is required"],
            trim: true,
        },
        isDark: {
            type: Boolean,
            default: false,
        },
        isPopular: {
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

export default mongoose.model("HomePricingPlan", pricingPlanSchema);
