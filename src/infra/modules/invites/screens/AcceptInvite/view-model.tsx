import { DependencyInjectionFactory } from '@infra/app/di/dependency-injection.factory';
import { toUserMessage } from '@infra/data/supabase/error/to-app-error';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { toDTO } from './model';

type ViewModelState = {
  isSubmitting: boolean;
  error: string | null;
};

const invitesRepository = DependencyInjectionFactory.getInstance().getInvitesRepository();

export function useAcceptInviteViewModel() {
  const router = useRouter();
  const params = useLocalSearchParams<{ token: string }>();
  const token = typeof params.token === 'string' ? params.token : '';

  const [state, setState] = useState<ViewModelState>({
    isSubmitting: false,
    error: null,
  });

  const acceptInvite = useCallback(async () => {
    if (!token) {
      setState(prev => ({ ...prev, error: 'This invite link is invalid.' }));
      return;
    }

    setState(prev => ({ ...prev, isSubmitting: true, error: null }));

    try {
      const result = await invitesRepository.acceptInvite(toDTO({ token }));
      router.replace({ pathname: '/lists/[listId]', params: { listId: result.listId } } as never);
    } catch (error) {
      setState(prev => ({ ...prev, error: toUserMessage(error) }));
    } finally {
      setState(prev => ({ ...prev, isSubmitting: false }));
    }
  }, [router, token]);

  const actions = useMemo(
    () => ({
      acceptInvite,
      clearError: () => setState(prev => ({ ...prev, error: null })),
    }),
    [acceptInvite]
  );

  return {
    state,
    actions,
  };
}
