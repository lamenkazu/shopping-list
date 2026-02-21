export type ShoppingListDTO = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
};

export type CreateShoppingListDTO = {
  name: string;
};

export type DeleteShoppingListDTO = {
  listId: string;
};
