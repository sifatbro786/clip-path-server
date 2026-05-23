// controllers/contactController.js
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import nodemailer from "nodemailer";
import { Submission, PageContent } from "../models/Contact.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ── Email template ────────────────────────────────────────────────────────────
const TEMPLATE_PATH = path.join(__dirname, "..", "templates", "contactEmail.html");
let emailTemplate = "";
try {
    emailTemplate = fs.readFileSync(TEMPLATE_PATH, "utf-8");
} catch (err) {
    console.error("⚠️  Could not load email template:", err.message);
}

const renderTemplate = (tpl, vars) => tpl.replace(/\{\{(\w+)\}\}/g, (_, k) => vars[k] ?? "");

const createTransporter = () =>
    nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || 587,
        secure: process.env.SMTP_SECURE === "true",
        auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });

// Non-fatal file cleanup
const cleanupFiles = (paths = []) =>
    paths.forEach((fp) =>
        fs.unlink(fp, (err) => {
            if (err) console.error(`⚠️  Could not delete: ${fp}`, err.message);
        }),
    );

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/contact/submit  — public
// ─────────────────────────────────────────────────────────────────────────────
export const submitContact = async (req, res) => {
    const uploadedFiles = req.files ?? []; // multer File objects
    const uploadedFilePaths = uploadedFiles.map((f) => f.path);

    try {
        const { jobName, email, instructions, estimatedTime } = req.body;

        if (!jobName?.trim() || !email?.trim()) {
            cleanupFiles(uploadedFilePaths);
            return res.status(400).json({ error: "jobName and email are required." });
        }

        // 1 ── Save ONLY submission fields — no page content defaults leak in
        const submission = await Submission.create({
            jobName: jobName.trim(),
            email: email.trim().toLowerCase(),
            instructions: instructions?.trim() || "",
            estimatedTime: estimatedTime?.trim() || "Not specified",
            filePaths: uploadedFilePaths,
            status: "new",
        });

        // 2 ── Send email WITH files attached
        try {
            // Build nodemailer attachments from the actual File objects on disk.
            // filename → original name shown in email client
            // path     → absolute path nodemailer reads from disk
            const attachments = uploadedFiles.map((f) => ({
                filename: f.originalname, // "product-shot.jpg"
                path: f.path, // absolute disk path
                contentType: f.mimetype, // "image/jpeg" etc.
            }));

            // Readable list for the email body (shows original names)
            const fileList =
                uploadedFiles.length > 0
                    ? uploadedFiles.map((f) => f.originalname).join(", ")
                    : "No files attached";

            const html = renderTemplate(emailTemplate, {
                jobName: submission.jobName,
                email: submission.email,
                instructions: submission.instructions || "No instructions provided.",
                estimatedTime: submission.estimatedTime,
                fileList,
                year: new Date().getFullYear(),
            });

            await createTransporter().sendMail({
                from: `"Rapid Clipping Path" <${process.env.SMTP_USER}>`,
                to: process.env.OWNER_EMAIL,
                replyTo: submission.email,
                subject: `📋 New Job Inquiry: ${submission.jobName}`,
                html,
                text: [
                    `New Job Inquiry — ${submission.jobName}`,
                    `From:       ${submission.email}`,
                    `Turnaround: ${submission.estimatedTime}`,
                    `Files:      ${fileList}`,
                    "",
                    "Instructions:",
                    submission.instructions || "None provided.",
                ].join("\n"),
                attachments, // ← actual files go here
            });

            // 3 ── Delete from disk AFTER email is sent (nodemailer is done reading)
            cleanupFiles(uploadedFilePaths);

            // Clear stored paths — files are gone from server
            await Submission.findByIdAndUpdate(submission._id, { filePaths: [] });
        } catch (emailErr) {
            console.error("⚠️  Email failed:", emailErr.message);
            // Still clean up even on email failure
            cleanupFiles(uploadedFilePaths);

            return res.status(207).json({
                message:
                    "Submission saved, but the notification email could not be sent. Your request is recorded.",
                submissionId: submission._id,
                emailError: emailErr.message,
            });
        }

        return res.status(201).json({
            message: "Thank you! We\u2019ll respond within one business day.",
            submissionId: submission._id,
        });
    } catch (err) {
        cleanupFiles(uploadedFilePaths);
        console.error("❌ submitContact:", err);

        if (err.name === "ValidationError") {
            return res.status(400).json({
                error: Object.values(err.errors)
                    .map((e) => e.message)
                    .join(" | "),
            });
        }
        return res.status(500).json({ error: "Unexpected error. Please try again." });
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/contact/stats  — protected (super admin)
// ─────────────────────────────────────────────────────────────────────────────
export const getContactStats = async (_req, res) => {
    try {
        const [totalCount, recentSubmissions] = await Promise.all([
            Submission.countDocuments(),
            Submission.find()
                .sort({ createdAt: -1 })
                .limit(10)
                .select("jobName email estimatedTime status createdAt")
                .lean(),
        ]);
        return res.status(200).json({ totalCount, recentSubmissions });
    } catch (err) {
        console.error("❌ getContactStats:", err);
        return res.status(500).json({ error: "Failed to retrieve stats." });
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/contact/page-content  — public
// ─────────────────────────────────────────────────────────────────────────────
export const getPageContent = async (_req, res) => {
    try {
        let content = await PageContent.getSingleton();

        // First-ever request: create the singleton so defaults are persisted
        if (!content) {
            content = await PageContent.create({});
        }

        return res.status(200).json(content);
    } catch (err) {
        console.error("❌ getPageContent:", err);
        return res.status(500).json({ error: "Failed to retrieve page content." });
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// PUT /api/contact/page-content  — protected (super admin)
// Body: any subset of page content fields, e.g.:
//   { "hero.headingLine2Italic": "into perfect focus." }
//   { "assurance.cards": [ { num:"01", title:"...", body:"..." }, ... ] }
// ─────────────────────────────────────────────────────────────────────────────
export const updatePageContent = async (req, res) => {
    try {
        const updates = req.body;

        if (!updates || typeof updates !== "object" || Array.isArray(updates)) {
            return res
                .status(400)
                .json({ error: "Body must be a JSON object of fields to update." });
        }
        if (Object.keys(updates).length === 0) {
            return res.status(400).json({ error: "No fields provided to update." });
        }

        const updated = await PageContent.updateSingleton(updates);
        return res.status(200).json({ message: "Page content updated.", data: updated });
    } catch (err) {
        console.error("❌ updatePageContent:", err);
        if (err.name === "ValidationError") {
            return res.status(400).json({
                error: Object.values(err.errors)
                    .map((e) => e.message)
                    .join(" | "),
            });
        }
        return res.status(500).json({ error: "Failed to update page content." });
    }
};
