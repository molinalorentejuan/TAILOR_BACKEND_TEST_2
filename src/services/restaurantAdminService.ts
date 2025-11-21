import { injectable, inject } from "tsyringe";
import { RestaurantAdminRepository } from "../repositories/restaurantAdminRepository";
import { OperatingHoursRepository } from "../repositories/operatingHoursRepository";
import { ReviewRepository } from "../repositories/reviewRepository";
import { FavoriteRepository } from "../repositories/favoriteRepository";
import db from "../db/db";
import { AppError } from "../errors/appError";
import {
  CreateRestaurantParamsInput,
  UpdateRestaurantParamsInput,
} from "../dto/restaurantDTO";

@injectable()
export class RestaurantAdminService {
  constructor(
    @inject(RestaurantAdminRepository)
    private repo: RestaurantAdminRepository,
    @inject(OperatingHoursRepository)
    private hoursRepo: OperatingHoursRepository,
    @inject(ReviewRepository)
    private reviewRepo: ReviewRepository,
    @inject(FavoriteRepository)
    private favoriteRepo: FavoriteRepository,
  ) {}

  createRestaurant(data: CreateRestaurantParamsInput) {
    const {
      name,
      cuisine_type,
      rating = 0,
      neighborhood,
      address,
      photograph,
      lat,
      lng,
      image,
      hours,
    } = data;

    const tx = db.transaction(() => {
      const id = this.repo.insertRestaurant(
        name,
        neighborhood ?? null,
        cuisine_type ?? null,
        rating,
        address ?? null,
        photograph ?? null,
        lat ?? null,
        lng ?? null,
        image ?? null
      );

      if (hours && hours.length > 0) {
        for (const h of hours) {
          this.hoursRepo.insertHours(id, h.day, h.hours);
        }
      }

      return id;
    });

    const id = tx();
    return { id };
  }

  updateRestaurant(id: number, data: UpdateRestaurantParamsInput) {
    if (!this.repo.restaurantExists(id)) {
      throw new AppError("Restaurant not found", 404, "RESTAURANT_NOT_FOUND");
    }

    const {
      name,
      cuisine_type,
      rating,
      neighborhood,
      address,
      photograph,
      lat,
      lng,
      image,
      hours,
    } = data;

    this.repo.updateRestaurant(
      id,
      name ?? null,
      neighborhood ?? null,
      cuisine_type ?? null,
      rating ?? null,
      address ?? null,
      photograph ?? null,
      lat ?? null,
      lng ?? null,
      image ?? null
    );

    const tx = db.transaction(() => {
      this.hoursRepo.deleteForRestaurant(id);

      if (hours !== undefined) {
        for (const h of hours) {
          this.hoursRepo.insertHours(id, h.day, h.hours);
        }
      }
    });

    tx();
    return { id };
  }

  deleteRestaurant(id: number) {
    if (!this.repo.restaurantExists(id)) {
      throw new AppError("Restaurant not found", 404, "RESTAURANT_NOT_FOUND");
    }

    const tx = db.transaction(() => {
      this.reviewRepo.deleteForRestaurant(id);
      this.favoriteRepo.deleteForRestaurant(id);
      this.hoursRepo.deleteForRestaurant(id);
      this.repo.deleteRestaurant(id);
    });

    tx();

    return { id };
  }
}