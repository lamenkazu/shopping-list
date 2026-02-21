import { UIButton } from '@infra/shared/ui/button';
import { UICard } from '@infra/shared/ui/card';
import { UIInput } from '@infra/shared/ui/input';
import { UIMessage } from '@infra/shared/ui/message';
import { UIScreen } from '@infra/shared/ui/screen';
import { useRouter } from 'expo-router';
import { Controller } from 'react-hook-form';
import { Alert, FlatList, Pressable, Text, View } from 'react-native';
import { useListsHomeViewModel } from './view-model';

export const ListsHomeView = () => {
  const router = useRouter();
  const { form, state, actions } = useListsHomeViewModel();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = form;

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
      <View className="mb-4 flex-row items-center justify-between">
        <Text className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Listas de compras</Text>

        <UIButton
          label="Perfil"
          size="sm"
          variant="secondary"
          onPress={() => router.push('/profile' as never)}
        />
      </View>

      <UICard title="Criar uma lista" className="mb-5" titleClassName="text-base font-medium">
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
            />
          )}
        />

        <UIButton
          disabled={state.isCreating}
          loading={state.isCreating}
          loadingLabel="Criando..."
          label="Criar lista"
          onPress={handleSubmit(actions.submit)}
          containerClassName="mt-3"
        />

        <UIMessage tone="error" message={state.error} className="mt-2" />
      </UICard>

      {!state.lists.length && !state.isLoading ? (
        <UICard className="p-6">
          <Text className="text-center text-zinc-600 dark:text-zinc-300">Ainda não há listas.</Text>
        </UICard>
      ) : null}

      <FlatList
        data={state.lists}
        keyExtractor={item => item.id}
        refreshing={state.isLoading}
        onRefresh={actions.loadLists}
        contentContainerClassName="gap-3 pb-8"
        renderItem={({ item }) => (
          <UICard>
            <Pressable
              onPress={() =>
                router.push({ pathname: '/lists/[listId]', params: { listId: item.id } } as never)
              }
            >
              <Text className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                {item.name}
              </Text>
              <Text className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                Criada em {new Date(item.createdAt).toLocaleString()}
              </Text>
            </Pressable>

            <UIButton
              label="Excluir lista"
              variant="dangerSoft"
              size="sm"
              onPress={() => onDeleteList(item.id)}
              containerClassName="mt-3"
            />
          </UICard>
        )}
      />
    </UIScreen>
  );
};

