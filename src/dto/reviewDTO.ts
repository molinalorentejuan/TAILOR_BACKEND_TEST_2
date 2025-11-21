import { z } from "zod";

/**
 * CREATE REVIEW – body correcto
 */
export const CreateReviewDTO = z.object({
  rating: z.number().int().min(1).max(5),
  comment: z.string().optional(),
});

/**
 * UPDATE REVIEW
 */
export const UpdateReviewDTO = z.object({
  rating: z.number().int().min(1).max(5),
  comment: z.string().optional(),
});

/**
 * PARAMS :id
 */
export const ReviewIdParamDTO = z.object({
  id: z.coerce.number().int().positive(),
});

/**
 * TYPES
 */
export type CreateReviewInput = z.infer<typeof CreateReviewDTO>;
export type UpdateReviewInput = z.infer<typeof UpdateReviewDTO>;
export type ReviewIdParamInput = z.infer<typeof ReviewIdParamDTO>;s