// src/routes/auth.ts
import { Router } from "express";
import { validateBody } from "../middleware/validate";
import { authRateLimiter } from "../middleware/rateLimit";
import { container } from "../container";
import { AuthService } from "../services/authService";
import { RegisterDTO, LoginDTO } from "../dto/authDTO";
import { AuthRegisterResponseDTO, AuthLoginResponseDTO } from "../dto/responseDTO";
import { StatusCodes } from "http-status-codes";

const router = Router();
const authService = container.resolve(AuthService);

/**
 * POST /auth/register
 */
router.post(
  "/register",
  authRateLimiter,
  validateBody(RegisterDTO),
  (req, res, next) => {
    try {
      const token = authService.registerUser(req.body);
      const response = AuthRegisterResponseDTO.parse({ token });
      return res.status(StatusCodes.CREATED).json(response);
    } catch (err) {
      next(err);
    }
  }
);

/**
 * POST /auth/login
 */
router.post(
  "/login",
  authRateLimiter,
  validateBody(LoginDTO),
  (req, res, next) => {
    try {
      const result = authService.loginUser(req.body);
      const response = AuthLoginResponseDTO.parse(result);
      return res.status(StatusCodes.OK).json(response);
    } catch (err) {
      next(err);
    }
  }
);

export default router;