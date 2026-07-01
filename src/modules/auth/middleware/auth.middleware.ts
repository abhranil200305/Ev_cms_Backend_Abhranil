import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// Extend Express Request declaration locally to allow strong-typed user access
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        userUid: string;
        email: string;
        accountType: "Admin" | "Driver" | "Vehicle Owner" | "User";
      };
    }
  }
}

export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({
      success: false,
      message: "Authorization token missing or malformed.",
    });
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "default_fallback_secret") as Express.Request["user"];
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Invalid or expired authorization session.",
    });
  }
};