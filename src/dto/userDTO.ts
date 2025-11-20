import { z } from "zod";

export const UserDTO = z.object({
  id: z.number(),
  email: z.string().email(),
  role: z.enum(["USER", "ADMIN"]),
});