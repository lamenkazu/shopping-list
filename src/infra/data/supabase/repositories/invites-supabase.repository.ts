import type {
  AcceptInviteDTO,
  AcceptInviteResultDTO,
  CreatedInviteDTO,
  CreateInviteDTO,
} from '@core/dto/invite.dto';
import { ERROR_CODES } from '@core/error/error-codes';
import type { InvitesRepository } from '@core/repositories/invites.repository';
import { supabase } from '@infra/data/supabase/client';
import { toAppError } from '@infra/data/supabase/error/to-app-error';
import * as Linking from 'expo-linking';

export class InvitesSupabaseRepository implements InvitesRepository {
  async createInvite(data: CreateInviteDTO): Promise<CreatedInviteDTO> {
    try {
      const { data: response, error } = await supabase.rpc('create_invite', {
        p_list_id: data.listId,
      });

      if (error) {
        throw error;
      }

      const invite = response?.[0];

      if (!invite?.token) {
        throw new Error('Could not generate invite token.');
      }

      return {
        token: invite.token,
        expiresAt: invite.expires_at,
        url: Linking.createURL(`/invite/${invite.token}`),
      };
    } catch (error) {
      throw toAppError(error, ERROR_CODES.INVITES_UNKNOWN);
    }
  }

  async acceptInvite(data: AcceptInviteDTO): Promise<AcceptInviteResultDTO> {
    try {
      const { data: response, error } = await supabase.rpc('accept_invite', {
        p_token: data.token,
      });

      if (error) {
        throw error;
      }

      if (!response) {
        throw new Error('Invalid invite token.');
      }

      return {
        listId: String(response),
      };
    } catch (error) {
      throw toAppError(error, ERROR_CODES.INVITES_INVALID);
    }
  }
}
