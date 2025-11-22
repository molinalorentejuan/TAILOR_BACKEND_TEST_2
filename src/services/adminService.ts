import { injectable, inject } from "tsyringe";
import { AdminRepository } from "../repositories/adminRepository";
import { AppError } from "../errors/appError";
import { AdminStatsDTO } from "../dto/responseDTO";

@injectable()
export class AdminService {
  constructor(
    @inject(AdminRepository)
    private adminRepo: AdminRepository
  ) {}

  getAdminStats() {
    try {
      const usersCount = this.adminRepo.countUsers();
      const reviewsCount = this.adminRepo.countReviews();
      const restaurantsCount = this.adminRepo.countRestaurants();

      const topRated = this.adminRepo.getTopRated();
      const mostReviewed = this.adminRepo.getMostReviewed();

      return AdminStatsDTO.parse({
        usersCount,
        reviewsCount,
        restaurantsCount,
        topRated,
        mostReviewed,
      });
    } catch (err) {
      throw new AppError("Failed to load admin stats", 500, "ADMIN_STATS_ERROR");
    }
  }
}