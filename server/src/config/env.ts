import dotenv from "dotenv";

dotenv.config();

export const config = {
  port: Number(process.env.PORT) || 8000,
  nodeEnv: process.env.NODE_ENV || "development",
  corsOrigin: process.env.CORS_ORIGIN || "*",
  databaseUrl: process.env.DATABASE_URL || "",
  isProduction: process.env.NODE_ENV === "production",
} as const;

export default config;

