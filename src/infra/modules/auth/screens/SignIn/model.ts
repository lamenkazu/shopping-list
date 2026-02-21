import type { SignInDTO } from '@core/dto/auth.dto';
import { z } from 'zod';

export const signInSchema = z.object({
  email: z.email('Enter a valid email.'),
  password: z.string().min(6, 'Password must have at least 6 characters.'),
});

export type SignInFormData = z.infer<typeof signInSchema>;

export const defaultValues: SignInFormData = {
  email: '',
  password: '',
};

export const toDTO = (data: SignInFormData): SignInDTO => {
  return {
    email: data.email.trim(),
    password: data.password,
  };
};
