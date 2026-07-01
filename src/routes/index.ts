import { Router } from "express";
import { authRoutes } from "../modules/auth/auth.routes";

const router = Router();

// Mount the Auth sub-routes onto the router instance
router.use("/auth", authRoutes);

export default router;