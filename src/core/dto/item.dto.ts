export type ShoppingItemDTO = {
  id: string;
  listId: string;
  title: string;
  quantity: number | null;
  unit: string | null;
  priceCents: number | null;
  isPurchased: boolean;
  purchasedAt: string | null;
  purchasedBy: string | null;
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateShoppingItemDTO = {
  listId: string;
  title: string;
  quantity: number | null;
  unit: string | null;
  priceCents: number | null;
  userId: string;
};

export type UpdateShoppingItemDTO = {
  itemId: string;
  title: string;
  quantity: number | null;
  unit: string | null;
  priceCents: number | null;
  userId: string;
};

export type TogglePurchasedShoppingItemDTO = {
  item: ShoppingItemDTO;
  userId: string;
};

export type ShoppingItemRealtimeEvent =
  | { type: 'INSERT'; item: ShoppingItemDTO }
  | { type: 'UPDATE'; item: ShoppingItemDTO }
  | { type: 'DELETE'; itemId: string };
