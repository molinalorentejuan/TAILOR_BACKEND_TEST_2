import { z } from "zod";

export const CreateReviewDTO = z.object({
  rating: z.number().int().min(1).max(5),
  comment: z.string().optional(),
});

export const UpdateReviewDTO = z.object({
  rating: z.number().int().min(1).max(5),
  comment: z.string().optional(),
});

/**
 * PARAMS :id
 */
export const ReviewParamsDTO = z.object({
  id: z.coerce.number().int().positive(),
});

/**
 * TYPES
 */
export type CreateReviewInput = z.infer<typeof CreateReviewDTO>;
export type UpdateReviewInput = z.infer<typeof UpdateReviewDTO>;
export type ReviewParamsInput = z.infer<typeof ReviewParamsDTO>;