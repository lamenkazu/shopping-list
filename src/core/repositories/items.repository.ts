import type {
  CreateShoppingItemDTO,
  ShoppingItemDTO,
  ShoppingItemRealtimeEvent,
  TogglePurchasedShoppingItemDTO,
  UpdateShoppingItemDTO,
} from '@core/dto/item.dto';

export interface ItemsRepository {
  fetchItemsByList(listId: string): Promise<ShoppingItemDTO[]>;
  createItem(data: CreateShoppingItemDTO): Promise<void>;
  updateItem(data: UpdateShoppingItemDTO): Promise<void>;
  deleteItem(itemId: string): Promise<void>;
  togglePurchased(data: TogglePurchasedShoppingItemDTO): Promise<void>;
  subscribeToListItems(
    listId: string,
    onEvent: (event: ShoppingItemRealtimeEvent) => void
  ): () => void;
}
