import { z } from 'zod';

export const DonateSchema = z.object({
  donorName: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name is too long')
    .regex(/^[a-zA-Z\s]+$/, 'Name can only contain letters'),
  bloodGroup: z
    .string()
    .min(1, 'Please select a blood group'),
  phone: z
    .string()
    .min(1, 'Please enter your phone number')
    .regex(/^(977)?9[78]\d{8}$/, 'Phone must start with 977 or 98/97 (Nepal number)'),
  hospital: z
    .string()
    .min(3, 'Please enter a valid hospital name')
    .max(100, 'Hospital name is too long'),
  date: z
    .string()
    .min(1, 'Please select a date'),
  message: z
    .string()
    .max(300, 'Message is too long')
    .optional()
    .or(z.literal('')),
});