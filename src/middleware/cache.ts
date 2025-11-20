import NodeCache from "node-cache";
import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/appError";

const cache = new NodeCache({ stdTTL: 30 });

export function cacheMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (req.method !== "GET") return next();

    const key = req.originalUrl;
    const hit = cache.get(key);

    if (hit) {
      return res.json(hit);
    }

    const originalJson = res.json.bind(res);
    res.json = (body: any) => {
      try {
        cache.set(key, body);
      } catch (e) {
        console.error("Cache write error:", e);
      }
      return originalJson(body);
    };

    return next();
  } catch (err) {
    return next(
      new AppError(
        "CACHE_MIDDLEWARE_ERROR",
        500,
        "CACHE_MIDDLEWARE_ERROR"
      )
    );
  }
}

export function invalidateCache() {
  try {
    cache.flushAll();
  } catch (err) {
    console.error("Cache flush error:", err);
  }
}