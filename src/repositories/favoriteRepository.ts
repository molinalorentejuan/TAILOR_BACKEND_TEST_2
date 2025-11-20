import { injectable } from "tsyringe";
import db from "../db/db";

@injectable()
export class FavoriteRepository {
  insertFavorite(
    userId: number,
    restaurantId: number
  ): "OK" | "DUPLICATE" {
    try {
      db.prepare(
        "INSERT INTO favorites (user_id, restaurant_id) VALUES (?, ?)"
      ).run(userId, restaurantId);

      return "OK";
    } catch (err: any) {
      if (String(err).includes("UNIQUE")) return "DUPLICATE";
      throw err;
    }
  }

  deleteFavorite(userId: number, restaurantId: number) {
    return db
      .prepare("DELETE FROM favorites WHERE user_id=? AND restaurant_id=?")
      .run(userId, restaurantId);
  }

  listFavoritesByUser(userId: number) {
    return db
      .prepare(
        `
        SELECT r.*
        FROM favorites f
        JOIN restaurants r ON r.id = f.restaurant_id
        WHERE f.user_id=?
      `
      )
      .all(userId);
  }
}