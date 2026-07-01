import { Router } from "express";
import { authController } from "./auth.controller";

const router = Router();

router.post("/signup/send-otp", authController.sendSignupOtp);
router.post("/signup/verify-otp", authController.verifySignupOtp);
router.post("/login/send-otp", authController.sendLoginOtp);
router.post("/login/verify-otp", authController.verifyLoginOtp);

export const authRoutes = router;