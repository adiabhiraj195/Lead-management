import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { Prisma } from "@prisma/client";
import config from "../config/env";

export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(message: string, statusCode = 500, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
): void => {
  // Handle Zod schema validation errors
  if (err instanceof ZodError) {
    const issues = err.issues.map((issue) => ({
      field: issue.path.join("."),
      message: issue.message,
    }));

    res.status(400).json({
      success: false,
      error: {
        message: "Validation failed",
        status: 400,
        details: issues,
        ...(config.nodeEnv === "development" && { stack: err.stack }),
      },
    });
    return;
  }

  // Handle Prisma unique constraint violations (e.g. duplicate email)
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      const target = Array.isArray(err.meta?.target)
        ? err.meta.target.join(", ")
        : (err.meta?.target as string) || "field";
      res.status(409).json({
        success: false,
        error: {
          message: `A lead with this ${target} already exists`,
          status: 409,
          ...(config.nodeEnv === "development" && { stack: err.stack }),
        },
      });
      return;
    }
  }

  const statusCode =
    "statusCode" in err && typeof err.statusCode === "number"
      ? err.statusCode
      : 500;
  const message = err.message || "Internal Server Error";

  res.status(statusCode).json({
    success: false,
    error: {
      message,
      status: statusCode,
      ...(config.nodeEnv === "development" && { stack: err.stack }),
    },
  });
};

