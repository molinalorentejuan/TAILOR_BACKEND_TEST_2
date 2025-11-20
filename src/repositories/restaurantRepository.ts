import { injectable } from "tsyringe";
import db from "../db/db";

export interface RestaurantRow {
  id: number;
  name: string;
  neighborhood: string | null;
  photograph: string | null;
  address: string | null;
  lat: number | null;
  lng: number | null;
  image: string | null;
  cuisine_type: string | null;
  rating: number;
}

@injectable()
export class RestaurantRepository {
  listRestaurants(
    whereSql: string,
    params: any[],
    orderSql: string,
    limit: number,
    offset: number
  ): {
    data: RestaurantRow[];
    pagination: {
      total: number;
      limit: number;
      page: number;
    };
  } {
    const total = db
      .prepare(`SELECT COUNT(*) as c FROM restaurants ${whereSql}`)
      .get(...params).c;

    const rows = db
      .prepare(
        `
        SELECT id, name, neighborhood, photograph, address, lat, lng,
               image, cuisine_type, rating
        FROM restaurants
        ${whereSql}
        ${orderSql}
        LIMIT ? OFFSET ?
      `
      )
      .all(...params, limit, offset) as RestaurantRow[];

    return {
      data: rows,
      pagination: {
        total,
        limit,
        page: offset / limit + 1,
      },
    };
  }

findRestaurantById(id: number): any {
  const restaurant = db
    .prepare(`SELECT * FROM restaurants WHERE id=?`)
    .get(id);

  if (!restaurant) return undefined;

  const operatingHours = db
    .prepare(`
      SELECT day, hours
      FROM operating_hours
      WHERE restaurant_id = ?
      ORDER BY id ASC
    `)
    .all(id);

  return {
    ...restaurant,
    operatingHours,
  };
}
}