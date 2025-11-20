import { injectable, inject } from "tsyringe";
import { UserRepository } from "../repositories/userRepository";
import { ReviewRepository } from "../repositories/reviewRepository";
import { FavoriteRepository } from "../repositories/favoriteRepository";
import { RestaurantRepository } from "../repositories/restaurantRepository";
import { AppError } from "../errors/appError";
import {
  UpdateReviewInput,
  ReviewIdParamInput,
} from "../dto/reviewDTO";

@injectable()
export class UserService {
  constructor(
    @inject(UserRepository)
    private userRepo: UserRepository,

    @inject(ReviewRepository)
    private reviewRepo: ReviewRepository,

    @inject(FavoriteRepository)
    private favoriteRepo: FavoriteRepository,

    @inject(RestaurantRepository)
    private restaurantRepo: RestaurantRepository
  ) {}

  getUserById(id: number) {
    const user = this.userRepo.findUserById(id);
    if (!user) throw new AppError("User not found", 404, "USER_NOT_FOUND");
    return user;
  }

  listReviewsByUser(userId: number) {
    return this.reviewRepo.listReviewsByUser(userId);
  }

  updateUserReview(
    params: ReviewIdParamInput,
    data: UpdateReviewInput,
    userId: number
  ) {
    const existing = this.reviewRepo.findUserReview(params.id, userId);
    if (!existing) {
      throw new AppError("Review not found", 404, "REVIEW_NOT_FOUND");
    }

    this.reviewRepo.updateReview(params.id, data.rating, data.comment ?? undefined);
    return { id: params.id };
  }

  deleteUserReview(params: ReviewIdParamInput, userId: number) {
    const existing = this.reviewRepo.findUserReview(params.id, userId);
    if (!existing) {
      throw new AppError("Review not found", 404, "REVIEW_NOT_FOUND");
    }

    this.reviewRepo.deleteReview(params.id);
    return { id: params.id };
  }

  addFavorite(userId: number, restaurantId: number) {
    const restaurant = this.restaurantRepo.findRestaurantById(restaurantId);
    if (!restaurant) {
      throw new AppError("Restaurant not found", 404, "RESTAURANT_NOT_FOUND");
    }

    const result = this.favoriteRepo.insertFavorite(userId, restaurantId);

    if (result === "DUPLICATE") {
      throw new AppError("Already in favorites", 409, "ALREADY_FAVORITE");
    }

    return { restaurantId };
  }

  removeFavorite(userId: number, restaurantId: number) {
    this.favoriteRepo.deleteFavorite(userId, restaurantId);
    return { restaurantId };
  }

  listFavoritesByUser(userId: number) {
    return this.favoriteRepo.listFavoritesByUser(userId);
  }
}