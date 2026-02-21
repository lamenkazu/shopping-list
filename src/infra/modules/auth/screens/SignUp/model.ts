import type { SignUpDTO } from '@core/dto/auth.dto';
import { z } from 'zod';

export const signUpSchema = z.object({
  fullName: z.string().min(2, 'Full name must have at least 2 characters.'),
  email: z.email('Enter a valid email.'),
  password: z.string().min(6, 'Password must have at least 6 characters.'),
});

export type SignUpFormData = z.infer<typeof signUpSchema>;

export const defaultValues: SignUpFormData = {
  fullName: '',
  email: '',
  password: '',
};

export function toDTO(data: SignUpFormData): SignUpDTO {
  return {
    fullName: data.fullName.trim(),
    email: data.email.trim(),
    password: data.password,
  };
}
