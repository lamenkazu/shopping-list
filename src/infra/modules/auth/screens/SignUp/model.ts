import type { SignUpDTO } from '@core/dto/auth.dto';
import { z } from 'zod';

export const signUpSchema = z
  .object({
    fullName: z.string().min(2, 'O nome completo deve ter no mínimo 2 caracteres.'),
    email: z.email('Informe um e-mail válido.'),
    password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres.'),
    confirmPassword: z.string().min(6, 'A confirmação deve ter no mínimo 6 caracteres.'),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem.',
    path: ['confirmPassword'],
  });

export type SignUpFormData = z.infer<typeof signUpSchema>;

export const defaultValues: SignUpFormData = {
  fullName: '',
  email: '',
  password: '',
  confirmPassword: '',
};

export const toDTO = (data: SignUpFormData): SignUpDTO => {
  return {
    fullName: data.fullName.trim(),
    email: data.email.trim(),
    password: data.password,
  };
};
