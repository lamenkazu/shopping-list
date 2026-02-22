import type {
  AuthSessionDTO,
  AuthUserDTO,
  ResetPasswordDTO,
  SignInDTO,
  SignUpDTO,
  SignUpResultDTO,
} from '@core/dto/auth.dto';
import { ERROR_CODES } from '@core/error/error-codes';
import type { AuthRepository } from '@core/repositories/auth.repository';
import { supabase } from '@infra/data/supabase/client';
import { toAppError } from '@infra/data/supabase/error/to-app-error';
import type { EmailOtpType, Session, User } from '@supabase/supabase-js';
import * as Linking from 'expo-linking';

const mapUser = (user: User): AuthUserDTO => {
  return {
    id: user.id,
    email: user.email ?? null,
  };
};

const mapSession = (session: Session | null): AuthSessionDTO | null => {
  if (!session) {
    return null;
  }

  return {
    user: mapUser(session.user),
  };
};

const getBaseRedirectUrl = (): string | null => {
  const baseUrl = process.env.EXPO_PUBLIC_INVITE_BASE_URL?.trim();

  if (!baseUrl) {
    return null;
  }

  return baseUrl.replace(/\/+$/, '');
};

const getEmailConfirmationRedirectUrl = (): string => {
  const baseUrl = getBaseRedirectUrl();

  if (baseUrl) {
    return `${baseUrl}/auth/confirm`;
  }

  return Linking.createURL('/sign-in', { queryParams: { confirmed: '1' } });
};

const getPasswordRecoveryRedirectUrl = (): string => {
  const baseUrl = getBaseRedirectUrl();

  if (baseUrl) {
    return `${baseUrl}/auth/recovery`;
  }

  return Linking.createURL('/recovery');
};

const parseAuthParams = (url: string): URLSearchParams => {
  const params = new URLSearchParams();
  const [withoutHash, hashString = ''] = url.split('#');
  const [, queryString = ''] = withoutHash.split('?');

  const appendParams = (raw: string) => {
    if (!raw) {
      return;
    }

    const nextParams = new URLSearchParams(raw);
    nextParams.forEach((value, key) => {
      params.set(key, value);
    });
  };

  appendParams(queryString);
  appendParams(hashString);

  return params;
};

export class AuthSupabaseRepository implements AuthRepository {
  async getSession(): Promise<AuthSessionDTO | null> {
    try {
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        throw error;
      }

      return mapSession(data.session);
    } catch (error) {
      throw toAppError(error, ERROR_CODES.AUTH_UNKNOWN);
    }
  }

  async refreshSession(): Promise<AuthSessionDTO | null> {
    try {
      const { data, error } = await supabase.auth.refreshSession();

      if (error) {
        throw error;
      }

      return mapSession(data.session);
    } catch (error) {
      throw toAppError(error, ERROR_CODES.AUTH_SESSION_EXPIRED);
    }
  }

  onAuthStateChange(listener: (session: AuthSessionDTO | null) => void): () => void {
    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      listener(mapSession(nextSession));
    });

    return () => {
      data.subscription.unsubscribe();
    };
  }

  async signIn(credentials: SignInDTO): Promise<void> {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });

      if (error) {
        throw error;
      }
    } catch (error) {
      throw toAppError(error, ERROR_CODES.AUTH_INVALID_CREDENTIALS);
    }
  }

  async signUp(data: SignUpDTO): Promise<SignUpResultDTO> {
    try {
      const { data: response, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          emailRedirectTo: getEmailConfirmationRedirectUrl(),
          data: {
            full_name: data.fullName?.trim() || null,
          },
        },
      });

      if (error) {
        throw error;
      }

      return {
        needsEmailConfirmation: !response.session,
      };
    } catch (error) {
      throw toAppError(error, ERROR_CODES.AUTH_UNKNOWN);
    }
  }

  async resetPassword(data: ResetPasswordDTO): Promise<void> {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
        redirectTo: getPasswordRecoveryRedirectUrl(),
      });

      if (error) {
        throw error;
      }
    } catch (error) {
      throw toAppError(error, ERROR_CODES.AUTH_UNKNOWN);
    }
  }

  async handleAuthCallback(url: string): Promise<void> {
    try {
      const params = parseAuthParams(url);
      const code = params.get('code');
      const accessToken = params.get('access_token');
      const refreshToken = params.get('refresh_token');
      const tokenHash = params.get('token_hash');
      const otpType = params.get('type');

      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);

        if (error) {
          throw error;
        }

        return;
      }

      if (accessToken && refreshToken) {
        const { error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });

        if (error) {
          throw error;
        }

        return;
      }

      if (tokenHash && otpType) {
        const { error } = await supabase.auth.verifyOtp({
          token_hash: tokenHash,
          type: otpType as EmailOtpType,
        });

        if (error) {
          throw error;
        }

        return;
      }

      throw new Error('Link de autenticação inválido ou expirado.');
    } catch (error) {
      throw toAppError(error, ERROR_CODES.AUTH_UNKNOWN);
    }
  }

  async updatePassword(password: string): Promise<void> {
    try {
      const { error } = await supabase.auth.updateUser({ password });

      if (error) {
        throw error;
      }
    } catch (error) {
      throw toAppError(error, ERROR_CODES.AUTH_UNKNOWN);
    }
  }

  async signOut(): Promise<void> {
    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        throw error;
      }
    } catch (error) {
      throw toAppError(error, ERROR_CODES.AUTH_UNKNOWN);
    }
  }
}
