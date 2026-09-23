import { Request, Response } from "express";
import { getHealthStatus } from "../services/health.service";

export const getHealth = (req: Request, res: Response): void => {
  const health = getHealthStatus();
  res.status(200).json({
    success: true,
    data: health,
  });
};

