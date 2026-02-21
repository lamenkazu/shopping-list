import { Stack } from 'expo-router';

const PrivateLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="lists/[listId]" options={{ headerShown: false }} />
      <Stack.Screen name="invite/[token]" options={{ title: 'Entrar na lista' }} />
      <Stack.Screen name="profile" options={{ title: 'Perfil' }} />
    </Stack>
  );
};

export default PrivateLayout;
