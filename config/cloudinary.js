// config/cloudinary.js
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import dotenv from "dotenv";

dotenv.config();

// ── Cloudinary config ─────────────────────────────────────────────────────────
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ── Helper: create a storage for a specific folder ────────────────────────────
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

// ── Named upload middlewares ───────────────────────────────────────────────────

/** Single image — hero section */
export const uploadHeroImage = multer({ storage: makeStorage("home/hero") }).single("image");

/** Multiple logos — company section (up to 20) */
export const uploadCompanyLogos = multer({ storage: makeStorage("home/company") }).array(
    "logos",
    20,
);

/** Single icon — one service item */
export const uploadServiceIcon = multer({ storage: makeStorage("home/services") }).single("icon");

/** Two images — one difference item (beforeImage + afterImage) */
export const uploadDifferenceImages = multer({ storage: makeStorage("home/difference") }).fields([
    { name: "beforeImage", maxCount: 1 },
    { name: "afterImage", maxCount: 1 },
]);

export { cloudinary };
