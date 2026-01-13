import { z } from "zod";

export const RegisterSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
lastName: z.string().optional(),

  email: z.string().email("Invalid email"),
  phone: z.string().min(10, "Phone number is required"),
  password: z
    .string()
    .min(6, "Minimum 6 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#@$!%*?&]).{6,}$/,
      "Password must have at least 1 uppercase, 1 lowercase, 1 number, and 1 special character"
    ),
  confirmPassword: z.string(),
  terms: z.boolean().refine((val) => val === true, {
    message: "You must agree to terms",
  }),
}).refine((data) => data.password === data.confirmPassword, {
  path: ["confirmPassword"],
  message: "Passwords do not match",
});
