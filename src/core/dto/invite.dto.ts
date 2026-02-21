export type CreateInviteDTO = {
  listId: string;
};

export type CreatedInviteDTO = {
  token: string;
  url: string;
  expiresAt: string;
};

export type AcceptInviteDTO = {
  token: string;
};

export type AcceptInviteResultDTO = {
  listId: string;
};
