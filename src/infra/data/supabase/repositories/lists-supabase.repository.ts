import type {
  CreateShoppingListDTO,
  DeleteShoppingListDTO,
  ShoppingListDTO,
} from '@core/dto/list.dto';
import { ERROR_CODES } from '@core/error/error-codes';
import type { ListsRepository } from '@core/repositories/lists.repository';
import { supabase } from '@infra/data/supabase/client';
import type { Database } from '@infra/data/supabase/database.types';
import { toAppError } from '@infra/data/supabase/error/to-app-error';

type ShoppingListWithTotalsRow = Database['public']['Views']['shopping_lists_with_totals']['Row'];

const mapShoppingList = (row: ShoppingListWithTotalsRow): ShoppingListDTO => {
  return {
    id: row.id,
    name: row.name,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    createdBy: row.created_by,
    totalPriceCents: Number(row.total_price_cents ?? 0),
  };
};

export class ListsSupabaseRepository implements ListsRepository {
  async fetchLists(): Promise<ShoppingListDTO[]> {
    try {
      const { data, error } = await supabase
        .from('shopping_lists_with_totals')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) {
        throw error;
      }

      return (data ?? []).map(mapShoppingList);
    } catch (error) {
      throw toAppError(error, ERROR_CODES.LISTS_UNKNOWN);
    }
  }

  async fetchListById(listId: string): Promise<ShoppingListDTO> {
    try {
      const { data, error } = await supabase
        .from('shopping_lists_with_totals')
        .select('*')
        .eq('id', listId)
        .single();

      if (error) {
        throw error;
      }

      return mapShoppingList(data);
    } catch (error) {
      throw toAppError(error, ERROR_CODES.LISTS_NOT_FOUND);
    }
  }

  async createList(data: CreateShoppingListDTO): Promise<void> {
    try {
      const { error } = await supabase.from('shopping_lists').insert({
        name: data.name.trim(),
      });

      if (error) {
        throw error;
      }
    } catch (error) {
      throw toAppError(error, ERROR_CODES.LISTS_UNKNOWN);
    }
  }

  async deleteList(data: DeleteShoppingListDTO): Promise<void> {
    try {
      const { error } = await supabase.from('shopping_lists').delete().eq('id', data.listId);

      if (error) {
        throw error;
      }
    } catch (error) {
      throw toAppError(error, ERROR_CODES.LISTS_UNKNOWN);
    }
  }
}
