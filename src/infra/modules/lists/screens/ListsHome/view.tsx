import { formatCurrencyBRL } from '@infra/shared/utils';
import { useAppColors } from '@infra/shared/theme/use-app-colors';
import { UIButton } from '@infra/shared/ui/button';
import { UICard } from '@infra/shared/ui/card';
import { UIHeader } from '@infra/shared/ui/header';
import { UIIconButton } from '@infra/shared/ui/icon-button';
import { lucideIconNodes } from '@infra/shared/ui/icon-nodes';
import { UIInput } from '@infra/shared/ui/input';
import { UIMenu } from '@infra/shared/ui/menu';
import { UIMessage } from '@infra/shared/ui/message';
import { UIModal } from '@infra/shared/ui/modal';
import { UIScreen } from '@infra/shared/ui/screen';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Controller } from 'react-hook-form';
import { Alert, FlatList, Pressable, Text, View } from 'react-native';
import { useListsHomeViewModel } from './view-model';

export const ListsHomeView = () => {
  const router = useRouter();
  const colors = useAppColors();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const { form, state, actions } = useListsHomeViewModel();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = form;

  const menuItems = useMemo(
    () => [
      {
        label: 'Perfil',
        iconNode: lucideIconNodes.user,
        onPress: () => router.push('/profile' as never),
      },
    ],
    [router]
  );

  const onDeleteList = (listId: string) => {
    Alert.alert('Excluir lista', 'Esta ação não pode ser desfeita.', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          await actions.deleteList(listId);
        },
      },
    ]);
  };

  return (
    <UIScreen>
      <UIHeader
        title="Listas de compras"
        subtitle="Compartilhe e acompanhe em tempo real"
        rightSlot={(
          <View className="flex-row items-center gap-2">
            <UIIconButton
              iconNode={lucideIconNodes.plus}
              onPress={actions.openCreateModal}
              accessibilityLabel="Criar lista"
            />

            <UIIconButton
              iconNode={lucideIconNodes.ellipsisVertical}
              onPress={() => setIsMenuOpen(true)}
              accessibilityLabel="Abrir opções"
            />
          </View>
        )}
      />

      <UIMessage tone="error" message={state.error} className="mb-3" />

      <FlatList
        data={state.lists}
        keyExtractor={item => item.id}
        refreshing={state.isLoading}
        onRefresh={actions.loadLists}
        contentContainerClassName="gap-3 pb-8"
        ListEmptyComponent={
          !state.isLoading ? (
            <UICard className="p-6">
              <Text style={{ color: colors.textMuted }} className="text-center">
                Nenhuma lista criada ainda. Toque no + para começar.
              </Text>
            </UICard>
          ) : null
        }
        renderItem={({ item }) => (
          <UICard>
            <View className="flex-row items-start justify-between gap-3">
              <Pressable
                className="flex-1"
                onPress={() =>
                  router.push({ pathname: '/lists/[listId]', params: { listId: item.id } } as never)
                }
              >
                <Text style={{ color: colors.text }} className="text-lg font-semibold">
                  {item.name}
                </Text>

                <Text style={{ color: colors.success }} className="mt-1 text-sm font-semibold">
                  Total: {formatCurrencyBRL(item.totalPriceCents)}
                </Text>

                <Text style={{ color: colors.textMuted }} className="mt-1 text-xs">
                  Criada em {new Date(item.createdAt).toLocaleString('pt-BR')}
                </Text>
              </Pressable>

              <UIIconButton
                iconNode={lucideIconNodes.trash2}
                tone="danger"
                onPress={() => onDeleteList(item.id)}
                accessibilityLabel={`Excluir ${item.name}`}
              />
            </View>
          </UICard>
        )}
      />

      <UIModal visible={state.isCreateModalOpen} title="Criar lista" onClose={actions.closeCreateModal}>
        <Controller
          control={control}
          name="name"
          render={({ field: { onChange, value } }) => (
            <UIInput
              value={value}
              onChangeText={text => {
                actions.clearError();
                onChange(text);
              }}
              placeholder="Exemplo: Compras da família"
              errorMessage={errors.name?.message}
              autoFocus
            />
          )}
        />

        <UIMessage tone="error" message={state.error} className="mt-3" />

        <View className="mt-4 flex-row gap-2">
          <UIButton
            label="Cancelar"
            variant="secondary"
            onPress={actions.closeCreateModal}
            containerClassName="flex-1"
          />

          <UIButton
            disabled={state.isCreating}
            loading={state.isCreating}
            loadingLabel="Criando..."
            label="Criar"
            onPress={handleSubmit(actions.submit)}
            containerClassName="flex-1"
          />
        </View>
      </UIModal>

      <UIMenu visible={isMenuOpen} onClose={() => setIsMenuOpen(false)} items={menuItems} />
    </UIScreen>
  );
};
