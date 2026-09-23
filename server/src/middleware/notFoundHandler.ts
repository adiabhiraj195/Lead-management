import { Request, Response, NextFunction } from "express";
import { AppError } from "./errorHandler";

export const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  next(new AppError(`Cannot ${req.method} ${req.originalUrl} - Not Found`, 404));
};

