import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@infra/app/providers/auth-provider';
import { useToast } from '@infra/app/providers/toast-provider';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { defaultValues, type SignInFormData, signInSchema, toDTO } from './model';

type ViewModelState = {
  error: string | null;
};

export const useSignInViewModel = () => {
  const router = useRouter();
  const params = useLocalSearchParams<{ redirect?: string; confirmed?: string }>();
  const { signIn } = useAuth();
  const { showToast } = useToast();
  const hasShownConfirmationToastRef = useRef(false);

  const [state, setState] = useState<ViewModelState>({
    error: null,
  });

  const form = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues,
    mode: 'onChange',
  });

  useEffect(() => {
    if (hasShownConfirmationToastRef.current) {
      return;
    }

    if (params.confirmed !== '1') {
      return;
    }

    hasShownConfirmationToastRef.current = true;
    showToast('E-mail confirmado com sucesso. Agora você já pode entrar.', 'success');
  }, [params.confirmed, showToast]);

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
};
