import { AuthProvider, useAuth } from '@infra/app/providers/auth-provider';
import { useColorScheme } from '@infra/shared/hooks/use-color-scheme';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, usePathname, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';

const AppNavigator = () => {
  const { isLoading, session } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isLoading) {
      return;
    }

    const firstSegment = String(segments[0] ?? '');
    const inPublicGroup = firstSegment === '(public)';

    if (!session && !inPublicGroup) {
      if (pathname && pathname !== '/') {
        router.replace({
          pathname: '/sign-in',
          params: { redirect: pathname },
        } as never);
      } else {
        router.replace('/sign-in' as never);
      }
      return;
    }

    if (session && inPublicGroup) {
      router.replace('/' as never);
    }
  }, [isLoading, pathname, router, segments, session]);

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-white dark:bg-black">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(public)" />
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
};

export const RootNavigator = () => {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AuthProvider>
        <AppNavigator />
      </AuthProvider>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
};
