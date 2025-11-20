import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/appError";

export function errorHandler(
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  console.error("ERROR:", err);

  if (err instanceof AppError) {
    return res.status(err.status).json({
      error: err.code,
      message: err.message,
    });
  }

  if (err?.name === "ZodError") {
    return res.status(400).json({
      error: "VALIDATION_ERROR",
      message: "Validation failed",
      issues: err.issues,
    });
  }

  return res.status(500).json({
    error: "INTERNAL_SERVER_ERROR",
    message: "Internal server error",
  });
}