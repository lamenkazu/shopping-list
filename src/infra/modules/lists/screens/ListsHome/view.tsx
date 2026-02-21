import { useRouter } from 'expo-router';
import { Controller } from 'react-hook-form';
import { Alert, FlatList, Pressable, Text, TextInput, View } from 'react-native';

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
    Alert.alert('Delete list', 'This action cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await actions.deleteList(listId);
        },
      },
    ]);
  };

  return (
    <View className="flex-1 bg-zinc-100 px-4 py-5 dark:bg-zinc-900">
      <View className="mb-4 flex-row items-center justify-between">
        <Text className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Shopping lists</Text>
        <Pressable
          onPress={() => router.push('/profile' as never)}
          className="rounded-lg bg-zinc-200 px-3 py-2 dark:bg-zinc-700"
        >
          <Text className="font-medium text-zinc-900 dark:text-zinc-100">Profile</Text>
        </Pressable>
      </View>

      <View className="mb-5 rounded-2xl bg-white p-4 dark:bg-zinc-800">
        <Text className="mb-2 font-medium text-zinc-700 dark:text-zinc-200">Create a list</Text>
        <Controller
          control={control}
          name="name"
          render={({ field: { onChange, value } }) => (
            <>
              <TextInput
                value={value}
                onChangeText={text => {
                  actions.clearError();
                  onChange(text);
                }}
                placeholder="Example: Family groceries"
                placeholderTextColor="#71717a"
                className="rounded-xl border border-zinc-300 px-4 py-3 text-zinc-900 dark:border-zinc-700 dark:text-zinc-100"
              />
              {errors.name?.message ? (
                <Text className="mt-2 text-sm text-red-600">{errors.name.message}</Text>
              ) : null}
            </>
          )}
        />

        <Pressable
          disabled={state.isCreating}
          onPress={handleSubmit(actions.submit)}
          className="mt-3 rounded-xl bg-zinc-900 px-4 py-3 dark:bg-zinc-100"
        >
          <Text className="text-center font-semibold text-zinc-100 dark:text-zinc-900">
            {state.isCreating ? 'Creating...' : 'Create list'}
          </Text>
        </Pressable>

        {state.error ? <Text className="mt-2 text-sm text-red-600">{state.error}</Text> : null}
      </View>

      {!state.lists.length && !state.isLoading ? (
        <View className="rounded-2xl bg-white p-6 dark:bg-zinc-800">
          <Text className="text-center text-zinc-600 dark:text-zinc-300">No lists yet.</Text>
        </View>
      ) : null}

      <FlatList
        data={state.lists}
        keyExtractor={item => item.id}
        refreshing={state.isLoading}
        onRefresh={actions.loadLists}
        contentContainerClassName="gap-3 pb-8"
        renderItem={({ item }) => (
          <View className="rounded-2xl bg-white p-4 dark:bg-zinc-800">
            <Pressable
              onPress={() =>
                router.push({ pathname: '/lists/[listId]', params: { listId: item.id } } as never)
              }
            >
              <Text className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                {item.name}
              </Text>
              <Text className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                Created at {new Date(item.createdAt).toLocaleString()}
              </Text>
            </Pressable>

            <Pressable
              onPress={() => onDeleteList(item.id)}
              className="mt-3 rounded-lg bg-red-100 px-3 py-2 dark:bg-red-900/40"
            >
              <Text className="text-center font-medium text-red-700 dark:text-red-300">
                Delete list
              </Text>
            </Pressable>
          </View>
        )}
      />
    </View>
  );
};
