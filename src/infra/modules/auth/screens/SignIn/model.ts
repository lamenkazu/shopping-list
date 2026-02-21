import type { SignInDTO } from '@core/dto/auth.dto';
import { z } from 'zod';

export const signInSchema = z.object({
  email: z.email('Informe um e-mail válido.'),
  password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres.'),
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

