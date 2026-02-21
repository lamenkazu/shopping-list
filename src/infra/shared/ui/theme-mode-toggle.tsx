import { UIButton } from '@infra/shared/ui/button';
import { useAppColors } from '@infra/shared/theme/use-app-colors';
import type { ThemeMode } from '@infra/app/providers/theme-provider';
import { Text, View } from 'react-native';

export interface UIThemeModeToggleProps {
  mode: ThemeMode;
  onChange: (mode: ThemeMode) => void;
  className?: string;
}

export const UIThemeModeToggle = ({ mode, onChange, className }: UIThemeModeToggleProps) => {
  const colors = useAppColors();

  return (
    <View className={className}>
      <Text style={{ color: colors.textMuted }} className="mb-2 text-sm font-medium">
        Aparência
      </Text>

      <View className="flex-row gap-2">
        <UIButton
          label="Claro"
          size="sm"
          variant={mode === 'light' ? 'primary' : 'secondary'}
          onPress={() => onChange('light')}
          containerClassName="flex-1"
        />

        <UIButton
          label="Escuro"
          size="sm"
          variant={mode === 'dark' ? 'primary' : 'secondary'}
          onPress={() => onChange('dark')}
          containerClassName="flex-1"
        />
      </View>
    </View>
  );
};
