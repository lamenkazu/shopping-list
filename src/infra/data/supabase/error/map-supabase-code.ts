import type { ErrorCode } from '@core/error/error-codes';
import { ERROR_CODES } from '@core/error/error-codes';

export function mapSupabaseCodeToErrorCode(
  supabaseCode: string | undefined,
  fallback: ErrorCode
): ErrorCode {
  if (!supabaseCode) {
    return fallback;
  }

  if (supabaseCode === '42501') {
    if (fallback.startsWith('LISTS_')) return ERROR_CODES.LISTS_FORBIDDEN;
    if (fallback.startsWith('ITEMS_')) return ERROR_CODES.ITEMS_FORBIDDEN;
    return ERROR_CODES.AUTH_UNAUTHORIZED;
  }

  return fallback;
}
