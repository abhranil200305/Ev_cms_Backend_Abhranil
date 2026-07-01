// src/app.ts
import express from "express";
import apiRouter from "./routes/index";

const app = express();

// 1. Diagnostic Logging & Sanitization Middleware
app.use((req, res, next) => {
  // Cleans hidden carriage returns (\r) or trailing whitespaces from incoming client headers
  req.url = req.url.trim().replace(/\r$/, "");
  console.log(`[${new Date().toISOString()}] 📥 Incoming Traffic: ${req.method} ${req.url}`);
  next();
});

// 2. Parsers for Payload Strings
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 3. Mount Central API Router
app.use("/api/v1", apiRouter);

// 4. Catch-all Global 404 Route Interceptor
app.use((req, res) => {
  console.error(`[404 Error] ❌ No route matched for: ${req.method} ${req.url}`);
  res.status(404).json({
    success: false,
    message: `Cannot ${req.method} ${req.url}. Please check your version prefix rules.`,
  });
});

export default app;