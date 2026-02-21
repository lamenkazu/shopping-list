import { Pressable, Text, View } from 'react-native';

import { useProfileViewModel } from './view-model';

export function ProfileView() {
  const { state, actions, user } = useProfileViewModel();

  return (
    <View className="flex-1 bg-zinc-100 px-4 py-5 dark:bg-zinc-900">
      <View className="rounded-2xl bg-white p-5 dark:bg-zinc-800">
        <Text className="text-xl font-bold text-zinc-900 dark:text-zinc-100">Profile</Text>
        <Text className="mt-2 text-zinc-600 dark:text-zinc-300">
          Email: {user?.email ?? 'Unknown'}
        </Text>

        {state.error ? <Text className="mt-3 text-sm text-red-600">{state.error}</Text> : null}

        <Pressable onPress={actions.onSignOut} className="mt-6 rounded-xl bg-red-600 px-4 py-3">
          <Text className="text-center font-semibold text-white">Sign out</Text>
        </Pressable>
      </View>
    </View>
  );
}
