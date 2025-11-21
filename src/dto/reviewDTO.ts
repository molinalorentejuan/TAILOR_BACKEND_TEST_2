import { z } from "zod";

/**
 * CREATE REVIEW
 * Cuando un usuario crea una review (POST /restaurants/:id/reviews)
 */
export const CreateReviewDTO = z.object({
  restaurant_id: z.coerce.number().int().positive(),
  user_id: z.coerce.number().int().positive(),
  rating: z.number().int().min(1).max(5),
  comment: z.string().optional(),
});

/** 
 * UPDATE REVIEW
 * Cuando editas tu propia review (PUT /me/reviews/:id)
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
export type ReviewIdParamInput = z.infer<typeof ReviewIdParamDTO>;