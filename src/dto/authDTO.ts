import { z } from "zod";

export const RegisterDTO = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(1),
});

export const LoginDTO = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

/**
 * TYPES
 */
export type RegisterParamsInput = z.infer<typeof RegisterDTO>;
export type LoginParamsInput = z.infer<typeof LoginDTO>;