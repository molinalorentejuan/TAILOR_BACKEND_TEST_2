import { NextFunction, Request, Response } from "express";
import { ZodSchema, ZodError } from "zod";

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
      return next(err); // <-- NO LO TRANSFORMES, PASA EL ZODERROR TAL CUAL
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
      return next(err); // <-- PASA EL ZODERROR PURO
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
      return next(err); // <-- PASA EL ZODERROR PURO
    }
  };
}