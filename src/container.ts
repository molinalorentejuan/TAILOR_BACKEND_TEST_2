import { container } from "tsyringe";

/**
 * REPOSITORIES (DI COMPLETE)
 */
import { AdminRepository } from "./repositories/AdminRepository";
import { AuthRepository } from "./repositories/AuthRepository";
import { FavoriteRepository } from "./repositories/FavoriteRepository";
import { RestaurantAdminRepository } from "./repositories/RestaurantAdminRepository";
import { RestaurantRepository } from "./repositories/RestaurantRepository";
import { ReviewRepository } from "./repositories/ReviewRepository";
import { UserRepository } from "./repositories/UserRepository";
import { OperatingHoursRepository } from "./repositories/OperatingHoursRepository";

/**
 * SERVICES
 */
import { AuthService } from "./services/AuthService";
import { AdminService } from "./services/AdminService";
import { RestaurantAdminService } from "./services/RestaurantAdminService";
import { RestaurantService } from "./services/RestaurantService";
import { UserService } from "./services/UserService";

/**
 * REGISTER REPOSITORIES
 */
container.registerSingleton(AdminRepository, AdminRepository);
container.registerSingleton(AuthRepository, AuthRepository);
container.registerSingleton(FavoriteRepository, FavoriteRepository);
container.registerSingleton(RestaurantAdminRepository, RestaurantAdminRepository);
container.registerSingleton(RestaurantRepository, RestaurantRepository);
container.registerSingleton(ReviewRepository, ReviewRepository);
container.registerSingleton(UserRepository, UserRepository);
container.registerSingleton(OperatingHoursRepository, OperatingHoursRepository);

/**
 * REGISTER SERVICES
 */
container.registerSingleton(AuthService, AuthService);
container.registerSingleton(AdminService, AdminService);
container.registerSingleton(RestaurantAdminService, RestaurantAdminService);
container.registerSingleton(RestaurantService, RestaurantService);
container.registerSingleton(UserService, UserService);

export { container };