import type {
  CreateShoppingItemDTO,
  ShoppingItemDTO,
  ShoppingItemRealtimeEvent,
  TogglePurchasedShoppingItemDTO,
  UpdateShoppingItemDTO,
} from '@core/dto/item.dto';
import { ERROR_CODES } from '@core/error/error-codes';
import type { ItemsRepository } from '@core/repositories/items.repository';
import { supabase } from '@infra/data/supabase/client';
import type { Database } from '@infra/data/supabase/database.types';
import { toAppError } from '@infra/data/supabase/error/to-app-error';
import type { RealtimePostgresChangesPayload } from '@supabase/supabase-js';

type ShoppingItemRow = Database['public']['Tables']['shopping_items']['Row'];

function mapShoppingItem(row: ShoppingItemRow): ShoppingItemDTO {
  return {
    id: row.id,
    listId: row.list_id,
    title: row.title,
    quantity: row.quantity,
    unit: row.unit,
    isPurchased: row.is_purchased,
    purchasedAt: row.purchased_at,
    purchasedBy: row.purchased_by,
    createdBy: row.created_by,
    updatedBy: row.updated_by,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function toRealtimeEvent(
  payload: RealtimePostgresChangesPayload<ShoppingItemRow>
): ShoppingItemRealtimeEvent {
  if (payload.eventType === 'DELETE') {
    return {
      type: 'DELETE',
      itemId: String(payload.old.id),
    };
  }

  if (payload.eventType === 'INSERT') {
    return {
      type: 'INSERT',
      item: mapShoppingItem(payload.new),
    };
  }

  return {
    type: 'UPDATE',
    item: mapShoppingItem(payload.new),
  };
}

export class ItemsSupabaseRepository implements ItemsRepository {
  async fetchItemsByList(listId: string): Promise<ShoppingItemDTO[]> {
    try {
      const { data, error } = await supabase
        .from('shopping_items')
        .select('*')
        .eq('list_id', listId)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      return (data ?? []).map(mapShoppingItem);
    } catch (error) {
      throw toAppError(error, ERROR_CODES.ITEMS_UNKNOWN);
    }
  }

  async createItem(data: CreateShoppingItemDTO): Promise<void> {
    try {
      const { error } = await supabase.from('shopping_items').insert({
        list_id: data.listId,
        title: data.title.trim(),
        quantity: data.quantity,
        unit: data.unit,
        created_by: data.userId,
        updated_by: data.userId,
      });

      if (error) {
        throw error;
      }
    } catch (error) {
      throw toAppError(error, ERROR_CODES.ITEMS_UNKNOWN);
    }
  }

  async updateItem(data: UpdateShoppingItemDTO): Promise<void> {
    try {
      const { error } = await supabase
        .from('shopping_items')
        .update({
          title: data.title.trim(),
          quantity: data.quantity,
          unit: data.unit,
          updated_by: data.userId,
          updated_at: new Date().toISOString(),
        })
        .eq('id', data.itemId);

      if (error) {
        throw error;
      }
    } catch (error) {
      throw toAppError(error, ERROR_CODES.ITEMS_UNKNOWN);
    }
  }

  async deleteItem(itemId: string): Promise<void> {
    try {
      const { error } = await supabase.from('shopping_items').delete().eq('id', itemId);

      if (error) {
        throw error;
      }
    } catch (error) {
      throw toAppError(error, ERROR_CODES.ITEMS_UNKNOWN);
    }
  }

  async togglePurchased(data: TogglePurchasedShoppingItemDTO): Promise<void> {
    try {
      const { error } = await supabase
        .from('shopping_items')
        .update({
          is_purchased: !data.item.isPurchased,
          purchased_at: !data.item.isPurchased ? new Date().toISOString() : null,
          purchased_by: !data.item.isPurchased ? data.userId : null,
          updated_by: data.userId,
          updated_at: new Date().toISOString(),
        })
        .eq('id', data.item.id);

      if (error) {
        throw error;
      }
    } catch (error) {
      throw toAppError(error, ERROR_CODES.ITEMS_UNKNOWN);
    }
  }

  subscribeToListItems(
    listId: string,
    onEvent: (event: ShoppingItemRealtimeEvent) => void
  ): () => void {
    const channel = supabase
      .channel(`shopping-items-${listId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'shopping_items',
          filter: `list_id=eq.${listId}`,
        },
        payload => {
          onEvent(toRealtimeEvent(payload as RealtimePostgresChangesPayload<ShoppingItemRow>));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }
}
