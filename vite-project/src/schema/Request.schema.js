import { z } from 'zod';

export const RequestSchema = z.object({
  patientName: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name is too long')
    .regex(/^[a-zA-Z\s]+$/, 'Name can only contain letters'),
  bloodGroup: z
    .string()
    .min(1, 'Please select a blood group'),
  unitsNeeded: z
    .number({ invalid_type_error: 'Units must be a number' })
    .min(1, 'At least 1 unit required')
    .max(20, 'Cannot exceed 20 units'),
  hospitalLocation: z
    .string()
    .min(3, 'Please enter a valid hospital or location')
    .max(100, 'Location is too long'),
});