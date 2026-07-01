import { Request, Response, NextFunction } from "express";
import { authService } from "./auth.service";

export class AuthController {
  async sendSignupOtp(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await authService.sendSignupOtp(req.body);
      res.status(200).json({ success: true, message: result.message });
    } catch (error) {
      next(error);
    }
  }

  async verifySignupOtp(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await authService.verifySignupOtp(req.body);
      res.status(201).json({
        success: true,
        message: "User registration completed successfully.",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async sendLoginOtp(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await authService.sendLoginOtp(req.body);
      res.status(200).json({ success: true, message: result.message });
    } catch (error) {
      next(error);
    }
  }

  async verifyLoginOtp(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await authService.verifyLoginOtp(req.body);
      res.status(200).json({
        success: true,
        message: "Login successful.",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const authController = new AuthController();