import { useAuth } from '@infra/app/providers/auth-provider';
import { useAppTheme } from '@infra/app/providers/theme-provider';
import type { ThemeMode } from '@infra/app/providers/theme-provider';
import { useRouter } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';

type ViewModelState = {
  error: string | null;
};

export const useProfileViewModel = () => {
  const router = useRouter();
  const { signOut, user } = useAuth();
  const { mode, setMode } = useAppTheme();

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

  const onChangeThemeMode = useCallback(
    async (nextMode: ThemeMode) => {
      await setMode(nextMode);
    },
    [setMode]
  );

  const actions = useMemo(
    () => ({
      onSignOut,
      onChangeThemeMode,
    }),
    [onChangeThemeMode, onSignOut]
  );

  return {
    state,
    actions,
    user,
    mode,
  };
};
