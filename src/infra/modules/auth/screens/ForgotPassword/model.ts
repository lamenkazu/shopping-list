import type { ResetPasswordDTO } from '@core/dto/auth.dto';
import { z } from 'zod';

export const forgotPasswordSchema = z.object({
  email: z.email('Informe um e-mail válido.'),
});

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export const defaultValues: ForgotPasswordFormData = {
  email: '',
};

export const toDTO = (data: ForgotPasswordFormData): ResetPasswordDTO => {
  return {
    email: data.email.trim(),
  };
};

