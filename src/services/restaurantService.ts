// src/services/RestaurantService.ts
import { injectable, inject } from "tsyringe";
import { RestaurantRepository } from "../repositories/restaurantRepository";
import { ReviewRepository } from "../repositories/reviewRepository";
import { AppError } from "../errors/appError";

import { RestaurantsQueryInput } from "../dto/restaurantDTO";
import { UpdateReviewInput, CreateReviewInput } from "../dto/reviewDTO";

@injectable()
export class RestaurantService {
  constructor(
    @inject(RestaurantRepository)
    private restaurantRepo: RestaurantRepository,

    @inject(ReviewRepository)
    private reviewRepo: ReviewRepository
  ) {}

  /**
   * Listar restaurantes con filtros validados (DTO)
   */
  listRestaurants(query: RestaurantsQueryInput) {
    const { page, limit, cuisine_type, rating, neighborhood, sort } = query;

    const where: string[] = [];
    const params: any[] = [];

    // columna REAL en la DB
    if (cuisine_type) {
      where.push("cuisine_type = ?");
      params.push(cuisine_type);
    }

    // rating lo añades tú con ALTER TABLE
    if (rating !== undefined) {
      where.push("rating >= ?");
      params.push(rating);
    }

    if (neighborhood) {
      where.push("neighborhood = ?");
      params.push(neighborhood);
    }

    const whereSql = where.length ? `WHERE ${where.join(" AND ")}` : "";

    // sorting seguro
    let orderSql = "";
    if (sort) {
      const [field, dir] = sort.split(":");
      const safe = ["name", "rating", "cuisine_type", "neighborhood"].includes(
        field
      )
        ? field
        : "name";

      orderSql = `ORDER BY ${safe} ${dir === "desc" ? "DESC" : "ASC"}`;
    }

    const offset = (page - 1) * limit;

    return this.restaurantRepo.listRestaurants(
      whereSql,
      params,
      orderSql,
      limit,
      offset
    );
  }

  /**
   * Obtener un restaurante por ID
   */
  getRestaurantById(id: number) {
    const restaurant = this.restaurantRepo.findRestaurantById(id);
    if (!restaurant) {
      throw new AppError("Restaurant not found", 404, "RESTAURANT_NOT_FOUND");
    }
    return restaurant;
  }

  /**
   * Listar reviews
   */
  listReviewsForRestaurant(id: number) {
    return this.reviewRepo.listReviewsForRestaurant(id);
  }

  /**
   * Crear review (DTO ya validado)
   */
  createReviewForRestaurant(input: CreateReviewInput) {
    const { userId, restaurantId, rating, comment } = input;

    const exists = this.restaurantRepo.findRestaurantById(restaurantId);
    if (!exists) {
      throw new AppError("Restaurant not found", 404, "RESTAURANT_NOT_FOUND");
    }

    // columnas reales: user_id, restaurant_id, rating, comments
    const info = this.reviewRepo.insertReview(
      userId,
      restaurantId,
      rating,
      comment
    );

    return {
      id: info.lastInsertRowid,
      restaurantId,
      rating,
      comment,
    };
  }

  /**
   * Actualizar review
   */
  updateReviewForRestaurant(reviewId: number, data: UpdateReviewInput) {
    const existing = this.reviewRepo.findReviewById(reviewId);
    if (!existing) {
      throw new AppError("Review not found", 404, "REVIEW_NOT_FOUND");
    }

    this.reviewRepo.updateReview(reviewId, data.rating, data.comment ?? null);
    return { reviewId };
  }
}