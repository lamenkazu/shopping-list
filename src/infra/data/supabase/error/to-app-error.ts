import { AppError } from '@core/error/AppError';
import type { ErrorCode } from '@core/error/error-codes';
import { ERROR_CODES } from '@core/error/error-codes';
import { mapSupabaseCodeToErrorCode } from '@infra/data/supabase/error/map-supabase-code';

export const toAppError = (error: unknown, fallbackCode: ErrorCode): AppError => {
  if (error instanceof AppError) {
    return error;
  }

  if (error && typeof error === 'object' && 'message' in error) {
    const message = String(error.message);
    const code = mapSupabaseCodeToErrorCode(
      'code' in error ? String(error.code) : undefined,
      fallbackCode
    );
    const details = 'details' in error && error.details ? String(error.details) : undefined;
    const hint = 'hint' in error && error.hint ? String(error.hint) : undefined;

    return new AppError({ code, message, details, hint, cause: error });
  }

  return new AppError({
    code: ERROR_CODES.UNKNOWN_ERROR,
    message: 'Erro inesperado, tente novamente.',
    cause: error,
  });
};

export const toUserMessage = (error: unknown): string => {
  if (error instanceof AppError) {
    return error.message;
  }

  return 'Erro inesperado, tente novamente.';
};
