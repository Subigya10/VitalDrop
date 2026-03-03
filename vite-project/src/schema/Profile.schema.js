import { z } from 'zod';

export const ProfileSchema = z.object({
  fullName: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name is too long')
    .regex(/^[a-zA-Z\s]+$/, 'Name can only contain letters'),
  email: z
    .string()
    .email('Invalid email address'),
  phoneNumber: z
    .string()
    .min(1, 'Please enter your phone number')
    .regex(/^(977)?9[78]\d{8}$/, 'Phone must start with 98/97 or 977 (Nepal number)'),
  bloodGroup: z
    .string()
    .min(1, 'Please select a blood group'),
  gender: z
    .string()
    .min(1, 'Please select a gender'),
  dateOfBirth: z
    .string()
    .min(1, 'Please enter your date of birth'),
  address: z
    .string()
    .min(1, 'Please enter your address')
    .min(3, 'Address is too short')
    .max(100, 'Address is too long'),
  medicalHistory: z
    .string()
    .max(500, 'Medical history is too long')
    .optional()
    .or(z.literal('')),
});