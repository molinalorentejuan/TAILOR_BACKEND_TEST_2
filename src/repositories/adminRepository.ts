import { injectable } from "tsyringe";
import db from "../db/db";

@injectable()
export class AdminRepository {
  countUsers(): number {
    return db.prepare("SELECT COUNT(*) as c FROM users").get().c;
  }

  countReviews(): number {
    return db.prepare("SELECT COUNT(*) as c FROM reviews").get().c;
  }

  countRestaurants(): number {
    return db.prepare("SELECT COUNT(*) as c FROM restaurants").get().c;
  }

  /**
   * TOP 3 mejor valorados
   * Calculo del rating medio desde reviews
   */
  getTopRated() {
    return db
      .prepare(
        `
        SELECT
          r.id,
          r.name,
          r.cuisine_type AS cuisine,
          r.neighborhood,
          AVG(rv.rating) AS avgRating
        FROM restaurants r
        LEFT JOIN reviews rv ON rv.restaurant_id = r.id
        GROUP BY r.id
        ORDER BY avgRating DESC NULLS LAST
        LIMIT 3
      `
      )
      .all();
  }

  /**
   * TOP 3 más reseñados
   */
  getMostReviewed() {
    return db
      .prepare(
        `
        SELECT
          r.id,
          r.name,
          r.cuisine_type AS cuisine,
          COUNT(rv.id) AS reviews
        FROM restaurants r
        LEFT JOIN reviews rv ON rv.restaurant_id = r.id
        GROUP BY r.id
        ORDER BY reviews DESC
        LIMIT 3
      `
      )
      .all();
  }

  /** ESTADÍSTICAS GLOBALES */
  getStats() {
    return {
      users: this.countUsers(),
      restaurants: this.countRestaurants(),
      reviews: this.countReviews(),
      topRated: this.getTopRated(),
      mostReviewed: this.getMostReviewed(),
    };
  }
}