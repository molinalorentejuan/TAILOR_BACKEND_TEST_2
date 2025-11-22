import { z } from "zod";

/* ---------------------------------------
   CREATE REVIEW
---------------------------------------- */
export const CreateReviewDTO = z.object({
  rating: z.coerce.number()
    .int()
    .min(1, { message: "RATING_MIN" })
    .max(5, { message: "RATING_MAX" }),

  comment: z.string().trim().optional().nullable(),
});

/* ---------------------------------------
   UPDATE REVIEW
---------------------------------------- */
export const UpdateReviewDTO = z.object({
  rating: z.coerce.number()
    .int()
    .min(1, { message: "RATING_MIN" })
    .max(5, { message: "RATING_MAX" }),

  comment: z.string().trim().optional().nullable(),
});

/* ---------------------------------------
   PARAMS (:review_id)
---------------------------------------- */
export const ReviewParamsDTO = z.object({
  review_id: z.coerce.number()
    .int()
    .positive({ message: "INVALID_REVIEW_ID" }),
});

/* ---------------------------------------
   TYPES
---------------------------------------- */
export type CreateReviewInput = z.infer<typeof CreateReviewDTO>;
export type UpdateReviewInput = z.infer<typeof UpdateReviewDTO>;
export type ReviewParamsInput = z.infer<typeof ReviewParamsDTO>;