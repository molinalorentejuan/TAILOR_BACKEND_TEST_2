// src/routes/admin.ts
import { Router } from "express";
import { authMiddleware, roleMiddleware } from "../middleware/auth";
import { container } from "../container";
import { AdminService } from "../services/adminService";

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
      return res.json(stats);
    } catch (err) {
      next(err);
    }
  }
);

export default router;