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
    .min(1, "Phone number is required")
    .regex(/^(97|98)\d{8}$/, "Must start with 97 or 98 and be exactly 10 digits"),
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
    .refine((val) => new Date(val) < today, { message: "Date of birth must be in the past" })
    .refine((val) => {
      const dob = new Date(val);
      const age = today.getFullYear() - dob.getFullYear();
      const m = today.getMonth() - dob.getMonth();
      const exactAge = m < 0 || (m === 0 && today.getDate() < dob.getDate()) ? age - 1 : age;
      return exactAge >= 18;
    }, { message: "You must be at least 18 years old" }),
  address: z.string().min(2, "Address is required").max(200, "Address too long"),

  // ── MEDICAL INFO ──
  medicalNotes: z.string().optional(),

  // ── PROFILE PHOTO ──
  profilePhoto: z.any().optional(),

}).refine((data) => data.password === data.confirmPassword, {
  path: ["confirmPassword"],
  message: "Passwords do not match",
});