import { StatusCodes } from "http-status-codes";
import { ZodError } from "zod";

export function errorHandler(err, req, res, next) {
  console.error(err);

  if (err instanceof AppError) {
    return res.status(err.status).json({
      error: err.code,
      message: t(req, err.code),
      request_id: req.request_id,
    });
  }

  if (err instanceof ZodError) {
    const firstIssueKey = err.errors[0]?.message || "VALIDATION_ERROR";
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: "VALIDATION_ERROR",
      message: t(req, firstIssueKey),
      request_id: req.request_id,
    });
  }

  return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    error: "INTERNAL_SERVER_ERROR",
    message: t(req, "INTERNAL_ERROR"),
    request_id: req.request_id,
  });
}