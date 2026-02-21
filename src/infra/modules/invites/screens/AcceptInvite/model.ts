import type { AcceptInviteDTO } from '@core/dto/invite.dto';

export type AcceptInviteModel = {
  token: string;
};

export function toDTO(model: AcceptInviteModel): AcceptInviteDTO {
  return {
    token: model.token,
  };
}
