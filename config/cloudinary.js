// config/cloudinary.js
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

// Home page uploads
export const uploadHeroImage = multer({ storage: makeStorage("home/hero") }).single("image");
export const uploadCompanyLogos = multer({ storage: makeStorage("home/company") }).array(
    "logos",
    20,
);
export const uploadServiceIcon = multer({ storage: makeStorage("home/services") }).single("icon");
export const uploadDifferenceImages = multer({ storage: makeStorage("home/difference") }).fields([
    { name: "beforeImage", maxCount: 1 },
    { name: "afterImage", maxCount: 1 },
]);

// About page uploads
export const uploadFounderImage = multer({ storage: makeStorage("about/founders") }).single(
    "image",
);

// Pricing page uploads
export const uploadSampleImages = multer({ storage: makeStorage("pricing/samples") }).fields([
    { name: "afterImage", maxCount: 1 },
    { name: "beforeImage", maxCount: 1 },
]);

// Portfolio page uploads
export const uploadPortfolioImage = multer({ storage: makeStorage("portfolio") }).single("image");

export { cloudinary };
