// src/routes/admin.ts
import { Router } from "express";
import { authMiddleware, roleMiddleware } from "../middleware/auth";
import { container } from "../container";
import { AdminService } from "../services/adminService";
import { StatusCodes } from "http-status-codes";
import { AdminStatsDTO } from "../dto/responseDTO";

const router = Router();
const adminService = container.resolve(AdminService);

/**
 * GET /admin/stats
 */
router.get(
  "/stats",
  authMiddleware,
  roleMiddleware(["ADMIN"]),
  (req, res, next) => {
    try {
      const stats = adminService.getAdminStats();
      const response = AdminStatsDTO.parse(stats);
      return res.status(StatusCodes.OK).json(response);
    } catch (err) {
      next(err);
    }
  }
);

export default router;