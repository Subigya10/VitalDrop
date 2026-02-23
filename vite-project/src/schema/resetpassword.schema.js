import { z } from "zod";

export const ResetPasswordSchema = z
  .object({
    password: z
      .string()
      .nonempty({ message: "Password cannot be empty" })
      .min(6, { message: "Password must be at least 6 characters" }),

    confirmPassword: z
      .string()
      .nonempty({ message: "Confirm password cannot be empty" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });