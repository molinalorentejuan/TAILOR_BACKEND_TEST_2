import { injectable, inject } from "tsyringe";
import { RestaurantRepository } from "../repositories/restaurantRepository";
import { ReviewRepository } from "../repositories/reviewRepository";
import { AppError } from "../errors/appError";

import { RestaurantsQueryInput } from "../dto/restaurantDTO";
import { CreateReviewServiceInput } from "../types/types";

@injectable()
export class RestaurantService {
  constructor(
    @inject(RestaurantRepository)
    private restaurantRepo: RestaurantRepository,

    @inject(ReviewRepository)
    private reviewRepo: ReviewRepository
  ) {}

  listRestaurants(query: RestaurantsQueryInput) {
    const { page, limit, cuisine_type, rating, neighborhood, sort } = query;

    const where: string[] = [];
    const params: any[] = [];

    if (cuisine_type) {
      where.push("cuisine_type = ?");
      params.push(cuisine_type);
    }

    if (rating !== undefined) {
      where.push("rating >= ?");
      params.push(rating);
    }

    if (neighborhood) {
      where.push("neighborhood = ?");
      params.push(neighborhood);
    }

    const whereSql = where.length ? `WHERE ${where.join(" AND ")}` : "";

    let orderSql = "";
    if (sort) {
      const [field, dir] = sort.split(":");

      const safeField = ["name", "rating", "cuisine_type", "neighborhood"].includes(field)
        ? field
        : "name";

      orderSql = `ORDER BY ${safeField} ${dir === "desc" ? "DESC" : "ASC"}`;
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

  getRestaurantById(id: number) {
    const restaurant = this.restaurantRepo.findRestaurantById(id);

    if (!restaurant) {
      throw new AppError("Restaurant not found", 404, "RESTAURANT_NOT_FOUND");
    }

    return restaurant;
  }

  listReviewsForRestaurant(id: number) {
    return this.reviewRepo.listReviewsForRestaurant(id);
  }

  createReviewForRestaurant(input: CreateReviewServiceInput) {
    const { user_id, restaurant_id, rating, comment } = input;

    const exists = this.restaurantRepo.findRestaurantById(restaurant_id);
    if (!exists) {
      throw new AppError("Restaurant not found", 404, "RESTAURANT_NOT_FOUND");
    }

    const info = this.reviewRepo.insertReview(
      user_id,
      restaurant_id,
      rating,
      comment
    );

    return {
      id: info.lastInsertRowid,
      user_id,
      restaurant_id,
      rating,
      comment,
    };
  }
}