import { z } from 'zod';
import { loginSchema } from '../LoginForm/LoginSchema';

// Same email rules and messages as sign in
export const forgotPasswordSchema = loginSchema.pick({ email: true });

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;
