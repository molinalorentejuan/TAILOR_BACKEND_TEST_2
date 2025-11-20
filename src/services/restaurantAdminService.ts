// src/services/restaurantAdminService.ts
import { injectable, inject } from "tsyringe";
import { RestaurantAdminRepository } from "../repositories/restaurantAdminRepository";
import { OperatingHoursRepository } from "../repositories/operatingHoursRepository";
import { AppError } from "../errors/appError";
import {
  CreateRestaurantInput,
  UpdateRestaurantInput,
} from "../dto/restaurantDTO";

@injectable()
export class RestaurantAdminService {
  constructor(
    @inject(RestaurantAdminRepository)
    private repo: RestaurantAdminRepository,
    @inject(OperatingHoursRepository)
    private hoursRepo: OperatingHoursRepository
  ) {}

  createRestaurant(data: CreateRestaurantInput) {
    const {
      name,
      cuisine,
      rating = 0,
      neighborhood,
      address,
      photograph,
      lat,
      lng,
      image,
      hours,
    } = data;

    const id = this.repo.insertRestaurant(
      name,
      neighborhood ?? null,
      cuisine ?? null,
      rating,
      address ?? null,
      photograph ?? null,
      lat ?? null,
      lng ?? null,
      image ?? null
    );

    if (hours) {
      for (const h of hours) {
        this.hoursRepo.insertHours(id, h.day, h.hours);
      }
    }

    return { id };
  }

  updateRestaurant(id: number, data: UpdateRestaurantInput) {
    if (!this.repo.restaurantExists(id)) {
      throw new AppError("Restaurant not found", 404, "RESTAURANT_NOT_FOUND");
    }

    const {
      name,
      cuisine,
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
      cuisine ?? null,
      rating ?? null,
      address ?? null,
      photograph ?? null,
      lat ?? null,
      lng ?? null,
      image ?? null
    );

    this.hoursRepo.deleteForRestaurant(id);

    if (hours) {
      for (const h of hours) {
        this.hoursRepo.insertHours(id, h.day, h.hours);
      }
    }

    return { id };
  }

  deleteRestaurant(id: number) {
    if (!this.repo.restaurantExists(id)) {
      throw new AppError("Restaurant not found", 404, "RESTAURANT_NOT_FOUND");
    }

    this.hoursRepo.deleteForRestaurant(id);
    this.repo.deleteRestaurant(id);

    return { id };
  }
}