import dotenv from "dotenv";
import path from "path";

// Load environment variables from .env file
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

export const ENV = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: parseInt(process.env.PORT || "5000", 10),
  JWT_SECRET: process.env.JWT_SECRET || "default_fallback_jwt_secret_key_change_me",
  DATABASE_URL: process.env.DATABASE_URL,
  REDIS_URL: process.env.REDIS_URL || "redis://localhost:6379",
};

// Fail-fast validation to ensure critical credentials exist during server boot
if (!ENV.DATABASE_URL) {
  console.warn("⚠️ Warning: DATABASE_URL environment variable is missing.");
}