import { UIButton } from '@infra/shared/ui/button';
import { UICard } from '@infra/shared/ui/card';
import { UIInput } from '@infra/shared/ui/input';
import { UIMessage } from '@infra/shared/ui/message';
import { UIScreen } from '@infra/shared/ui/screen';
import { Controller } from 'react-hook-form';
import { FlatList, Text, View } from 'react-native';
import { useListDetailsViewModel } from './view-model';

export const ListDetailsView = () => {
  const { form, state, actions, isEditing } = useListDetailsViewModel();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = form;

  return (
    <UIScreen>
      <UICard title={state.list?.name ?? 'Lista'} className="mb-4">
        <UIButton
          label="Gerar link de convite"
          variant="info"
          onPress={actions.generateInvite}
          containerClassName="mt-3"
        />

        <UIMessage
          tone="info"
          message={state.generatedInvite ? `Último convite: ${state.generatedInvite}` : null}
          className="mt-2 text-xs text-zinc-500 dark:text-zinc-300"
        />
      </UICard>

      <UICard
        title={isEditing ? 'Editar item' : 'Novo item'}
        className="mb-4"
        titleClassName="text-base font-semibold text-zinc-700 dark:text-zinc-200"
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
        </View>

        <UIMessage tone="error" message={state.error} className="mt-3" />

        <UIButton
          disabled={state.isBusy}
          loading={state.isBusy}
          loadingLabel="Salvando..."
          label={isEditing ? 'Salvar alterações' : 'Adicionar item'}
          onPress={handleSubmit(actions.submitItem)}
          containerClassName="mt-3"
        />

        {isEditing ? (
          <UIButton
            label="Cancelar edição"
            variant="secondary"
            onPress={actions.cancelEdit}
            containerClassName="mt-2"
          />
        ) : null}
      </UICard>

      <FlatList
        data={state.items}
        keyExtractor={item => item.id}
        contentContainerClassName="gap-3 pb-10"
        refreshing={state.isLoading}
        onRefresh={actions.loadData}
        renderItem={({ item }) => (
          <UICard>
            <Text
              className={`text-lg font-semibold ${
                item.isPurchased ? 'text-zinc-400 line-through' : 'text-zinc-900 dark:text-zinc-100'
              }`}
            >
              {item.title}
            </Text>

            <Text className="mt-1 text-sm text-zinc-500 dark:text-zinc-300">
              {item.quantity ?? '-'} {item.unit ?? ''}
            </Text>

            <View className="mt-3 flex-row gap-2">
              <UIButton
                label={item.isPurchased ? 'Desmarcar' : 'Marcar como comprado'}
                variant={item.isPurchased ? 'warning' : 'success'}
                size="sm"
                onPress={() => actions.togglePurchased(item)}
                containerClassName="flex-1"
              />

              <UIButton
                label="Editar"
                variant="secondary"
                size="sm"
                onPress={() => actions.startEdit(item)}
                containerClassName="flex-1"
              />

              <UIButton
                label="Excluir"
                variant="dangerSoft"
                size="sm"
                onPress={() => actions.deleteItem(item.id)}
                containerClassName="flex-1"
              />
            </View>
          </UICard>
        )}
      />
    </UIScreen>
  );
};

