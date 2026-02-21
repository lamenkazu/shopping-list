import { Stack } from 'expo-router';

export default function PrivateLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'My lists' }} />
      <Stack.Screen name="lists/[listId]" options={{ title: 'List details' }} />
      <Stack.Screen name="invite/[token]" options={{ title: 'Join list' }} />
      <Stack.Screen name="profile" options={{ title: 'Profile' }} />
    </Stack>
  );
}
