import { z } from "zod";

export const FavoriteParamsDTO = z.object({
  restaurant_id: z
    .string()
    .regex(/^\d+$/, { message: "INVALID_RESTAURANT_ID" })
    .transform((val) => Number(val)),
});

/* TYPES */
export type FavoriteParamsInput = z.infer<typeof FavoriteParamsDTO>;