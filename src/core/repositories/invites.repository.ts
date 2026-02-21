import type {
  AcceptInviteDTO,
  AcceptInviteResultDTO,
  CreatedInviteDTO,
  CreateInviteDTO,
} from '@core/dto/invite.dto';

export interface InvitesRepository {
  createInvite(data: CreateInviteDTO): Promise<CreatedInviteDTO>;
  acceptInvite(data: AcceptInviteDTO): Promise<AcceptInviteResultDTO>;
}
