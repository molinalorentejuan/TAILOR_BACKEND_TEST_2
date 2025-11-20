import { injectable } from "tsyringe";
import db from "../db/db";

@injectable()
export class RestaurantAdminRepository {
  insertRestaurant(
    name: string,
    neighborhood: string | null,
    cuisine_type: string | null,
    rating: number,
    address: string | null,
    photograph: string | null,
    lat: number | null,
    lng: number | null,
    image: string | null
  ): number {
    const info = db
      .prepare(
        `
        INSERT INTO restaurants
          (name, neighborhood, cuisine_type, rating, address, photograph, lat, lng, image)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `
      )
      .run(
        name,
        neighborhood,
        cuisine_type,
        rating,
        address,
        photograph,
        lat,
        lng,
        image
      );

    return Number(info.lastInsertRowid);
  }

  restaurantExists(id: number): boolean {
    return !!db.prepare("SELECT id FROM restaurants WHERE id=?").get(id);
  }

  updateRestaurant(
    id: number,
    name: string | null,
    neighborhood: string | null,
    cuisine_type: string | null,
    rating: number | null,
    address: string | null,
    photograph: string | null,
    lat: number | null,
    lng: number | null,
    image: string | null
  ) {
    db.prepare(
      `
      UPDATE restaurants SET
        name = COALESCE(?, name),
        neighborhood = COALESCE(?, neighborhood),
        cuisine_type = COALESCE(?, cuisine_type),
        rating = COALESCE(?, rating),
        address = COALESCE(?, address),
        photograph = COALESCE(?, photograph),
        lat = COALESCE(?, lat),
        lng = COALESCE(?, lng),
        image = COALESCE(?, image)
      WHERE id=?
    `
    ).run(
      name,
      neighborhood,
      cuisine_type,
      rating,
      address,
      photograph,
      lat,
      lng,
      image,
      id
    );
  }

  deleteRestaurant(id: number) {
    db.prepare("DELETE FROM restaurants WHERE id=?").run(id);
  }
}