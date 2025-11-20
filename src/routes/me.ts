// src/routes/me.ts
import { Router } from "express";
import { authMiddleware, AuthRequest } from "../middleware/auth";
import { validateBody, validateParams } from "../middleware/validate";
import {
  UpdateReviewDTO,
  ReviewIdParamDTO,
} from "../dto/reviewDTO";
import { FavoriteParamsDTO } from "../dto/favoriteDTO";
import { invalidateCache } from "../middleware/cache";
import { container } from "../container";
import { UserService } from "../services/userService";

const router = Router();
const userService = container.resolve(UserService);

/**
 * GET /me
 */
router.get("/", authMiddleware, (req: AuthRequest, res, next) => {
  try {
    const user = userService.getUserById(req.user!.id);
    return res.json(user);
  } catch (err) {
    next(err);
  }
});

/**
 * GET /me/reviews
 */
router.get("/reviews", authMiddleware, (req: AuthRequest, res, next) => {
  try {
    const rows = userService.listReviewsByUser(req.user!.id);
    return res.json(rows);
  } catch (err) {
    next(err);
  }
});

/**
 * PUT /me/reviews/:id
 */
router.put(
  "/reviews/:id",
  authMiddleware,
  validateParams(ReviewIdParamDTO),
  validateBody(UpdateReviewDTO),
  (req: AuthRequest, res, next) => {
    try {
      const reviewId = Number(req.params.id);
      const { rating, comment } = req.body;

      userService.updateUserReview(
        { id: reviewId },
        { rating, comment },
        req.user!.id
      );

      invalidateCache();
      return res.json({ message: "Review updated" });
    } catch (err) {
      next(err);
    }
  }
);

/**
 * DELETE /me/reviews/:id
 */
router.delete(
  "/reviews/:id",
  authMiddleware,
  validateParams(ReviewIdParamDTO),
  (req: AuthRequest, res, next) => {
    try {
      const reviewId = Number(req.params.id);

      userService.deleteUserReview({ id: reviewId }, req.user!.id);

      invalidateCache();
      return res.status(204).send();
    } catch (err) {
      next(err);
    }
  }
);

/**
 * POST /me/favorites/:restaurantId
 */
router.post(
  "/favorites/:restaurantId",
  authMiddleware,
  validateParams(FavoriteParamsDTO),
  (req: AuthRequest, res, next) => {
    try {
      const restaurantId = Number(req.params.restaurantId);

      userService.addFavorite(req.user!.id, restaurantId);

      invalidateCache();
      return res.status(201).json({ message: "Favorite added" });
    } catch (err) {
      next(err);
    }
  }
);

/**
 * DELETE /me/favorites/:restaurantId
 */
router.delete(
  "/favorites/:restaurantId",
  authMiddleware,
  validateParams(FavoriteParamsDTO),
  (req: AuthRequest, res, next) => {
    try {
      const restaurantId = Number(req.params.restaurantId);

      userService.removeFavorite(req.user!.id, restaurantId);

      invalidateCache();
      return res.status(204).send();
    } catch (err) {
      next(err);
    }
  }
);

/**
 * GET /me/favorites
 */
router.get("/favorites", authMiddleware, (req: AuthRequest, res, next) => {
  try {
    const rows = userService.listFavoritesByUser(req.user!.id);
    return res.json(rows);
  } catch (err) {
    next(err);
  }
});

export default router;