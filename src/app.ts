import express from "express";
import mongoose from "mongoose";
import { config } from "./config";
import { errorHandler } from "./middleware/error-handler";
import { userRoutes } from "./routes/user-routes";
import { startScheduler } from "./services/scheduler-service";

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use("/user", userRoutes);

// Error handling
app.use(errorHandler);

// Starting APP
mongoose
  .connect(config.mongoUri)
  .then(() => {
    console.log("Connected to MongoDB");
    // We start the scheduler, it will start processing messages
    startScheduler();
  })
  .catch((err) => console.error("MongoDB connection error:", err));

export { app };
