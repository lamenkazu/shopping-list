import type { ShoppingItemDTO } from '@core/dto/item.dto';
import type { ShoppingListDTO } from '@core/dto/list.dto';
import { zodResolver } from '@hookform/resolvers/zod';
import { DependencyInjectionFactory } from '@infra/app/di/dependency-injection.factory';
import { useAuth } from '@infra/app/providers/auth-provider';
import { toUserMessage } from '@infra/data/supabase/error/to-app-error';
import { useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Share } from 'react-native';
import { defaultValues, type ItemFormData, itemSchema, toCreateDTO } from './model';

type ViewModelState = {
  list: ShoppingListDTO | null;
  items: ShoppingItemDTO[];
  generatedInvite: string | null;
  editingItemId: string | null;
  isLoading: boolean;
  isBusy: boolean;
  error: string | null;
};

const di = DependencyInjectionFactory.getInstance();
const listsRepository = di.getListsRepository();
const itemsRepository = di.getItemsRepository();
const invitesRepository = di.getInvitesRepository();

const applyRealtimeEvent = (
  previous: ShoppingItemDTO[],
  event: { type: 'INSERT' | 'UPDATE' | 'DELETE'; item?: ShoppingItemDTO; itemId?: string }
) => {
  if (event.type === 'DELETE' && event.itemId) {
    return previous.filter(item => item.id !== event.itemId);
  }

  if (!event.item) {
    return previous;
  }

  const index = previous.findIndex(item => item.id === event.item?.id);

  if (index === -1) {
    return [event.item, ...previous];
  }

  const clone = [...previous];
  clone[index] = event.item;
  return clone;
};

export const useListDetailsViewModel = () => {
  const { user } = useAuth();
  const params = useLocalSearchParams<{ listId: string }>();
  const listId = typeof params.listId === 'string' ? params.listId : '';

  const [state, setState] = useState<ViewModelState>({
    list: null,
    items: [],
    generatedInvite: null,
    editingItemId: null,
    isLoading: false,
    isBusy: false,
    error: null,
  });

  const form = useForm<ItemFormData>({
    resolver: zodResolver(itemSchema),
    defaultValues,
    mode: 'onChange',
  });

  const loadData = useCallback(async () => {
    if (!listId) {
      return;
    }

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const [list, items] = await Promise.all([
        listsRepository.fetchListById(listId),
        itemsRepository.fetchItemsByList(listId),
      ]);

      setState(prev => ({ ...prev, list, items }));
    } catch (error) {
      setState(prev => ({ ...prev, error: toUserMessage(error) }));
    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, [listId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    if (!listId) {
      return;
    }

    const unsubscribe = itemsRepository.subscribeToListItems(listId, event => {
      setState(prev => ({
        ...prev,
        items: applyRealtimeEvent(prev.items, event),
      }));
    });

    return () => {
      unsubscribe();
    };
  }, [listId]);

  const submitItem = useCallback(
    async (data: ItemFormData) => {
      if (!user?.id) {
        setState(prev => ({ ...prev, error: 'Você não está autenticado.' }));
        return;
      }

      setState(prev => ({ ...prev, isBusy: true, error: null }));

      try {
        const payload = toCreateDTO(data, listId, user.id);

        if (state.editingItemId) {
          await itemsRepository.updateItem({
            itemId: state.editingItemId,
            title: payload.title,
            quantity: payload.quantity,
            unit: payload.unit,
            userId: payload.userId,
          });
        } else {
          await itemsRepository.createItem(payload);
        }

        form.reset(defaultValues);
        setState(prev => ({ ...prev, editingItemId: null }));
        await loadData();
      } catch (error) {
        setState(prev => ({ ...prev, error: toUserMessage(error) }));
      } finally {
        setState(prev => ({ ...prev, isBusy: false }));
      }
    },
    [form, listId, loadData, state.editingItemId, user?.id]
  );

  const startEdit = useCallback(
    (item: ShoppingItemDTO) => {
      setState(prev => ({ ...prev, editingItemId: item.id }));
      form.setValue('title', item.title);
      form.setValue('quantity', item.quantity !== null ? String(item.quantity) : '');
      form.setValue('unit', item.unit ?? '');
    },
    [form]
  );

  const cancelEdit = useCallback(() => {
    setState(prev => ({ ...prev, editingItemId: null }));
    form.reset(defaultValues);
  }, [form]);

  const togglePurchased = useCallback(
    async (item: ShoppingItemDTO) => {
      if (!user?.id) {
        setState(prev => ({ ...prev, error: 'Você não está autenticado.' }));
        return;
      }

      try {
        await itemsRepository.togglePurchased({ item, userId: user.id });
        await loadData();
      } catch (error) {
        setState(prev => ({ ...prev, error: toUserMessage(error) }));
      }
    },
    [loadData, user?.id]
  );

  const deleteItem = useCallback(
    async (itemId: string) => {
      try {
        await itemsRepository.deleteItem(itemId);
        await loadData();
      } catch (error) {
        setState(prev => ({ ...prev, error: toUserMessage(error) }));
      }
    },
    [loadData]
  );

  const generateInvite = useCallback(async () => {
    try {
      const invite = await invitesRepository.createInvite({ listId });
      setState(prev => ({ ...prev, generatedInvite: invite.url }));
      await Share.share({ message: invite.url });
    } catch (error) {
      setState(prev => ({ ...prev, error: toUserMessage(error) }));
    }
  }, [listId]);

  const actions = useMemo(
    () => ({
      loadData,
      submitItem,
      startEdit,
      cancelEdit,
      togglePurchased,
      deleteItem,
      generateInvite,
      clearError: () => setState(prev => ({ ...prev, error: null })),
    }),
    [cancelEdit, deleteItem, generateInvite, loadData, startEdit, submitItem, togglePurchased]
  );

  return {
    listId,
    form,
    state,
    actions,
    isEditing: Boolean(state.editingItemId),
  };
};

