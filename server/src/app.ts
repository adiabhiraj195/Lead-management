import express, { Application } from "express";
import cors from "cors";
import config from "./config/env";
import routes from "./routes";
import { getHealth } from "./controllers/health.controller";
import { notFoundHandler } from "./middleware/notFoundHandler";
import { errorHandler } from "./middleware/errorHandler";

const app: Application = express();

// Enable CORS
app.use(
  cors({
    origin: config.corsOrigin === "*" ? "*" : config.corsOrigin.split(","),
    credentials: true,
  })
);

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root health-check
app.get("/health", getHealth);

// API routes
app.use("/api", routes);

// 404 handler for undefined routes
app.use(notFoundHandler);

// Centralized error handler
app.use(errorHandler);

export default app;

