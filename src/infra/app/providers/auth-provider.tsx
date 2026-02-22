import type { AuthSessionDTO, AuthUserDTO } from '@core/dto/auth.dto';
import { DependencyInjectionFactory } from '@infra/app/di/dependency-injection.factory';
import { toUserMessage } from '@infra/data/supabase/error/to-app-error';
import { createContext, type ReactNode, useContext, useEffect, useMemo, useState } from 'react';

type AuthResult = {
  error: string | null;
};

type SignUpResult = AuthResult & {
  needsEmailConfirmation: boolean;
};

type AuthContextValue = {
  isLoading: boolean;
  session: AuthSessionDTO | null;
  user: AuthUserDTO | null;
  handleAuthCallback: (url: string) => Promise<AuthResult>;
  resetPassword: (email: string) => Promise<AuthResult>;
  signIn: (email: string, password: string) => Promise<AuthResult>;
  signOut: () => Promise<AuthResult>;
  signUp: (email: string, password: string, fullName?: string) => Promise<SignUpResult>;
  updatePassword: (password: string) => Promise<AuthResult>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);
const authRepository = DependencyInjectionFactory.getInstance().getAuthRepository();

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<AuthSessionDTO | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    authRepository
      .getSession()
      .then(nextSession => {
        if (!isMounted) {
          return;
        }

        setSession(nextSession);
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    const unsubscribe = authRepository.onAuthStateChange(nextSession => {
      setSession(nextSession);
      setIsLoading(false);
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      isLoading,
      session,
      user: session?.user ?? null,
      signIn: async (email, password) => {
        try {
          await authRepository.signIn({ email, password });
          return { error: null };
        } catch (error) {
          return { error: toUserMessage(error) };
        }
      },
      signOut: async () => {
        try {
          await authRepository.signOut();
          return { error: null };
        } catch (error) {
          return { error: toUserMessage(error) };
        }
      },
      signUp: async (email, password, fullName) => {
        try {
          const result = await authRepository.signUp({
            email,
            password,
            fullName,
          });

          return {
            error: null,
            needsEmailConfirmation: result.needsEmailConfirmation,
          };
        } catch (error) {
          return {
            error: toUserMessage(error),
            needsEmailConfirmation: false,
          };
        }
      },
      resetPassword: async email => {
        try {
          await authRepository.resetPassword({ email });
          return { error: null };
        } catch (error) {
          return { error: toUserMessage(error) };
        }
      },
      handleAuthCallback: async url => {
        try {
          await authRepository.handleAuthCallback(url);
          return { error: null };
        } catch (error) {
          return { error: toUserMessage(error) };
        }
      },
      updatePassword: async password => {
        try {
          await authRepository.updatePassword(password);
          return { error: null };
        } catch (error) {
          return { error: toUserMessage(error) };
        }
      },
    }),
    [isLoading, session]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
};
