import { useAuth } from '@infra/app/providers/auth-provider';
import { useRouter } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';

type ViewModelState = {
  error: string | null;
};

export const useProfileViewModel = () => {
  const router = useRouter();
  const { signOut, user } = useAuth();

  const [state, setState] = useState<ViewModelState>({
    error: null,
  });

  const onSignOut = useCallback(async () => {
    setState({ error: null });
    const { error } = await signOut();

    if (error) {
      setState({ error });
      return;
    }

    router.replace('/sign-in' as never);
  }, [router, signOut]);

  const actions = useMemo(
    () => ({
      onSignOut,
    }),
    [onSignOut]
  );

  return {
    state,
    actions,
    user,
  };
};
