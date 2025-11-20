// src/routes/auth.ts
import { Router } from "express";
import { validateBody } from "../middleware/validate";
import { authRateLimiter } from "../middleware/rateLimit";
import { container } from "../container";
import { AuthService } from "../services/authService";
import { RegisterDTO, LoginDTO } from "../dto/authDTO";

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
      return res.status(201).json({ token });
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
      const { token, user } = authService.loginUser(req.body);
      return res.json({ token, user });
    } catch (err) {
      next(err);
    }
  }
);

export default router;