import type {
  CreateShoppingListDTO,
  DeleteShoppingListDTO,
  ShoppingListDTO,
} from '@core/dto/list.dto';

export interface ListsRepository {
  fetchLists(): Promise<ShoppingListDTO[]>;
  fetchListById(listId: string): Promise<ShoppingListDTO>;
  createList(data: CreateShoppingListDTO): Promise<void>;
  deleteList(data: DeleteShoppingListDTO): Promise<void>;
}
