import app from "./app";
import { ENV } from "./config/env";

const PORT = ENV.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`=================================`);
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`=================================`);
});

// Handle Unhandled Promise Rejections gracefully
process.on("unhandledRejection", (err: Error) => {
  console.error("❌ UNHANDLED REJECTION! Shutting down gracefully...");
  console.error(err.name, err.message);
  
  server.close(() => {
    process.exit(1);
  });
});

// Handle Uncaught Exceptions cleanly
process.on("uncaughtException", (err: Error) => {
  console.error("❌ UNCAUGHT EXCEPTION! Shutting down gracefully...");
  console.error(err.name, err.message);
  
  server.close(() => {
    process.exit(1);
  });
});