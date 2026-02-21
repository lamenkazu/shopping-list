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
import type { Session, User } from '@supabase/supabase-js';

function mapUser(user: User): AuthUserDTO {
  return {
    id: user.id,
    email: user.email ?? null,
  };
}

function mapSession(session: Session | null): AuthSessionDTO | null {
  if (!session) {
    return null;
  }

  return {
    user: mapUser(session.user),
  };
}

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
      const { error } = await supabase.auth.resetPasswordForEmail(data.email);

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
