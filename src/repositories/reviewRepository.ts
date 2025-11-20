import { injectable } from "tsyringe";
import db from "../db/db";

export interface ReviewRow {
  id: number;
  user_id: number;
  restaurant_id: number;
  rating: number;
  comments: string | null;
  date: string | null;
  created_at: string;
}

export interface UserReviewRow extends ReviewRow {
  restaurantName: string;
}

export interface RestaurantReviewRow extends ReviewRow {
  userEmail: string;
}

@injectable()
export class ReviewRepository {
  /**
   * Todas las reviews de un usuario
   */
  listReviewsByUser(userId: number): UserReviewRow[] {
    return db
      .prepare(
        `
        SELECT rv.*, r.name AS restaurantName
        FROM reviews rv
        JOIN restaurants r ON r.id = rv.restaurant_id
        WHERE rv.user_id = ?
        ORDER BY rv.created_at DESC
      `
      )
      .all(userId) as UserReviewRow[];
  }

  /**
   * Review concreta de un usuario
   */
  findUserReview(
    reviewId: number,
    userId: number
  ): ReviewRow | undefined {
    return db
      .prepare(`
        SELECT *
        FROM reviews
        WHERE id=? AND user_id=?
      `)
      .get(reviewId, userId) as ReviewRow | undefined;
  }

  /**
   * Update review
   */
  updateReview(reviewId: number, rating: number, comments?: string) {
    return db
      .prepare(`
        UPDATE reviews
        SET rating = ?, comments = ?
        WHERE id = ?
      `)
      .run(rating, comments || null, reviewId);
  }

  /**
   * Delete review
   */
  deleteReview(reviewId: number) {
    return db
      .prepare(`DELETE FROM reviews WHERE id=?`)
      .run(reviewId);
  }

  /**
   * Reviews por restaurante
   */
  listReviewsForRestaurant(
    restaurantId: number
  ): RestaurantReviewRow[] {
    return db
      .prepare(
        `
        SELECT rv.*, u.email AS userEmail
        FROM reviews rv
        JOIN users u ON u.id = rv.user_id
        WHERE rv.restaurant_id = ?
        ORDER BY rv.created_at DESC
      `
      )
      .all(restaurantId) as RestaurantReviewRow[];
  }

  /**
   * Insertar review nueva
   */
  insertReview(
    userId: number,
    restaurantId: number,
    rating: number,
    comments?: string
  ) {
    return db
      .prepare(
        `
        INSERT INTO reviews (user_id, restaurant_id, rating, comments)
        VALUES (?, ?, ?, ?)
      `
      )
      .run(userId, restaurantId, rating, comments || null);
  }
}