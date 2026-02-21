import { Controller } from 'react-hook-form';
import { FlatList, Pressable, Text, TextInput, View } from 'react-native';

import { useListDetailsViewModel } from './view-model';

export function ListDetailsView() {
  const { form, state, actions, isEditing } = useListDetailsViewModel();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = form;

  return (
    <View className="flex-1 bg-zinc-100 px-4 py-5 dark:bg-zinc-900">
      <View className="mb-4 rounded-2xl bg-white p-4 dark:bg-zinc-800">
        <Text className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
          {state.list?.name ?? 'List'}
        </Text>

        <Pressable
          onPress={actions.generateInvite}
          className="mt-3 rounded-xl bg-blue-600 px-4 py-3"
        >
          <Text className="text-center font-semibold text-white">Generate invite link</Text>
        </Pressable>

        {state.generatedInvite ? (
          <Text className="mt-2 text-xs text-zinc-500 dark:text-zinc-300">
            Latest invite: {state.generatedInvite}
          </Text>
        ) : null}
      </View>

      <View className="mb-4 rounded-2xl bg-white p-4 dark:bg-zinc-800">
        <Text className="mb-2 font-semibold text-zinc-700 dark:text-zinc-200">
          {isEditing ? 'Edit item' : 'New item'}
        </Text>

        <View className="gap-2">
          <Controller
            control={control}
            name="title"
            render={({ field: { onChange, value } }) => (
              <>
                <TextInput
                  value={value}
                  onChangeText={text => {
                    actions.clearError();
                    onChange(text);
                  }}
                  placeholder="Item title"
                  placeholderTextColor="#71717a"
                  className="rounded-xl border border-zinc-300 px-4 py-3 text-zinc-900 dark:border-zinc-700 dark:text-zinc-100"
                />
                {errors.title?.message ? (
                  <Text className="text-sm text-red-600">{errors.title.message}</Text>
                ) : null}
              </>
            )}
          />

          <View className="flex-row gap-2">
            <Controller
              control={control}
              name="quantity"
              render={({ field: { onChange, value } }) => (
                <>
                  <TextInput
                    value={value ?? ''}
                    onChangeText={text => {
                      actions.clearError();
                      onChange(text);
                    }}
                    placeholder="Qty"
                    placeholderTextColor="#71717a"
                    keyboardType="decimal-pad"
                    className="flex-1 rounded-xl border border-zinc-300 px-4 py-3 text-zinc-900 dark:border-zinc-700 dark:text-zinc-100"
                  />
                </>
              )}
            />
            <Controller
              control={control}
              name="unit"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  value={value ?? ''}
                  onChangeText={text => {
                    actions.clearError();
                    onChange(text);
                  }}
                  placeholder="Unit"
                  placeholderTextColor="#71717a"
                  className="flex-1 rounded-xl border border-zinc-300 px-4 py-3 text-zinc-900 dark:border-zinc-700 dark:text-zinc-100"
                />
              )}
            />
          </View>

          {errors.quantity?.message ? (
            <Text className="text-sm text-red-600">{errors.quantity.message}</Text>
          ) : null}
        </View>

        {state.error ? <Text className="mt-3 text-sm text-red-600">{state.error}</Text> : null}

        <Pressable
          disabled={state.isBusy}
          onPress={handleSubmit(actions.submitItem)}
          className="mt-3 rounded-xl bg-zinc-900 px-4 py-3 dark:bg-zinc-100"
        >
          <Text className="text-center font-semibold text-zinc-100 dark:text-zinc-900">
            {state.isBusy ? 'Saving...' : isEditing ? 'Save changes' : 'Add item'}
          </Text>
        </Pressable>

        {isEditing ? (
          <Pressable
            onPress={actions.cancelEdit}
            className="mt-2 rounded-xl bg-zinc-200 px-4 py-3 dark:bg-zinc-700"
          >
            <Text className="text-center font-medium text-zinc-800 dark:text-zinc-100">
              Cancel edit
            </Text>
          </Pressable>
        ) : null}
      </View>

      <FlatList
        data={state.items}
        keyExtractor={item => item.id}
        contentContainerClassName="gap-3 pb-10"
        refreshing={state.isLoading}
        onRefresh={actions.loadData}
        renderItem={({ item }) => (
          <View className="rounded-2xl bg-white p-4 dark:bg-zinc-800">
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
              <Pressable
                onPress={() => actions.togglePurchased(item)}
                className={`flex-1 rounded-lg px-3 py-2 ${
                  item.isPurchased
                    ? 'bg-amber-200 dark:bg-amber-700'
                    : 'bg-emerald-200 dark:bg-emerald-700'
                }`}
              >
                <Text className="text-center font-medium text-zinc-900 dark:text-zinc-100">
                  {item.isPurchased ? 'Unmark' : 'Mark purchased'}
                </Text>
              </Pressable>

              <Pressable
                onPress={() => actions.startEdit(item)}
                className="flex-1 rounded-lg bg-zinc-200 px-3 py-2 dark:bg-zinc-700"
              >
                <Text className="text-center font-medium text-zinc-900 dark:text-zinc-100">
                  Edit
                </Text>
              </Pressable>

              <Pressable
                onPress={() => actions.deleteItem(item.id)}
                className="flex-1 rounded-lg bg-red-100 px-3 py-2 dark:bg-red-900/40"
              >
                <Text className="text-center font-medium text-red-700 dark:text-red-300">
                  Delete
                </Text>
              </Pressable>
            </View>
          </View>
        )}
      />
    </View>
  );
}
