import type { SignUpDTO } from '@core/dto/auth.dto';
import { z } from 'zod';

export const signUpSchema = z.object({
  fullName: z.string().min(2, 'O nome completo deve ter no mínimo 2 caracteres.'),
  email: z.email('Informe um e-mail válido.'),
  password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres.'),
});

export type SignUpFormData = z.infer<typeof signUpSchema>;

export const defaultValues: SignUpFormData = {
  fullName: '',
  email: '',
  password: '',
};

export const toDTO = (data: SignUpFormData): SignUpDTO => {
  return {
    fullName: data.fullName.trim(),
    email: data.email.trim(),
    password: data.password,
  };
};

