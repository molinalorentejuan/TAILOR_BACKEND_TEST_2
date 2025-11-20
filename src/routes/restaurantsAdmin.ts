// src/routes/admin.restaurants.ts
import { Router } from "express";
import { authMiddleware, roleMiddleware, AuthRequest } from "../middleware/auth";
import { validateBody, validateParams } from "../middleware/validate";
import { invalidateCache } from "../middleware/cache";
import {
  CreateRestaurantDTO,
  UpdateRestaurantDTO,
} from "../dto/restaurantDTO";
import { container } from "../container";
import { RestaurantAdminService } from "../services/restaurantAdminService";

const router = Router();
const adminService = container.resolve(RestaurantAdminService);

const IdParamDTO = UpdateRestaurantDTO.extend({
  id: undefined
}); // placeholder, pero usamos otro DTO abajo

const IdDTO = {
  id: (z) => z.coerce.number().int().positive(),
};

/**
 * POST /admin/restaurants
 */
router.post(
  "/",
  authMiddleware,
  roleMiddleware(["ADMIN"]),
  validateBody(CreateRestaurantDTO),
  (req: AuthRequest, res, next) => {
    try {
      const id = adminService.createRestaurant(req.body);
      invalidateCache();
      res.status(201).json(id);
    } catch (err) {
      next(err);
    }
  }
);

/**
 * PUT /admin/restaurants/:id
 */
router.put(
  "/:id",
  authMiddleware,
  roleMiddleware(["ADMIN"]),
  validateParams(
    // id: number
    require("zod").object({
      id: require("zod").coerce.number().int().positive(),
    })
  ),
  validateBody(UpdateRestaurantDTO),
  (req: AuthRequest, res, next) => {
    try {
      adminService.updateRestaurant(req.params.id, req.body);
      invalidateCache();
      res.json({ message: "Restaurant updated" });
    } catch (err) {
      next(err);
    }
  }
);

/**
 * DELETE /admin/restaurants/:id
 */
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware(["ADMIN"]),
  validateParams(
    require("zod").object({
      id: require("zod").coerce.number().int().positive(),
    })
  ),
  (req: AuthRequest, res, next) => {
    try {
      adminService.deleteRestaurant(req.params.id);
      invalidateCache();
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  }
);

export default router;