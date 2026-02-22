import { z } from 'zod';

export const recoveryPasswordSchema = z
  .object({
    password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres.'),
    confirmPassword: z.string().min(6, 'A confirmação deve ter no mínimo 6 caracteres.'),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem.',
    path: ['confirmPassword'],
  });

export type RecoveryPasswordFormData = z.infer<typeof recoveryPasswordSchema>;

export const defaultValues: RecoveryPasswordFormData = {
  password: '',
  confirmPassword: '',
};

export const toDTO = (data: RecoveryPasswordFormData) => {
  return {
    password: data.password,
  };
};
