import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@infra/app/providers/auth-provider';
import { useCallback, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { defaultValues, type ForgotPasswordFormData, forgotPasswordSchema, toDTO } from './model';

type ViewModelState = {
  error: string | null;
  success: string | null;
};

export const useForgotPasswordViewModel = () => {
  const { resetPassword } = useAuth();

  const [state, setState] = useState<ViewModelState>({
    error: null,
    success: null,
  });

  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues,
    mode: 'onChange',
  });

  const submit = useCallback(
    async (data: ForgotPasswordFormData) => {
      const dto = toDTO(data);
      setState({ error: null, success: null });

      const { error } = await resetPassword(dto.email);

      if (error) {
        setState({ error, success: null });
        return;
      }

      setState({
        error: null,
        success: 'E-mail enviado. Verifique sua caixa de entrada para redefinir a senha.',
      });
    },
    [resetPassword]
  );

  const actions = useMemo(
    () => ({
      submit,
      resetMessages: () => setState({ error: null, success: null }),
    }),
    [submit]
  );

  return {
    form,
    state,
    actions,
  };
};

