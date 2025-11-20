// src/utils/jwt.ts
import "dotenv/config";
import jwt, { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import { AppError } from "../errors/appError";

const JWT_SECRET = process.env.JWT_SECRET;
const EXPIRES_IN = process.env.JWT_EXPIRES_IN ?? "7d";

if (!JWT_SECRET) {
  console.warn(
    "[WARN] JWT_SECRET is missing. Using insecure fallback key (DEV only)"
  );
}

/**
 * Payload tipado
 */
export interface JwtPayload {
  id: number;
  role: "USER" | "ADMIN";
  iat?: number;
  exp?: number;
}

/**
 * Firmar token (PRO)
 */
export function signToken(payload: Pick<JwtPayload, "id" | "role">): string {
  return jwt.sign(payload, JWT_SECRET ?? "dev_fallback_key", {
    expiresIn: EXPIRES_IN,
  });
}

/**
 * Verificar token con errores controlados
 */
export function verifyToken(token: string): JwtPayload {
  try {
    return jwt.verify(token, JWT_SECRET ?? "dev_fallback_key") as JwtPayload;
  } catch (err) {
    if (err instanceof TokenExpiredError) {
      throw new AppError("Token expired", 401, "TOKEN_EXPIRED");
    }
    if (err instanceof JsonWebTokenError) {
      throw new AppError("Invalid token", 401, "TOKEN_INVALID");
    }
    throw new AppError("Auth error", 401, "AUTH_ERROR");
  }
}