// src/routes/index.ts
import { Router } from "express";
import { authRoutes } from "../modules/auth/auth.routes";
import userRoutes from "../modules/users/users.routes"; // 🚀 FIXED: Added the missing import statement

const router = Router();

// Mount the Auth sub-routes onto the router instance
router.use("/auth", authRoutes);

// Mount the User sub-routes onto the router instance
// This securely maps the routes to: /api/v1/users/me, /api/v1/users/profile, etc.
router.use("/users", userRoutes);

export default router;