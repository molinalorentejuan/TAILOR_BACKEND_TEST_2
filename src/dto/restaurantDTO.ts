import { z } from "zod";

/**
 * QUERY DE LISTADO DE RESTAURANTES
 */
export const RestaurantsQueryDTO = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),

  cuisine_type: z.string().optional(),
  neighborhood: z.string().optional(),
  rating: z.coerce.number().min(0).max(5).optional(),

  sort: z
    .string()
    .regex(/^[a-z_]+:(asc|desc)$/i)
    .optional(),
});

export const CreateRestaurantDTO = z.object({
  name: z.string(),
  neighborhood: z.string().optional(),
  cuisine_type: z.string().optional(),
  rating: z.number().min(0).max(5).optional(),
  address: z.string().optional(),
  photograph: z.string().optional(),
  lat: z.number().optional(),
  lng: z.number().optional(),
  image: z.string().optional(),

  hours: z.array(
    z.object({
      day: z.string(),
      hours: z.string()
    })
  ).optional()
});

/**
 * UPDATE = opcional todo
 */
export const UpdateRestaurantDTO = CreateRestaurantDTO.partial();

/**
 * TYPES
 */
export type RestaurantsQueryInput = z.infer<typeof RestaurantsQueryDTO>;
export type CreateRestaurantInput = z.infer<typeof CreateRestaurantDTO>;
export type UpdateRestaurantInput = z.infer<typeof UpdateRestaurantDTO>;