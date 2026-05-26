import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

function makeStorage(folder) {
    return new CloudinaryStorage({
        cloudinary,
        params: {
            folder,
            allowed_formats: ["jpg", "jpeg", "png", "gif", "webp"],
            transformation: [{ width: 2000, height: 2000, crop: "limit", quality: "auto" }],
        },
    });
}

// ============================================
// HOME PAGE UPLOADS (Keep existing)
// ============================================
export const uploadHeroImage = multer({ storage: makeStorage("home/hero") }).single("image");
export const uploadCompanyLogos = multer({ storage: makeStorage("home/company") }).array(
    "logos",
    20,
);
export const uploadServiceIcon = multer({ storage: makeStorage("home/services") }).single("icon");

// ============================================
// ABOUT PAGE UPLOADS
// ============================================
export const uploadFounderImage = multer({ storage: makeStorage("about/founders") }).single(
    "image",
);

// ============================================
// PRICING PAGE UPLOADS
// ============================================
export const uploadSampleImages = multer({ storage: makeStorage("pricing/samples") }).fields([
    { name: "afterImage", maxCount: 1 },
    { name: "beforeImage", maxCount: 1 },
]);

// ============================================
// PORTFOLIO PAGE UPLOADS
// ============================================
export const uploadPortfolioImage = multer({ storage: makeStorage("portfolio") }).single("image");

// ============================================
// BOOKING PAGE UPLOADS
// ============================================
export const uploadBookingImage = multer({ storage: makeStorage("booking") }).single("image");

// ============================================
// SERVICE PAGE UPLOADS
// ============================================

// Service Card Image
export const uploadServiceCardImage = multer({
    storage: makeStorage("services/cards"),
}).single("cardImage");

// Service Hero Background
export const uploadServiceBackgroundImage = multer({
    storage: makeStorage("services/hero"),
}).single("backgroundImage");

// Service Sample Images (before/after)
export const uploadServiceSampleImages = multer({
    storage: makeStorage("services/samples"),
}).fields([
    { name: "beforeImage", maxCount: 1 },
    { name: "afterImage", maxCount: 1 },
]);

// Retoucher Image
export const uploadRetoucherImage = multer({
    storage: makeStorage("services/retoucher"),
}).single("image");

// Difference Section Images
export const uploadDifferenceImages = multer({
    storage: makeStorage("services/difference"),
}).fields([
    { name: "beforeImage", maxCount: 1 },
    { name: "afterImage", maxCount: 1 },
]);

export { cloudinary };
