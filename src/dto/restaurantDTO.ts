import { z } from "zod";

/* ---------------------------------------
   QUERY DE LISTADO / RESTAURANTES
---------------------------------------- */
export const RestaurantsQueryDTO = z.object({
  page: z
    .coerce.number()
    .int()
    .min(1, { message: "INVALID_PAGE" })
    .default(1),

  limit: z
    .coerce.number()
    .int()
    .min(1, { message: "INVALID_LIMIT" })
    .max(100, { message: "INVALID_LIMIT" })
    .default(10),

  cuisine_type: z.string().trim().optional().nullable(),

  neighborhood: z.string().trim().optional().nullable(),

  rating: z.coerce
    .number()
    .min(0, { message: "RATING_MIN" })
    .max(5, { message: "RATING_MAX" })
    .optional(),

  sort: z
    .string()
    .regex(/^[a-z_]+:(asc|desc)$/i, { message: "INVALID_SORT" })
    .optional(),
});

/* ---------------------------------------
   CREATE RESTAURANT
---------------------------------------- */
export const CreateRestaurantDTO = z.object({
  name: z.string({ message: "NAME_REQUIRED" }).min(1, { message: "NAME_REQUIRED" }).trim(),

  neighborhood: z.string().trim().optional().nullable(),
  cuisine_type: z.string().trim().optional().nullable(),

  rating: z
    .number({ message: "INVALID_RATING" })
    .min(0, { message: "RATING_MIN" })
    .max(5, { message: "RATING_MAX" })
    .optional(),

  address: z.string().trim().optional().nullable(),
  photograph: z.string().trim().optional().nullable(),
  image: z.string().trim().optional().nullable(),

  lat: z.number({ message: "INVALID_LAT" }).optional(),
  lng: z.number({ message: "INVALID_LNG" }).optional(),

  hours: z
    .array(
      z.object({
        day: z.string({ message: "INVALID_DAY" }).trim(),
        hours: z.string({ message: "INVALID_HOURS" }).trim(),
      })
    )
    .optional(),
});

/* ---------------------------------------
   UPDATE RESTAURANT
---------------------------------------- */
export const UpdateRestaurantDTO = CreateRestaurantDTO.partial();

/* ---------------------------------------
   PARAMS :restaurant_id
---------------------------------------- */
export const RestaurantParamsDTO = z.object({
  restaurant_id: z
    .coerce.number()
    .int()
    .positive({ message: "INVALID_RESTAURANT_ID" }),
});

/* ---------------------------------------
   TYPES
---------------------------------------- */
export type RestaurantsQueryInput = z.infer<typeof RestaurantsQueryDTO>;
export type CreateRestaurantInput = z.infer<typeof CreateRestaurantDTO>;
export type UpdateRestaurantInput = z.infer<typeof UpdateRestaurantDTO>;
export type RestaurantParamsInput = z.infer<typeof RestaurantParamsDTO>;