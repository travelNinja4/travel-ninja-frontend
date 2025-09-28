import { z } from 'zod';
import { Country } from '@/services/authService';

export const createAccountSchema = (countries: Country[]) =>
  z.object({
    fullName: z.string().min(1, 'Full name is required').max(50),
    agencyName: z.string().min(1, 'Agency name is required').max(50),
    email: z
      .string()
      .min(1, 'Email is required')
      .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Invalid email address')
      .max(50),
    website: z.string().optional(),
    address: z.string().min(1, 'Address is required').max(200),
    city: z.string().min(1, 'City is required').max(20),
    state: z.string().min(1, 'State is required').max(20),
    country: z.string().min(1, 'Country is required').max(20),
    phoneNumber: z
      .object({
        country: z.string().min(1, 'Country code is required'),
        number: z
          .string()
          .min(1, 'Mobile number is required')
          .regex(/^\d+$/, 'Mobile number must contain only numbers'),
      })
      .superRefine((val, ctx) => {
        if (!val.country || !val.number) return;

        const countryConfig = countries.find((c) => c.code === val.country);
        if (countryConfig && val.number.length !== countryConfig.length) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Invalid phone number length`,
            path: ['number'],
          });
        }
      }),
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
