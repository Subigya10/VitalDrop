import { z } from "zod";

const today = new Date();
today.setHours(0, 0, 0, 0);

export const DonateSchema = z.object({
  
  donorName: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name is too long"),

  bloodGroup: z.enum(
    ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
    { errorMap: () => ({ message: "Select a valid blood group" }) }
  ),

  phone: z
    .string()
    .regex(
      /^(\+977)?[0-9]{7,10}$/,
      "Enter a valid Nepal phone number"
    ),

  hospital: z
    .string()
    .min(2, "Hospital name is required")
    .max(200, "Hospital name is too long"),

  date: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "Enter a valid date",
    })
    .refine((val) => new Date(val) >= today, {
      message: "Date can't be in the past",
    }),

  message: z
    .string()
    .max(500, "Message too long")
    .optional(),

});