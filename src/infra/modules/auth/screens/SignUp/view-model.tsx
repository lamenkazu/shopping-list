import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@infra/app/providers/auth-provider';
import { useRouter } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { defaultValues, type SignUpFormData, signUpSchema, toDTO } from './model';

type ViewModelState = {
  error: string | null;
};

export const useSignUpViewModel = () => {
  const router = useRouter();
  const { signUp } = useAuth();

  const [state, setState] = useState<ViewModelState>({
    error: null,
  });

  const form = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues,
    mode: 'onChange',
  });

  const submit = useCallback(
    async (data: SignUpFormData) => {
      const dto = toDTO(data);
      setState(prev => ({ ...prev, error: null }));

      const result = await signUp(dto.email, dto.password, dto.fullName);

      if (result.error) {
        setState(prev => ({ ...prev, error: result.error }));
        return;
      }

      if (result.needsEmailConfirmation) {
        router.replace('/sign-in' as never);
        return;
      }

      router.replace('/' as never);
    },
    [router, signUp]
  );

  const actions = useMemo(
    () => ({
      submit,
      resetError: () => setState(prev => ({ ...prev, error: null })),
    }),
    [submit]
  );

  return {
    form,
    state,
    actions,
  };
};
