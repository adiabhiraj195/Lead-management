export interface HealthStatus {
  status: "ok" | "error";
  uptime: number;
  timestamp: string;
  environment: string;
}

export const getHealthStatus = (): HealthStatus => {
  return {
    status: "ok",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
  };
};

