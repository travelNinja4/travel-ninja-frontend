import { z } from 'zod';
import { Country } from '@/constants/types';
import { loginSchema } from '../../login/LoginForm/LoginSchema';

/**
 * Create-account rules. Countries come from the API, so the schema is built per list
 * to check the mobile number length for the selected country.
 */
export const createAccountSchema = (countries: Country[]) =>
  z
    .object({
      agencyName: z.string().trim().min(1, 'Agency name is required').max(100),
      fullName: z.string().trim().min(1, 'Contact person’s name is required').max(100),
      // Country `code` from the API, e.g. "+91 (IN)"
      country: z.string().min(1, 'Please select a country'),
      // Same email rules and messages as sign in
      email: loginSchema.shape.email,
      mobileNumber: z
        .string()
        .trim()
        .min(1, 'Mobile number is required')
        .regex(/^\d+$/, 'Mobile number must contain only numbers'),
      // Matches the API's password policy
      password: z
        .string()
        .min(8, 'Password must be at least 8 characters')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
        .regex(/\d/, 'Password must contain at least one number')
        .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character')
        .max(100),
      confirmPassword: z.string().min(1, 'Please confirm your password'),
      termStatus: z.boolean().refine(Boolean, 'You must accept the terms'),
    })
    .superRefine(({ country, mobileNumber, password, confirmPassword }, ctx) => {
      const expectedLength = countries.find((c) => c.code === country)?.length;
      if (expectedLength && /^\d+$/.test(mobileNumber) && mobileNumber.length !== expectedLength) {
        ctx.addIssue({
          code: 'custom',
          message: `Mobile number must be ${expectedLength} digits`,
          path: ['mobileNumber'],
        });
      }
      if (confirmPassword && password !== confirmPassword) {
        ctx.addIssue({
          code: 'custom',
          message: 'Passwords do not match',
          path: ['confirmPassword'],
        });
      }
    });

export type CreateAccountFormValues = z.infer<ReturnType<typeof createAccountSchema>>;
