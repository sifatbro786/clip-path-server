import express from "express";
import {
  createHero,
  getAllHeroes,
  getHeroByPage,
  getHeroById,
  updateHero,
  deleteHero,
  toggleHeroStatus,
  bulkUpdateOrder
} from "../controllers/heroController.js";
import { authMiddleware } from "../middleware/auth.js";
import { upload } from "../config/cloudinary.js";

const router = express.Router();

// Public routes
router.get("/", getAllHeroes);
router.get("/page/:page", getHeroByPage);
router.get("/id/:id", getHeroById);

// Protected routes (Admin only)
router.post("/", authMiddleware, upload.single("image"), createHero);
router.put("/:id", authMiddleware, upload.single("image"), updateHero);
router.delete("/:id", authMiddleware, deleteHero);
router.patch("/:id/toggle", authMiddleware, toggleHeroStatus);
router.patch("/bulk-order", authMiddleware, bulkUpdateOrder);

export default router;