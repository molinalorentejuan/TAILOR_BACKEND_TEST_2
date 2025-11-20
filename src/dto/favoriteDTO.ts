import { z } from "zod";

export const FavoriteParamsDTO = z.object({
  restaurantId: z.coerce.number().int().positive(),
});

export type FavoriteParamsInput = z.infer<typeof FavoriteParamsDTO>;