import { NextFunction, Request, Response } from "express";
import { ZodSchema, ZodError } from "zod";
import { AppError } from "../errors/appError";
import { t } from "../i18n";

/* ------------------------------ */
/* BODY VALIDATION                */
/* ------------------------------ */
export function validateBody(schema: ZodSchema<any>) {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      const parsed = schema.parse(req.body);
      req.body = parsed;
      return next();
    } catch (err) {
      if (err instanceof ZodError) {
        const firstIssue = err.errors[0]?.message ?? "VALIDATION_ERROR";
        return next(new AppError(t(req, firstIssue), 400));
      }
      return next(err);
    }
  };
}

/* ------------------------------ */
/* QUERY VALIDATION               */
/* ------------------------------ */
export function validateQuery(schema: ZodSchema<any>) {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      const parsed = schema.parse(req.query);
      req.query = parsed;
      return next();
    } catch (err) {
      if (err instanceof ZodError) {
        const firstIssue = err.errors[0]?.message ?? "VALIDATION_ERROR";
        return next(new AppError(t(req, firstIssue), 400));
      }
      return next(err);
    }
  };
}

/* ------------------------------ */
/* PARAMS VALIDATION              */
/* ------------------------------ */
export function validateParams(schema: ZodSchema<any>) {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      const parsed = schema.parse(req.params);
      req.params = parsed;
      return next();
    } catch (err) {
      if (err instanceof ZodError) {
        const firstIssue = err.errors[0]?.message ?? "VALIDATION_ERROR";
        return next(new AppError(t(req, firstIssue), 400));
      }
      return next(err);
    }
  };
}