import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/appError";
import { t } from "../i18n";

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  _next: NextFunction
) {
  console.error("ERROR:", err);

  if (err instanceof AppError) {
    return res.status(err.status).json({
      error: err.code,
      message: t(req, err.code), // ← ✔️ AQUÍ SE TRADUCE
    });
  }

  if (err?.name === "ZodError") {
    return res.status(400).json({
      error: "VALIDATION_ERROR",
      message: t(req, "VALIDATION_ERROR"), // ← opcional
      issues: err.issues,
    });
  }

  return res.status(500).json({
    error: "INTERNAL_SERVER_ERROR",
    message: t(req, "INTERNAL_SERVER_ERROR"), // ← opcional
  });
}