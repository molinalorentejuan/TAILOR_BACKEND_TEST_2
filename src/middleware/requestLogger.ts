import { logger } from "../logger";

export function requestLogger(req, _res, next) {
  logger.info(`[${req.request_id}] ${req.method} ${req.originalUrl}`);
  next();
}