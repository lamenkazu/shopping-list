import { Pressable, Text, View } from 'react-native';

import { useAcceptInviteViewModel } from './view-model';

export function AcceptInviteView() {
  const { state, actions } = useAcceptInviteViewModel();

  return (
    <View className="flex-1 items-center justify-center bg-zinc-100 px-6 dark:bg-zinc-900">
      <View className="w-full rounded-3xl bg-white p-6 dark:bg-zinc-800">
        <Text className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
          Join shopping list
        </Text>
        <Text className="mt-2 text-zinc-600 dark:text-zinc-300">
          You were invited to collaborate on a list.
        </Text>

        {state.error ? <Text className="mt-3 text-sm text-red-600">{state.error}</Text> : null}

        <Pressable
          disabled={state.isSubmitting}
          onPress={actions.acceptInvite}
          className="mt-6 rounded-xl bg-zinc-900 px-4 py-3 dark:bg-zinc-100"
        >
          <Text className="text-center font-semibold text-zinc-100 dark:text-zinc-900">
            {state.isSubmitting ? 'Joining...' : 'Accept invite'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
