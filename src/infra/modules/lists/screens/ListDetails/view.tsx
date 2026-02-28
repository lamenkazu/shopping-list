import { useAppColors } from '@infra/shared/theme/use-app-colors';
import { UIButton } from '@infra/shared/ui/button';
import { UICard } from '@infra/shared/ui/card';
import { UIHeader } from '@infra/shared/ui/header';
import { UIIconButton } from '@infra/shared/ui/icon-button';
import { lucideIconNodes } from '@infra/shared/ui/icon-nodes';
import { UIInput } from '@infra/shared/ui/input';
import { UIConfirmDialog } from '@infra/shared/ui/confirm-dialog';
import { UILucideIcon } from '@infra/shared/ui/lucide-icon';
import { UIMenu } from '@infra/shared/ui/menu';
import { UIMessage } from '@infra/shared/ui/message';
import { UIModal } from '@infra/shared/ui/modal';
import { UIScreen } from '@infra/shared/ui/screen';
import { formatCurrencyBRL } from '@infra/shared/utils';
import { useRouter } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Controller } from 'react-hook-form';
import { Animated, Easing, FlatList, Pressable, Text, View } from 'react-native';
import { useListDetailsViewModel } from './view-model';

export const ListDetailsView = () => {
  const router = useRouter();
  const colors = useAppColors();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [itemMenuTargetId, setItemMenuTargetId] = useState<string | null>(null);
  const [isInviteCopied, setIsInviteCopied] = useState(false);
  const [itemPendingDelete, setItemPendingDelete] = useState<{ id: string; title: string } | null>(null);
  const copyFeedbackTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const copyIconAnim = useRef(new Animated.Value(1)).current;

  const { form, state, invite, actions, isEditing, priceSummary } = useListDetailsViewModel();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = form;

  const submitItemForm = handleSubmit(actions.submitItem);

  const formattedInviteExpiration = useMemo(() => {
    if (!invite.expiresAt) {
      return null;
    }

    return new Date(invite.expiresAt).toLocaleString('pt-BR');
  }, [invite.expiresAt]);

  const menuItems = useMemo(
    () => [
      {
        label: 'Link de convite',
        iconNode: lucideIconNodes.link,
        onPress: () => {
          setIsMenuOpen(false);
          actions.openInviteModal();
        },
      },
      {
        label: 'Perfil',
        iconNode: lucideIconNodes.user,
        onPress: () => router.push('/profile' as never),
      },
    ],
    [actions.openInviteModal, router]
  );
  const onOpenDeleteItemDialog = (itemId: string, itemTitle: string) => {
    setItemPendingDelete({ id: itemId, title: itemTitle });
  };

  const onCloseDeleteItemDialog = () => {
    setItemPendingDelete(null);
  };

  const onConfirmDeleteItem = async () => {
    if (!itemPendingDelete) {
      return;
    }

    await actions.deleteItem(itemPendingDelete.id);
    setItemPendingDelete(null);
  };

  useEffect(() => {
    return () => {
      if (copyFeedbackTimeoutRef.current) {
        clearTimeout(copyFeedbackTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    Animated.sequence([
      Animated.timing(copyIconAnim, {
        toValue: 0,
        duration: 90,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(copyIconAnim, {
        toValue: 1,
        duration: 170,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start();
  }, [copyIconAnim, isInviteCopied]);

  const onCopyInviteLink = () => {
    const copied = actions.copyInviteLink();

    if (!copied) {
      return;
    }

    setIsInviteCopied(true);

    if (copyFeedbackTimeoutRef.current) {
      clearTimeout(copyFeedbackTimeoutRef.current);
    }

    copyFeedbackTimeoutRef.current = setTimeout(() => {
      setIsInviteCopied(false);
      copyFeedbackTimeoutRef.current = null;
    }, 2000);
  };

  return (
    <UIScreen>
      <UIHeader
        title={state.list?.name ?? 'Lista'}
        onBack={() => router.back()}
        backIconNode={lucideIconNodes.chevronLeft}
        rightSlot={
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
        }
      />

      <UIMessage tone="error" message={state.error} className="mb-3" />

      <UICard
        className="mb-3"
        style={{
          backgroundColor: colors.primarySoft,
          borderColor: colors.primary,
        }}
      >
        <View className="gap-1">
          <Text style={{ color: colors.text }} className="text-sm font-semibold">
            Resumo financeiro
          </Text>

          <View className="flex-row items-center justify-between">
            <Text style={{ color: colors.textMuted }} className="text-sm">
              Total
            </Text>
            <Text style={{ color: colors.text }} className="text-sm font-semibold">
              {formatCurrencyBRL(priceSummary.totalPriceCents)}
            </Text>
          </View>

          <View className="flex-row items-center justify-between">
            <Text style={{ color: colors.textMuted }} className="text-sm">
              Marcado
            </Text>
            <Text style={{ color: colors.success }} className="text-sm font-semibold">
              {formatCurrencyBRL(priceSummary.purchasedPriceCents)}
            </Text>
          </View>

          <View className="flex-row items-center justify-between">
            <Text style={{ color: colors.textMuted }} className="text-sm">
              Não marcado
            </Text>
            <Text style={{ color: colors.warning }} className="text-sm font-semibold">
              {formatCurrencyBRL(priceSummary.unpurchasedPriceCents)}
            </Text>
          </View>
        </View>
      </UICard>

      <FlatList
        data={state.items}
        keyExtractor={item => item.id}
        contentContainerClassName="gap-3 pb-10"
        refreshing={state.isLoading}
        onRefresh={actions.loadData}
        ListEmptyComponent={
          state.isLoading ? null : (
            <UICard className="p-6">
              <Text style={{ color: colors.textMuted }} className="text-center">
                Nenhum item nesta lista. Toque no + para adicionar.
              </Text>
            </UICard>
          )
        }
        renderItem={({ item }) => (
          <UICard className="relative">
            <Pressable
              onPress={() => {
                setItemMenuTargetId(null);
                actions.togglePurchased(item);
              }}
              accessibilityLabel={
                item.isPurchased
                  ? 'Desmarcar item como comprado'
                  : 'Marcar item como comprado'
              }
              className="w-full flex-row items-center gap-3"
            >
              <View
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
              </View>

              <View className="flex-1 flex-row items-center gap-2">
                <Text
                  numberOfLines={1}
                  style={{ color: item.isPurchased ? colors.textMuted : colors.text }}
                  className={
                    item.isPurchased
                      ? 'flex-1 text-base font-semibold line-through'
                      : 'flex-1 text-base font-semibold'
                  }
                >
                  {item.title}
                </Text>

                <Text style={{ color: colors.textMuted }} className="text-sm">
                  {item.quantity ?? '-'} {item.unit ?? ''}
                </Text>

                {item.priceCents !== null ? (
                  <Text style={{ color: colors.success }} className="text-sm font-semibold">
                    {formatCurrencyBRL(item.priceCents)}
                  </Text>
                ) : null}
              </View>

              <UIIconButton
                iconNode={lucideIconNodes.ellipsisVertical}
                size="sm"
                accessibilityLabel={`Abrir ações de ${item.title}`}
                onPress={event => {
                  event.stopPropagation();
                  setItemMenuTargetId(current => (current === item.id ? null : item.id));
                }}
              />
            </Pressable>

            {itemMenuTargetId === item.id ? (
              <View
                className="absolute right-2 top-11 z-20 rounded-2xl border p-2"
                style={{
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                  minWidth: 170,
                }}
              >
                <Pressable
                  onPress={event => {
                    event.stopPropagation();
                    setItemMenuTargetId(null);
                    actions.startEdit(item);
                  }}
                  className="my-1 flex-row items-center justify-between rounded-xl px-3 py-2"
                  style={{ backgroundColor: colors.surfaceElevated }}
                >
                  <Text style={{ color: colors.text }} className="font-medium">
                    Editar item
                  </Text>
                  <UILucideIcon iconNode={lucideIconNodes.pencil} size={16} color={colors.text} />
                </Pressable>

                <Pressable
                  onPress={event => {
                    event.stopPropagation();
                    setItemMenuTargetId(null);
                    onOpenDeleteItemDialog(item.id, item.title);
                  }}
                  className="my-1 flex-row items-center justify-between rounded-xl px-3 py-2"
                  style={{ backgroundColor: colors.dangerSoft }}
                >
                  <Text style={{ color: colors.danger }} className="font-medium">
                    Excluir item
                  </Text>
                  <UILucideIcon iconNode={lucideIconNodes.trash2} size={16} color={colors.danger} />
                </Pressable>
              </View>
            ) : null}
          </UICard>
        )}
      />

      <UIModal
        visible={state.isInviteModalOpen}
        title="Link de convite"
        onClose={actions.closeInviteModal}
      >
        {invite.hasInvite ? null : (
          <UIMessage
            tone="info"
            message="Ainda não existe um link para essa lista. Gere um novo link para compartilhar."
          />
        )}

        {invite.hasInvite ? (
          <View className="gap-2">
            <View
              className="flex-row items-center rounded-xl border px-3 py-2"
              style={{
                backgroundColor: colors.surfaceElevated,
                borderColor: colors.border,
              }}
            >
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={{ color: colors.text }}
                className="flex-1 text-sm"
              >
                {invite.url}
              </Text>

              <Pressable
                onPress={onCopyInviteLink}
                disabled={!invite.url || invite.isExpired}
                accessibilityLabel="Copiar link de convite"
                className="ml-2 h-8 w-8 items-center justify-center rounded-lg"
                style={{
                  backgroundColor:
                    !invite.url || invite.isExpired ? colors.surface : colors.primarySoft,
                  opacity: !invite.url || invite.isExpired ? 0.8 : 1,
                }}
              >
                <Animated.View
                  style={{
                    opacity: copyIconAnim,
                    transform: [
                      {
                        scale: copyIconAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0.86, 1],
                        }),
                      },
                    ],
                  }}
                >
                  <UILucideIcon
                    iconNode={isInviteCopied ? lucideIconNodes.circleCheck : lucideIconNodes.copy}
                    size={16}
                    color={
                      isInviteCopied
                        ? colors.success
                        : !invite.url || invite.isExpired
                          ? colors.textMuted
                          : colors.primary
                    }
                  />
                </Animated.View>
              </Pressable>
            </View>

            <Text style={{ color: colors.textMuted }} className="text-sm">
              {formattedInviteExpiration
                ? `Expira em: ${formattedInviteExpiration}`
                : 'Sem data de expiração definida'}
            </Text>

            {invite.isExpired ? (
              <UIMessage
                tone="error"
                message="Esse link está vencido. Gere um novo link para compartilhar novamente."
              />
            ) : null}
          </View>
        ) : null}

        <View className="mt-4">
          <UIButton
            label="Gerar novo link"
            onPress={actions.generateNewInvite}
            loading={state.isInviteBusy}
            loadingLabel="Gerando..."
            disabled={state.isInviteBusy}
            containerClassName="w-full"
          />
        </View>
      </UIModal>

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
                returnKeyType="next"
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
                  returnKeyType="next"
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
                  returnKeyType="next"
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
                returnKeyType="send"
                onSubmitEditing={submitItemForm}
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
            onPress={submitItemForm}
            containerClassName="flex-1"
          />
        </View>
      </UIModal>

      <UIConfirmDialog
        visible={Boolean(itemPendingDelete)}
        title="Excluir item"
        message={itemPendingDelete ? `Deseja remover "${itemPendingDelete.title}" da lista?` : ''}
        confirmLabel="Excluir"
        onCancel={onCloseDeleteItemDialog}
        onConfirm={onConfirmDeleteItem}
      />
      <UIMenu visible={isMenuOpen} onClose={() => setIsMenuOpen(false)} items={menuItems} />
    </UIScreen>
  );
};

