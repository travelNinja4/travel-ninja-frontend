import { z } from 'zod';

export const createAccountSchema = z.object({
  fullName: z.string().min(1, 'Full name is required').max(50),
  agencyName: z.string().optional(),
  email: z
    .string()
    .min(1, 'Email is required')
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Invalid email address')
    .max(50),
  website: z.string().optional(),
  address: z.string().min(1, 'Address is required').max(200),
  city: z.string().min(1, 'City is required').max(20),
  state: z.string().min(1, 'State is required').max(20),
  pincode: z
    .string()
    .length(6, 'Post code must be exactly 6 digits')
    .regex(/^\d+$/, 'Post code must contain only numbers'),
  phoneNumber: z
    .string()
    .length(10, 'Mobile number must be exactly 10 digits')
    .regex(/^\d+$/, 'Mobile number must contain only numbers'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/\d/, 'Password must contain at least one number')
    .regex(/[@$!%*?&]/, 'Password must contain at least one special character')
    .max(12),
  termStatus: z.literal(true, {
    message: 'You must accept the terms',
  }),
});
