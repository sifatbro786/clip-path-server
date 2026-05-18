// utils/imageHandler.js
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.join(__dirname, "../uploads");

// Delete a single image file from uploads folder
export const deleteImageFile = (imageUrl) => {
    if (!imageUrl) return false;

    try {
        // Extract filename from URL (e.g., "/uploads/123-image.jpg" -> "123-image.jpg")
        const filename = imageUrl.replace("/uploads/", "");
        const filePath = path.join(uploadsDir, filename);

        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            console.log(`Deleted image: ${filePath}`);
            return true;
        }
    } catch (error) {
        console.error(`Error deleting image ${imageUrl}:`, error);
    }
    return false;
};

// Delete multiple image files
export const deleteMultipleImages = (imageUrls) => {
    if (!Array.isArray(imageUrls)) return false;

    imageUrls.forEach((url) => deleteImageFile(url));
    return true;
};

// Get new image path after upload
export const getImagePath = (file) => {
    if (!file) return null;
    return `/uploads/${file.filename}`;
};

// Handle single image update: delete old, return new
export const handleImageUpdate = (oldImageUrl, newFile) => {
    if (newFile) {
        // Delete old image if exists
        if (oldImageUrl) {
            deleteImageFile(oldImageUrl);
        }
        // Return new image path
        return getImagePath(newFile);
    }
    // No new image, keep old one
    return oldImageUrl;
};

// Handle array of images update (for before/after images)
export const handleImageArrayUpdate = (oldImages, newFiles, positions = null) => {
    if (!newFiles || newFiles.length === 0) return oldImages;

    // Delete all old images
    if (oldImages && oldImages.length > 0) {
        deleteMultipleImages(oldImages);
    }

    // Return new image paths
    return newFiles.map((file) => getImagePath(file));
};
