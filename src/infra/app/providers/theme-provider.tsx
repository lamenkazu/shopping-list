import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  createContext,
  type PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useColorScheme as useNativeWindColorScheme } from 'nativewind';

const THEME_STORAGE_KEY = '@realtime-shopping/theme-mode';

export type ThemeMode = 'light' | 'dark';

type ThemeContextValue = {
  mode: ThemeMode;
  isHydrated: boolean;
  setMode: (mode: ThemeMode) => Promise<void>;
  toggleMode: () => Promise<void>;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export const AppThemeProvider = ({ children }: PropsWithChildren) => {
  const { colorScheme, setColorScheme } = useNativeWindColorScheme();
  const [isHydrated, setIsHydrated] = useState(false);

  const mode: ThemeMode = colorScheme === 'dark' ? 'dark' : 'light';

  useEffect(() => {
    let isMounted = true;

    const loadThemePreference = async () => {
      try {
        const storedMode = await AsyncStorage.getItem(THEME_STORAGE_KEY);

        if (storedMode === 'light' || storedMode === 'dark') {
          setColorScheme(storedMode);
        }
      } catch {
        // Keep default system theme if persistence fails.
      } finally {
        if (isMounted) {
          setIsHydrated(true);
        }
      }
    };

    loadThemePreference();

    return () => {
      isMounted = false;
    };
  }, [setColorScheme]);

  const setMode = useCallback(
    async (nextMode: ThemeMode) => {
      setColorScheme(nextMode);

      try {
        await AsyncStorage.setItem(THEME_STORAGE_KEY, nextMode);
      } catch {
        // UI still changes even when persistence fails.
      }
    },
    [setColorScheme]
  );

  const toggleMode = useCallback(async () => {
    const nextMode: ThemeMode = mode === 'dark' ? 'light' : 'dark';
    await setMode(nextMode);
  }, [mode, setMode]);

  const contextValue = useMemo(
    () => ({
      mode,
      isHydrated,
      setMode,
      toggleMode,
    }),
    [isHydrated, mode, setMode, toggleMode]
  );

  return <ThemeContext.Provider value={contextValue}>{children}</ThemeContext.Provider>;
};

export const useAppTheme = () => {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('useAppTheme must be used within AppThemeProvider.');
  }

  return context;
};
