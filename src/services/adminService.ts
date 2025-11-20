import { injectable, inject } from "tsyringe";
import { AdminRepository } from "../repositories/adminRepository";
import { AppError } from "../errors/appError";

@injectable()
export class AdminService {
  constructor(
    @inject(AdminRepository)
    private adminRepo: AdminRepository
  ) {}

  /**
   * Devuelve todas las métricas del panel admin.
   * Lanza AppError si algo inesperado pasa.
   */
  getAdminStats() {
    try {
      const usersCount = this.adminRepo.countUsers();
      const reviewsCount = this.adminRepo.countReviews();
      const restaurantsCount = this.adminRepo.countRestaurants();

      const topRated = this.adminRepo.getTopRated();
      const mostReviewed = this.adminRepo.getMostReviewed();

      return {
        usersCount,
        reviewsCount,
        restaurantsCount,
        topRated,
        mostReviewed,
      };
    } catch (err) {
      throw new AppError("Failed to load admin stats", 500, "ADMIN_STATS_ERROR");
    }
  }
}