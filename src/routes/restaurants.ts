// src/routes/restaurants.ts
import { Router } from "express";
import { cacheMiddleware, invalidateCache } from "../middleware/cache";
import { authMiddleware, AuthRequest } from "../middleware/auth";
import {
  validateQuery,
  validateBody,
  validateParams,
} from "../middleware/validate";
import {
  RestaurantsQueryDTO,
  CreateRestaurantDTO, // Solo para admin pero no molesta aquí
} from "../dto/restaurantDTO";
import { CreateReviewDTO, ReviewIdParamDTO } from "../dto/reviewDTO";
import { container } from "../container";
import { RestaurantService } from "../services/restaurantService";

const router = Router();
const restaurantService = container.resolve(RestaurantService);

/**
 * GET /restaurants
 */
router.get(
  "/",
  validateQuery(RestaurantsQueryDTO),
  cacheMiddleware,
  (req, res, next) => {
    try {
      const query = req.query as any; // Zod ya lo validó
      const result = restaurantService.listRestaurants(query);
      return res.json(result);
    } catch (err) {
      next(err);
    }
  }
);

/**
 * GET /restaurants/:id
 */
router.get(
  "/:id",
  validateParams(ReviewIdParamDTO),
  cacheMiddleware,
  (req, res, next) => {
    try {
      const id = Number(req.params.id);
      const restaurant = restaurantService.getRestaurantById(id);
      return res.json(restaurant);
    } catch (err) {
      next(err);
    }
  }
);

/**
 * GET /restaurants/:id/reviews
 */
router.get(
  "/:id/reviews",
  validateParams(ReviewIdParamDTO),
  cacheMiddleware,
  (req, res, next) => {
    try {
      const id = Number(req.params.id);
      const reviews = restaurantService.listReviewsForRestaurant(id);
      return res.json(reviews);
    } catch (err) {
      next(err);
    }
  }
);

/**
 * POST /restaurants/:id/reviews
 */
router.post(
  "/:id/reviews",
  authMiddleware,
  validateParams(ReviewIdParamDTO),
  validateBody(CreateReviewDTO),
  (req: AuthRequest, res, next) => {
    try {
      const restaurant_id = Number(req.params.id);
      const { rating, comment } = req.body;

      const result = restaurantService.createReviewForRestaurant({
        user_id: req.user!.id,
        restaurantId,
        rating,
        comment,
      });

      invalidateCache();
      return res.status(201).json({ id: result.id });
    } catch (err) {
      next(err);
    }
  }
);

export default router;