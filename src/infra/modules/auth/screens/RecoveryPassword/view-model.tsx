import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@infra/app/providers/auth-provider';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as Linking from 'expo-linking';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  defaultValues,
  type RecoveryPasswordFormData,
  recoveryPasswordSchema,
  toDTO,
} from './model';

type RecoveryParams = Record<string, string | string[]>;

type ViewModelState = {
  callbackError: string | null;
  error: string | null;
  isPreparingCallback: boolean;
  success: string | null;
};

const toQueryParams = (params: RecoveryParams): Record<string, string> => {
  return Object.entries(params).reduce<Record<string, string>>((acc, [key, value]) => {
    if (typeof value === 'string' && value.trim().length > 0) {
      acc[key] = value;
    }

    return acc;
  }, {});
};

export const useRecoveryPasswordViewModel = () => {
  const router = useRouter();
  const params = useLocalSearchParams<RecoveryParams>();
  const incomingUrl = Linking.useURL();
  const didProcessCallbackRef = useRef(false);
  const { handleAuthCallback, signOut, updatePassword } = useAuth();

  const [state, setState] = useState<ViewModelState>({
    callbackError: null,
    error: null,
    isPreparingCallback: true,
    success: null,
  });

  const form = useForm<RecoveryPasswordFormData>({
    resolver: zodResolver(recoveryPasswordSchema),
    defaultValues,
    mode: 'onChange',
  });

  const callbackUrl = useMemo(() => {
    if (incomingUrl) {
      return incomingUrl;
    }

    const queryParams = toQueryParams(params);

    if (Object.keys(queryParams).length === 0) {
      return null;
    }

    return Linking.createURL('/recovery', { queryParams });
  }, [incomingUrl, params]);

  useEffect(() => {
    if (didProcessCallbackRef.current) {
      return;
    }

    if (!callbackUrl) {
      setState(prev => ({
        ...prev,
        callbackError: 'Link de recuperação inválido. Solicite um novo link para continuar.',
        isPreparingCallback: false,
      }));
      return;
    }

    didProcessCallbackRef.current = true;

    const run = async () => {
      const result = await handleAuthCallback(callbackUrl);

      if (result.error) {
        setState(prev => ({
          ...prev,
          callbackError: result.error,
        }));
      }

      setState(prev => ({
        ...prev,
        isPreparingCallback: false,
      }));
    };

    void run();
  }, [callbackUrl, handleAuthCallback]);

  const submit = useCallback(
    async (data: RecoveryPasswordFormData) => {
      if (state.callbackError || state.isPreparingCallback) {
        return;
      }

      const dto = toDTO(data);
      setState(prev => ({ ...prev, error: null, success: null }));

      const result = await updatePassword(dto.password);

      if (result.error) {
        setState(prev => ({
          ...prev,
          error: result.error,
          success: null,
        }));
        return;
      }

      setState(prev => ({
        ...prev,
        error: null,
        success: 'Senha atualizada com sucesso. Você já pode entrar com a nova senha.',
      }));
    },
    [state.callbackError, state.isPreparingCallback, updatePassword]
  );

  const goToSignIn = useCallback(async () => {
    await signOut();
    router.replace('/sign-in' as never);
  }, [router, signOut]);

  const actions = useMemo(
    () => ({
      goToSignIn,
      submit,
      resetMessages: () => setState(prev => ({ ...prev, error: null, success: null })),
    }),
    [goToSignIn, submit]
  );

  return {
    actions,
    form,
    state,
  };
};
