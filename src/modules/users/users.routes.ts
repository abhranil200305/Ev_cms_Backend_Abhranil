import { Router } from "express";
import { UsersController } from "./users.controller";
import { authenticate } from "../auth/middleware/auth.middleware";
import multer from "multer";

const upload = multer({ dest: "uploads/" });

const router = Router();
const controller = new UsersController();

router.use(authenticate);

router.get("/me", controller.getProfile);
router.post("/profile", upload.any(), controller.createProfile);
router.patch("/profile", upload.any(), controller.updateProfile);

export default router;