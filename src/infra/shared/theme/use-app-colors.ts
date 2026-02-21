import { useColorScheme } from '@infra/shared/hooks/use-color-scheme';
import { Colors } from '@infra/shared/theme/theme';

export const useAppColors = () => {
  const mode = useColorScheme() ?? 'light';
  return Colors[mode];
};
