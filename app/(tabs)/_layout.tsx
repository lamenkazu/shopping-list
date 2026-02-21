import { Stack } from 'expo-router';

export default function PrivateLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Minhas listas' }} />
      <Stack.Screen name="lists/[listId]" options={{ title: 'Detalhes da lista' }} />
      <Stack.Screen name="invite/[token]" options={{ title: 'Entrar na lista' }} />
      <Stack.Screen name="profile" options={{ title: 'Perfil' }} />
    </Stack>
  );
}

