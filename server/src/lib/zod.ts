import { z } from "zod";

export const signUpSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(8, { message: "Min 8 characters" })
    .regex(/[a-z]/, { message: "At least one lowercase letter" })
    .regex(/[A-Z]/, { message: "At least one uppercase letter" })
    .regex(/\d/, { message: "At least one number" })
    .regex(/[\W_]/, { message: "At least one special character" }),
  userName: z.string().optional(),
  companyName: z.string().optional(),
});
