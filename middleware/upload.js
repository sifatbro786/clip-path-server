// middleware/upload.js
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure the uploads directory exists at startup
const uploadsDir = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// ── Disk storage ──────────────────────────────────────────────────────────────
const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, uploadsDir);
    },
    filename: (_req, file, cb) => {
        // Prefix with timestamp + random suffix to avoid collisions
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        const ext = path.extname(file.originalname).toLowerCase();
        const base = path
            .basename(file.originalname, ext)
            .replace(/[^a-z0-9]/gi, "_")
            .slice(0, 60); // cap length
        cb(null, `${base}-${uniqueSuffix}${ext}`);
    },
});

// ── File type whitelist ────────────────────────────────────────────────────────
const ALLOWED_MIMETYPES = new Set([
    // Images
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
    "image/tiff",
    "image/bmp",
    "image/svg+xml",
    // Video
    "video/mp4",
    "video/quicktime",
    "video/x-msvideo",
    "video/webm",
    // Archive
    "application/zip",
    "application/x-zip-compressed",
    "application/x-zip",
]);

const fileFilter = (_req, file, cb) => {
    if (ALLOWED_MIMETYPES.has(file.mimetype)) {
        cb(null, true);
    } else {
        cb(
            new Error(
                `File type '${file.mimetype}' is not allowed. Only images, videos, and ZIP archives are accepted.`,
            ),
            false,
        );
    }
};

// ── Multer instance ───────────────────────────────────────────────────────────
const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10 MB per file
        files: 20, // max 20 files per submission
    },
});

// ── Error-handling wrapper ─────────────────────────────────────────────────────
// Converts multer errors into a JSON response instead of crashing the server.
export const handleUpload = (fieldName) => (req, res, next) => {
    const multerMiddleware = upload.array(fieldName);
    multerMiddleware(req, res, (err) => {
        if (!err) return next();

        if (err instanceof multer.MulterError) {
            if (err.code === "LIMIT_FILE_SIZE") {
                return res
                    .status(400)
                    .json({ error: "File too large. Maximum size is 10 MB per file." });
            }
            if (err.code === "LIMIT_FILE_COUNT") {
                return res
                    .status(400)
                    .json({ error: "Too many files. Maximum is 20 files per submission." });
            }
            return res.status(400).json({ error: `Upload error: ${err.message}` });
        }

        // Custom fileFilter error
        return res.status(400).json({ error: err.message });
    });
};

export default upload;
