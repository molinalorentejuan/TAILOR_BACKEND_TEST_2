// src/middleware/validate.ts
import { NextFunction, Request, Response } from "express";
import { ZodSchema } from "zod";
import { AppError } from "../errors/appError";
import { t } from "../i18n";

export function validateBody(schema: ZodSchema<any>) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const parsed = schema.safeParse(req.body);

    if (!parsed.success) {
      return next(
        new AppError(
          t(req, "INVALID_PAYLOAD"),
          400,
          "VALIDATION_ERROR",
        )
      );
    }

    req.body = parsed.data;
    return next();
  };
}

export function validateQuery(schema: ZodSchema<any>) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const parsed = schema.safeParse(req.query);

    if (!parsed.success) {
      return next(
        new AppError(
          t(req, "INVALID_PAYLOAD"),
          400,
          "VALIDATION_ERROR",
        )
      );
    }

    req.query = parsed.data;
    return next();
  };
}

export function validateParams(schema: ZodSchema<any>) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const parsed = schema.safeParse(req.params);

    if (!parsed.success) {
      return next(
        new AppError(
          t(req, "INVALID_PAYLOAD"),
          400,
          "VALIDATION_ERROR",
        )
      );
    }

    req.params = parsed.data;
    return next();
  };
}