import { z } from "zod";

const today = new Date();
today.setHours(0, 0, 0, 0);

export const RegisterSchema = z.object({

  // ── ACCOUNT INFO ──
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().optional(),
  email: z.string().email("Enter a valid email address"),
  phone: z
    .string()
    .regex(/^(\+977)?[0-9]{7,10}$/, "Enter a valid Nepal phone number"),
  password: z
    .string()
    .min(6, "Minimum 6 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#@$!%*?&]).{6,}$/,
      "Must have uppercase, lowercase, number & special character"
    ),
  confirmPassword: z.string(),
  terms: z.boolean().refine((val) => val === true, {
    message: "You must agree to terms",
  }),

  // ── PERSONAL INFO ──
 // ✅ Replace with
gender: z.string().nullable().refine(val => ["Male", "Female", "Other"].includes(val ?? ""), {
  message: "Please select your gender",
}),

bloodGroup: z.string().refine(val => ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].includes(val), {
  message: "Please select your blood group",
}),
  dateOfBirth: z
    .string()
    .min(1, "Date of birth is required")
    .refine((val) => !isNaN(Date.parse(val)), { message: "Enter a valid date" })
    .refine((val) => new Date(val) < today, { message: "Date of birth must be in the past" }),
  address: z.string().min(2, "Address is required").max(200, "Address too long"),

  // ── MEDICAL INFO ──
 
 medicalNotes: z.string().optional(),

  // ── PROFILE PHOTO ── optional, just store filename/url
  profilePhoto: z.any().optional(),

}).refine((data) => data.password === data.confirmPassword, {
  path: ["confirmPassword"],
  message: "Passwords do not match",
});