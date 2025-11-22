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
  CreateRestaurantDTO,
  RestaurantParamsDTO,
} from "../dto/restaurantDTO";

import {
  RestaurantListDTO,
  RestaurantDetailDTO,
  RestaurantReviewListDTO,
  ReviewIdResponseDTO,
} from "../dto/responseDTO";

import { CreateReviewDTO } from "../dto/reviewDTO";
import { container } from "../container";
import { RestaurantService } from "../services/restaurantService";
import { StatusCodes } from "http-status-codes";

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
      const query = req.query as any; // ya validado por Zod
      const result = restaurantService.listRestaurants(query);
      const response = RestaurantListDTO.parse(result);
      return res.status(StatusCodes.OK).json(response);
    } catch (err) {
      next(err);
    }
  }
);

/**
 * GET /restaurants/:restaurant_id
 */
router.get(
  "/:restaurant_id",
  validateParams(RestaurantParamsDTO),
  cacheMiddleware,
  (req, res, next) => {
    try {
      const restaurantId = Number(req.params.restaurant_id);
      const restaurant = restaurantService.getRestaurantById(restaurantId);
      const response = RestaurantDetailDTO.parse(restaurant);
      return res.status(StatusCodes.OK).json(response);
    } catch (err) {
      next(err);
    }
  }
);

/**
 * GET /restaurants/:restaurant_id/reviews
 */
router.get(
  "/:restaurant_id/reviews",
  validateParams(RestaurantParamsDTO),
  cacheMiddleware,
  (req, res, next) => {
    try {
      const restaurantId = Number(req.params.restaurant_id);
      const reviews = restaurantService.listReviewsForRestaurant(restaurantId);
      const response = RestaurantReviewListDTO.parse(reviews);
      return res.status(StatusCodes.OK).json(response);
    } catch (err) {
      next(err);
    }
  }
);

/**
 * POST /restaurants/:restaurant_id/reviews
 */
router.post(
  "/:restaurant_id/reviews",
  authMiddleware,
  validateParams(RestaurantParamsDTO),
  validateBody(CreateReviewDTO),
  (req: AuthRequest, res, next) => {
    try {
      const restaurantId = Number(req.params.restaurant_id);
      const { rating, comment } = req.body;
      const result = restaurantService.createReviewForRestaurant({
        user_id: req.user!.id,
        restaurant_id: restaurantId,
        rating,
        comment,
      });
      invalidateCache();
      const response = ReviewIdResponseDTO.parse({ id: result.id });
      return res.status(StatusCodes.CREATED).json(response);
    } catch (err) {
      next(err);
    }
  }
);

export default router;