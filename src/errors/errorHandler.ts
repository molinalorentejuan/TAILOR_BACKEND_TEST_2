// src/errors/errorHandler.ts
import { Request, Response, NextFunction } from "express";
import { AppError } from "./appError";
import { t } from "../i18n";
import { ZodError } from "zod";
import { StatusCodes } from "http-status-codes";

export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error(err);

  if (err instanceof AppError) {
    return res.status(err.status).json({
      error: err.code,
      message: t(req, err.code),
      request_id: req.request_id,
    });
  }

  if (err instanceof ZodError) {
    const key = err.errors[0]?.message || "VALIDATION_ERROR";
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: "VALIDATION_ERROR",
      message: t(req, key),
      request_id: req.request_id,
    });
  }

  return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    error: "INTERNAL_ERROR",
    message: t(req, "INTERNAL_ERROR"),
    request_id: req.request_id,
  });
}