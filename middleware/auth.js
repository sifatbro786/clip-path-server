// middleware/auth.js
import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";

export const authMiddleware = (req, res, next) => {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
        return res.status(401).json({ error: "Access denied. No token provided." });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.adminId = decoded.adminId;
        req.adminRole = decoded.role;
        next();
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ error: "Token expired. Please login again." });
        }
        res.status(401).json({ error: "Invalid token." });
    }
};

export const requireSuperAdmin = async (req, res, next) => {
    try {
        const admin = await Admin.findById(req.adminId);
        if (!admin || admin.role !== "super_admin") {
            return res
                .status(403)
                .json({ error: "Access denied. Super admin privileges required." });
        }
        next();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
