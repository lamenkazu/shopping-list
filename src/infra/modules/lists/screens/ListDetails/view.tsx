import { formatCurrencyBRL } from '@infra/shared/utils';
import { useAppColors } from '@infra/shared/theme/use-app-colors';
import { UIButton } from '@infra/shared/ui/button';
import { UICard } from '@infra/shared/ui/card';
import { UIHeader } from '@infra/shared/ui/header';
import { UIIconButton } from '@infra/shared/ui/icon-button';
import { lucideIconNodes } from '@infra/shared/ui/icon-nodes';
import { UIInput } from '@infra/shared/ui/input';
import { UILucideIcon } from '@infra/shared/ui/lucide-icon';
import { UIMenu } from '@infra/shared/ui/menu';
import { UIMessage } from '@infra/shared/ui/message';
import { UIModal } from '@infra/shared/ui/modal';
import { UIScreen } from '@infra/shared/ui/screen';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Controller } from 'react-hook-form';
import { Alert, FlatList, Pressable, Text, View } from 'react-native';
import { useListDetailsViewModel } from './view-model';

export const ListDetailsView = () => {
  const router = useRouter();
  const colors = useAppColors();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const { form, state, actions, isEditing, totalPriceCents } = useListDetailsViewModel();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = form;

  const menuItems = useMemo(
    () => [
      {
        label: 'Gerar link de convite',
        iconNode: lucideIconNodes.link,
        onPress: actions.generateInvite,
      },
      {
        label: 'Perfil',
        iconNode: lucideIconNodes.user,
        onPress: () => router.push('/profile' as never),
      },
    ],
    [actions.generateInvite, router]
  );

  const onDeleteItem = (itemId: string, itemTitle: string) => {
    Alert.alert('Excluir item', `Deseja remover "${itemTitle}" da lista?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          await actions.deleteItem(itemId);
        },
      },
    ]);
  };

  return (
    <UIScreen>
      <UIHeader
        title={state.list?.name ?? 'Lista'}
        subtitle={`Total da lista: ${formatCurrencyBRL(totalPriceCents)}`}
        onBack={() => router.back()}
        backIconNode={lucideIconNodes.chevronLeft}
        rightSlot={(
          <View className="flex-row items-center gap-2">
            <UIIconButton
              iconNode={lucideIconNodes.plus}
              onPress={actions.openCreateItemModal}
              accessibilityLabel="Adicionar item"
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
        data={state.items}
        keyExtractor={item => item.id}
        contentContainerClassName="gap-3 pb-10"
        refreshing={state.isLoading}
        onRefresh={actions.loadData}
        ListEmptyComponent={
          !state.isLoading ? (
            <UICard className="p-6">
              <Text style={{ color: colors.textMuted }} className="text-center">
                Nenhum item nesta lista. Toque no + para adicionar.
              </Text>
            </UICard>
          ) : null
        }
        renderItem={({ item }) => (
          <UICard>
            <View className="gap-2">
              <View className="flex-row items-center justify-between gap-3">
                <Text
                  style={{ color: item.isPurchased ? colors.textMuted : colors.text }}
                  className={`flex-1 text-lg font-semibold ${item.isPurchased ? 'line-through' : ''}`}
                >
                  {item.title}
                </Text>

                <Pressable
                  onPress={() => actions.togglePurchased(item)}
                  accessibilityLabel={item.isPurchased ? 'Desmarcar item' : 'Marcar item como comprado'}
                  className="h-7 w-7 items-center justify-center rounded-full border"
                  style={{
                    backgroundColor: item.isPurchased ? colors.successSoft : colors.surfaceElevated,
                    borderColor: item.isPurchased ? colors.success : colors.border,
                  }}
                >
                  <UILucideIcon
                    iconNode={item.isPurchased ? lucideIconNodes.circleCheck : lucideIconNodes.circle}
                    size={16}
                    color={item.isPurchased ? colors.success : colors.textMuted}
                  />
                </Pressable>
              </View>

              <View className="flex-row items-center justify-between gap-2">
                <View className="gap-1">
                  <Text style={{ color: colors.textMuted }} className="text-sm">
                    {item.quantity ?? '-'} {item.unit ?? ''}
                  </Text>

                  {item.priceCents !== null ? (
                    <Text style={{ color: colors.success }} className="text-sm font-semibold">
                      {formatCurrencyBRL(item.priceCents)}
                    </Text>
                  ) : null}
                </View>

                <View className="flex-row items-center gap-2">
                  <UIIconButton
                    iconNode={lucideIconNodes.pencil}
                    size="sm"
                    onPress={() => actions.startEdit(item)}
                    accessibilityLabel={`Editar ${item.title}`}
                  />

                  <UIIconButton
                    iconNode={lucideIconNodes.trash2}
                    size="sm"
                    tone="danger"
                    onPress={() => onDeleteItem(item.id, item.title)}
                    accessibilityLabel={`Excluir ${item.title}`}
                  />
                </View>
              </View>
            </View>
          </UICard>
        )}
      />

      <UIModal
        visible={state.isItemModalOpen}
        title={isEditing ? 'Editar item' : 'Adicionar item'}
        onClose={actions.closeItemModal}
      >
        <View className="gap-2">
          <Controller
            control={control}
            name="title"
            render={({ field: { onChange, value } }) => (
              <UIInput
                value={value}
                onChangeText={text => {
                  actions.clearError();
                  onChange(text);
                }}
                placeholder="Nome do item"
                errorMessage={errors.title?.message}
                autoFocus
              />
            )}
          />

          <View className="flex-row gap-2">
            <Controller
              control={control}
              name="quantity"
              render={({ field: { onChange, value } }) => (
                <UIInput
                  value={value ?? ''}
                  onChangeText={text => {
                    actions.clearError();
                    onChange(text);
                  }}
                  placeholder="Qtd."
                  keyboardType="decimal-pad"
                  errorMessage={errors.quantity?.message}
                  containerClassName="flex-1"
                />
              )}
            />

            <Controller
              control={control}
              name="unit"
              render={({ field: { onChange, value } }) => (
                <UIInput
                  value={value ?? ''}
                  onChangeText={text => {
                    actions.clearError();
                    onChange(text);
                  }}
                  placeholder="Un."
                  containerClassName="flex-1"
                />
              )}
            />
          </View>

          <Controller
            control={control}
            name="price"
            render={({ field: { onChange, value } }) => (
              <UIInput
                value={value ?? ''}
                onChangeText={text => {
                  actions.clearError();
                  onChange(text);
                }}
                placeholder="Preço (R$)"
                keyboardType="decimal-pad"
                errorMessage={errors.price?.message}
              />
            )}
          />
        </View>

        <UIMessage tone="error" message={state.error} className="mt-3" />

        <View className="mt-4 flex-row gap-2">
          <UIButton
            label="Cancelar"
            variant="secondary"
            onPress={actions.closeItemModal}
            containerClassName="flex-1"
          />

          <UIButton
            disabled={state.isBusy}
            loading={state.isBusy}
            loadingLabel="Salvando..."
            label={isEditing ? 'Salvar' : 'Adicionar'}
            onPress={handleSubmit(actions.submitItem)}
            containerClassName="flex-1"
          />
        </View>
      </UIModal>

      <UIMenu visible={isMenuOpen} onClose={() => setIsMenuOpen(false)} items={menuItems} />
    </UIScreen>
  );
};
