import { z } from "zod";

export const UpdateReviewDTO = z.object({
  rating: z.number().int().min(1).max(5),
  comment: z.string().optional(),
});
export const CreateReviewDTO = z.object(
  restaurant_id: z.coerce.number().int().positive(),
  user_id: z.coerce.number().int().positive(),
  rating: z.number().int().min(1).max(5),
  comment: z.string().optional(),
});

// PARAMS DTO para /me/reviews/:id
export const ReviewIdParamDTO = z.object({
  id: z.coerce.number().int().positive(),
});

// TYPES opcionales
export type UpdateReviewInput = z.infer<typeof UpdateReviewDTO>;
export type CreateReviewInput = z.infer<typeof CreateReviewDTO>;
export type ReviewIdParamInput = z.infer<typeof ReviewIdParamDTO>;