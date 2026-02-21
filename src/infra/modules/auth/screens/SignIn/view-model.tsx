import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@infra/app/providers/auth-provider';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { defaultValues, type SignInFormData, signInSchema, toDTO } from './model';

type ViewModelState = {
  error: string | null;
};

export function useSignInViewModel() {
  const router = useRouter();
  const params = useLocalSearchParams<{ redirect?: string }>();
  const { signIn } = useAuth();

  const [state, setState] = useState<ViewModelState>({
    error: null,
  });

  const form = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues,
    mode: 'onChange',
  });

  const submit = useCallback(
    async (data: SignInFormData) => {
      const dto = toDTO(data);
      setState(prev => ({ ...prev, error: null }));

      const { error } = await signIn(dto.email, dto.password);

      if (error) {
        setState(prev => ({ ...prev, error }));
        return;
      }

      const redirect = typeof params.redirect === 'string' ? params.redirect : '/';
      router.replace(redirect as never);
    },
    [params.redirect, router, signIn]
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
}
