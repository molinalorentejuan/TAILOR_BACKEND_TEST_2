// src/middleware/validate.ts
import { NextFunction, Request, Response } from "express";
import { ZodSchema, ZodError } from "zod";
import { AppError } from "../errors/appError";
import { t } from "../i18n";

export function validateBody(schema: ZodSchema<any>) {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      const parsed = schema.parse(req.body);
      req.body = parsed;
      return next();
    } catch (err) {
      if (err instanceof ZodError) {
        const details = err.errors.map((e) => ({
          field: e.path.join("."),
          message: t(req, e.message),
        }));

        return next(
          new AppError(
            t(req, "VALIDATION_ERROR"),
            400,
            "VALIDATION_ERROR",
            details
          )
        );
      }

      return next(err);
    }
  };
}

export function validateQuery(schema: ZodSchema<any>) {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      const parsed = schema.parse(req.query);
      req.query = parsed;
      return next();
    } catch (err) {
      if (err instanceof ZodError) {
        const details = err.errors.map((e) => ({
          field: e.path.join("."),
          message: t(req, e.message),
        }));

        return next(
          new AppError(
            t(req, "VALIDATION_ERROR"),
            400,
            "VALIDATION_ERROR",
            details
          )
        );
      }

      return next(err);
    }
  };
}

export function validateParams(schema: ZodSchema<any>) {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      const parsed = schema.parse(req.params);
      req.params = parsed;
      return next();
    } catch (err) {
      if (err instanceof ZodError) {
        const details = err.errors.map((e) => ({
          field: e.path.join("."),
          message: t(req, e.message),
        }));

        return next(
          new AppError(
            t(req, "VALIDATION_ERROR"),
            400,
            "VALIDATION_ERROR",
            details
          )
        );
      }

      return next(err);
    }
  };
}