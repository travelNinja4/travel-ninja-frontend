import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Please enter email address')
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Invalid email address')
    .max(50),
  password: z.string().min(6, 'Please enter valid password'),
});
