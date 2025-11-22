// src/routes/me.ts
import { Router } from "express";
import { authMiddleware, AuthRequest } from "../middleware/auth";
import { validateBody, validateParams } from "../middleware/validate";
import { UpdateReviewDTO, ReviewParamsDTO } from "../dto/reviewDTO";
import { FavoriteParamsDTO } from "../dto/favoriteDTO";
import { invalidateCache } from "../middleware/cache";
import { container } from "../container";
import { UserService } from "../services/userService";

import {
  UserResponseDTO,
  UserReviewListDTO,
  ReviewIdResponseDTO,
  FavoriteActionResponseDTO,
  FavoriteRestaurantListDTO,
} from "../dto/responseDTO";

import { StatusCodes } from "http-status-codes";

const router = Router();
const userService = container.resolve(UserService);

/**
 * GET /me
 */
router.get("/", authMiddleware, (req: AuthRequest, res, next) => {
  try {
    const user = userService.getUserById(req.user!.id);
    const response = UserResponseDTO.parse(user);
    return res.status(StatusCodes.OK).json(response);
  } catch (err) {
    next(err);
  }
});

/**
 * GET /me/reviews
 */
router.get("/reviews", authMiddleware, (req: AuthRequest, res, next) => {
  try {
    const reviews = userService.listReviewsByUser(req.user!.id);
    const response = UserReviewListDTO.parse(reviews);
    return res.status(StatusCodes.OK).json(response);
  } catch (err) {
    next(err);
  }
});

/**
 * PUT /me/reviews/:id
 */
router.put(
  "/reviews/:review_id",
  authMiddleware,
  validateParams(ReviewParamsDTO),
  validateBody(UpdateReviewDTO),
  (req: AuthRequest, res, next) => {
    try {
      const reviewId = Number(req.params.id);
      const { rating, comment } = req.body;
      userService.updateUserReview(
        { review_id: reviewId },
        { rating, comment },
        req.user!.id
      );
      invalidateCache();
      const response = ReviewIdResponseDTO.parse({ id: reviewId });
      return res.status(StatusCodes.OK).json(response);
    } catch (err) {
      next(err);
    }
  }
);

/**
 * DELETE /me/reviews/:id
 */
router.delete(
  "/reviews/:review_id",
  authMiddleware,
  validateParams(ReviewParamsDTO),
  (req: AuthRequest, res, next) => {
    try {
      const reviewId = Number(req.params.id);
      userService.deleteUserReview({ review_id: reviewId }, req.user!.id);
      invalidateCache();
      return res.status(StatusCodes.NO_CONTENT).send();
    } catch (err) {
      next(err);
    }
  }
);

/**
 * POST /me/favorites/:restaurant_id
 */
router.post(
  "/favorites/:restaurant_id",
  authMiddleware,
  validateParams(FavoriteParamsDTO),
  (req: AuthRequest, res, next) => {
    try {
      const restaurantId = Number(req.params.restaurant_id);
      userService.addFavorite(req.user!.id, restaurantId);
      invalidateCache();
      const response = FavoriteActionResponseDTO.parse({
        restaurantId,
      });
      return res.status(StatusCodes.CREATED).json(response);
    } catch (err) {
      next(err);
    }
  }
);

/**
 * DELETE /me/favorites/:restaurant_id
 */
router.delete(
  "/favorites/:restaurant_id",
  authMiddleware,
  validateParams(FavoriteParamsDTO),
  (req: AuthRequest, res, next) => {
    try {
      const restaurantId = Number(req.params.restaurant_id);
      userService.removeFavorite(req.user!.id, restaurantId);
      invalidateCache();
      return res.status(StatusCodes.NO_CONTENT).send();
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
    const favs = userService.listFavoritesByUser(req.user!.id);
    const response = FavoriteRestaurantListDTO.parse(favs);
    return res.status(StatusCodes.OK).json(response);
  } catch (err) {
    next(err);
  }
});

export default router;