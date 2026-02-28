export type ShoppingListDTO = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  inviteToken: string | null;
  inviteExpiresAt: string | null;
  totalPriceCents: number;
};

export type CreateShoppingListDTO = {
  name: string;
};

export type DeleteShoppingListDTO = {
  listId: string;
};
