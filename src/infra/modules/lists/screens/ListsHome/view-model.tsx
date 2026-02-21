import type { ShoppingListDTO } from '@core/dto/list.dto';
import { zodResolver } from '@hookform/resolvers/zod';
import { DependencyInjectionFactory } from '@infra/app/di/dependency-injection.factory';
import { useAuth } from '@infra/app/providers/auth-provider';
import { toUserMessage } from '@infra/data/supabase/error/to-app-error';
import { useFocusEffect } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { type CreateListFormData, createListSchema, defaultValues, toDTO } from './model';

type ViewModelState = {
  lists: ShoppingListDTO[];
  isLoading: boolean;
  isCreating: boolean;
  error: string | null;
};

const listsRepository = DependencyInjectionFactory.getInstance().getListsRepository();
const authRepository = DependencyInjectionFactory.getInstance().getAuthRepository();

export const useListsHomeViewModel = () => {
  const { user } = useAuth();

  const [state, setState] = useState<ViewModelState>({
    lists: [],
    isLoading: false,
    isCreating: false,
    error: null,
  });

  const form = useForm<CreateListFormData>({
    resolver: zodResolver(createListSchema),
    defaultValues,
    mode: 'onChange',
  });

  const loadLists = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const lists = await listsRepository.fetchLists();
      setState(prev => ({ ...prev, lists }));
    } catch (error) {
      setState(prev => ({ ...prev, error: toUserMessage(error) }));
    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadLists();
    }, [loadLists])
  );

  const submit = useCallback(
    async (data: CreateListFormData) => {
      if (!user?.id) {
        setState(prev => ({ ...prev, error: 'Você não está autenticado.' }));
        return;
      }

      setState(prev => ({ ...prev, isCreating: true, error: null }));

      try {
        const session = await authRepository.refreshSession();

        if (!session?.user?.id) {
          throw new Error('Sua sessão expirou. Faça login novamente.');
        }

        await listsRepository.createList(toDTO(data));
        form.reset(defaultValues);
        await loadLists();
      } catch (error) {
        setState(prev => ({ ...prev, error: toUserMessage(error) }));
      } finally {
        setState(prev => ({ ...prev, isCreating: false }));
      }
    },
    [form, loadLists, user?.id]
  );

  const deleteList = useCallback(
    async (listId: string) => {
      try {
        await listsRepository.deleteList({ listId });
        await loadLists();
      } catch (error) {
        setState(prev => ({ ...prev, error: toUserMessage(error) }));
      }
    },
    [loadLists]
  );

  const actions = useMemo(
    () => ({
      loadLists,
      submit,
      deleteList,
      clearError: () => setState(prev => ({ ...prev, error: null })),
    }),
    [deleteList, loadLists, submit]
  );

  return {
    form,
    state,
    actions,
  };
};

