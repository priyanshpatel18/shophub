import { z } from "zod"

export const signUpSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/, {
      message: "Invalid Password",
    }),
  userName: z.string().optional(),
})
