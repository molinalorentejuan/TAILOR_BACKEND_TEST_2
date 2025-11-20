// src/routes/admin.restaurants.ts
import { Router } from "express";
import { authMiddleware, roleMiddleware, AuthRequest } from "../middleware/auth";
import { validateBody, validateParams } from "../middleware/validate";
import { invalidateCache } from "../middleware/cache";
import { CreateRestaurantDTO, UpdateRestaurantDTO } from "../dto/restaurantDTO";
import { z } from "zod";

import { container } from "../container";
import { RestaurantAdminService } from "../services/restaurantAdminService";

const router = Router();
const adminService = container.resolve(RestaurantAdminService);

// DTO simple para :id
const IdParamDTO = z.object({
  id: z.coerce.number().int().positive(),
});

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
      const result = adminService.createRestaurant(req.body);
      invalidateCache();
      return res.status(201).json(result);
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
  validateParams(IdParamDTO),
  validateBody(UpdateRestaurantDTO),
  (req: AuthRequest, res, next) => {
    try {
      const id = Number(req.params.id);
      adminService.updateRestaurant(id, req.body);
      invalidateCache();
      return res.json({ message: "Restaurant updated" });
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
  validateParams(IdParamDTO),
  (req: AuthRequest, res, next) => {
    try {
      const id = Number(req.params.id);
      adminService.deleteRestaurant(id);
      invalidateCache();
      return res.status(204).send();
    } catch (err) {
      next(err);
    }
  }
);

export default router;