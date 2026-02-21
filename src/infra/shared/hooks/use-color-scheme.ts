import { useAppTheme } from '@infra/app/providers/theme-provider';

export const useColorScheme = () => {
  const { mode } = useAppTheme();
  return mode;
};
