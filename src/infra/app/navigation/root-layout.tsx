import { AuthProvider, useAuth } from '@infra/app/providers/auth-provider';
import { AppThemeProvider } from '@infra/app/providers/theme-provider';
import { useColorScheme } from '@infra/shared/hooks/use-color-scheme';
import { Colors } from '@infra/shared/theme/theme';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, usePathname, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const AppNavigator = () => {
  const { isLoading, session } = useAuth();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
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
      <View className="flex-1 items-center justify-center" style={{ backgroundColor: colors.background }}>
        <ActivityIndicator size="large" color={colors.primary} />
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

const RootNavigatorContent = () => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];

  const navigationTheme = colorScheme === 'dark'
    ? {
        ...DarkTheme,
        colors: {
          ...DarkTheme.colors,
          background: colors.background,
          card: colors.surface,
          border: colors.border,
          text: colors.text,
          primary: colors.primary,
          notification: colors.danger,
        },
      }
    : {
        ...DefaultTheme,
        colors: {
          ...DefaultTheme.colors,
          background: colors.background,
          card: colors.surface,
          border: colors.border,
          text: colors.text,
          primary: colors.primary,
          notification: colors.danger,
        },
      };

  return (
    <SafeAreaProvider>
      <ThemeProvider value={navigationTheme}>
        <AuthProvider>
          <AppNavigator />
        </AuthProvider>
        <StatusBar
          style={colorScheme === 'dark' ? 'light' : 'dark'}
          backgroundColor={colors.background}
          translucent
        />
      </ThemeProvider>
    </SafeAreaProvider>
  );
};

export const RootNavigator = () => {
  return (
    <AppThemeProvider>
      <RootNavigatorContent />
    </AppThemeProvider>
  );
};
