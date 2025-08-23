import { z } from 'zod';

export const registrationSchema = z
  .object({
    fullName: z.string().min(1, 'Full name is required').max(50),
    agencyName: z.string().optional(),
    email: z
      .string()
      .min(1, 'Email is required')
      .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Invalid email address')
      .max(50),
    website: z.string().optional(),
    address: z.string().min(1, 'Address is required').max(200),
    city: z.string().min(1, '').max(15),
    state: z.string().min(1, '').max(15),
    postCode: z
      .string()
      .regex(/^\d{6}$/, 'Post code must be exactly 6 digits')
      .max(6),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/\d/, 'Password must contain at least one number')
      .regex(/[@$!%*?&]/, 'Password must contain at least one special character'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });
