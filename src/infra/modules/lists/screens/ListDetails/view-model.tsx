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
  editingItemId: string | null;
  isItemModalOpen: boolean;
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
    editingItemId: null,
    isItemModalOpen: false,
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

  const openCreateItemModal = useCallback(() => {
    form.reset(defaultValues);
    setState(prev => ({ ...prev, editingItemId: null, isItemModalOpen: true }));
  }, [form]);

  const closeItemModal = useCallback(() => {
    form.reset(defaultValues);
    setState(prev => ({ ...prev, editingItemId: null, isItemModalOpen: false }));
  }, [form]);

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
            priceCents: payload.priceCents,
            userId: payload.userId,
          });
        } else {
          await itemsRepository.createItem(payload);
        }

        form.reset(defaultValues);
        setState(prev => ({ ...prev, editingItemId: null, isItemModalOpen: false }));
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
      setState(prev => ({ ...prev, editingItemId: item.id, isItemModalOpen: true }));
      form.setValue('title', item.title);
      form.setValue('quantity', item.quantity !== null ? String(item.quantity) : '');
      form.setValue('unit', item.unit ?? '');
      form.setValue('price', item.priceCents !== null ? (item.priceCents / 100).toFixed(2).replace('.', ',') : '');
    },
    [form]
  );

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
      await Share.share({ message: invite.url });
    } catch (error) {
      setState(prev => ({ ...prev, error: toUserMessage(error) }));
    }
  }, [listId]);

  const totalPriceCents = useMemo(() => {
    return state.items.reduce((acc, item) => acc + (item.priceCents ?? 0), 0);
  }, [state.items]);

  const priceSummary = useMemo(() => {
    const purchasedPriceCents = state.items.reduce((acc, item) => {
      if (!item.isPurchased) {
        return acc;
      }

      return acc + (item.priceCents ?? 0);
    }, 0);

    const unpurchasedPriceCents = totalPriceCents - purchasedPriceCents;

    return {
      totalPriceCents,
      purchasedPriceCents,
      unpurchasedPriceCents,
    };
  }, [state.items, totalPriceCents]);

  const actions = useMemo(
    () => ({
      loadData,
      submitItem,
      startEdit,
      togglePurchased,
      deleteItem,
      generateInvite,
      openCreateItemModal,
      closeItemModal,
      clearError: () => setState(prev => ({ ...prev, error: null })),
    }),
    [closeItemModal, deleteItem, generateInvite, loadData, openCreateItemModal, startEdit, submitItem, togglePurchased]
  );

  return {
    listId,
    form,
    state,
    actions,
    totalPriceCents,
    priceSummary,
    isEditing: Boolean(state.editingItemId),
  };
};
