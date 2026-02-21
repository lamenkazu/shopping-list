import { useAppColors } from '@infra/shared/theme/use-app-colors';
import type { PressableProps, StyleProp, TextStyle, ViewStyle } from 'react-native';
import { Pressable, Text } from 'react-native';

export type UIButtonVariant =
  | 'primary'
  | 'secondary'
  | 'danger'
  | 'dangerSoft'
  | 'info'
  | 'success'
  | 'warning';

export type UIButtonSize = 'md' | 'sm';

export interface UIButtonProps
  extends Pick<PressableProps, 'onPress' | 'testID' | 'accessibilityLabel'> {
  label: string;
  disabled?: boolean;
  loading?: boolean;
  loadingLabel?: string;
  variant?: UIButtonVariant;
  size?: UIButtonSize;
  containerClassName?: string;
  labelClassName?: string;
}

const containerSizeClassMap: Record<UIButtonSize, string> = {
  md: 'rounded-xl px-4 py-3',
  sm: 'rounded-lg px-3 py-2',
};

const labelSizeClassMap: Record<UIButtonSize, string> = {
  md: 'font-semibold',
  sm: 'text-sm font-medium',
};

export const UIButton = ({
  label,
  disabled,
  loading,
  loadingLabel,
  onPress,
  testID,
  accessibilityLabel,
  variant = 'primary',
  size = 'md',
  containerClassName,
  labelClassName,
}: UIButtonProps) => {
  const colors = useAppColors();
  const isDisabled = Boolean(disabled || loading);

  const containerVariantStyleMap: Record<UIButtonVariant, StyleProp<ViewStyle>> = {
    primary: {
      backgroundColor: colors.primary,
    },
    secondary: {
      backgroundColor: colors.surfaceElevated,
      borderColor: colors.border,
      borderWidth: 1,
    },
    danger: {
      backgroundColor: colors.danger,
    },
    dangerSoft: {
      backgroundColor: colors.dangerSoft,
      borderColor: colors.danger,
      borderWidth: 1,
    },
    info: {
      backgroundColor: colors.info,
    },
    success: {
      backgroundColor: colors.success,
    },
    warning: {
      backgroundColor: colors.warning,
    },
  };

  const labelVariantStyleMap: Record<UIButtonVariant, StyleProp<TextStyle>> = {
    primary: { color: colors.primaryContrast },
    secondary: { color: colors.text },
    danger: { color: colors.textInverse },
    dangerSoft: { color: colors.dangerContrast },
    info: { color: colors.textInverse },
    success: { color: colors.textInverse },
    warning: { color: colors.textInverse },
  };

  return (
    <Pressable
      disabled={isDisabled}
      onPress={onPress}
      testID={testID}
      accessibilityLabel={accessibilityLabel}
      style={[containerVariantStyleMap[variant], isDisabled ? { opacity: 0.6 } : null]}
      className={`${containerSizeClassMap[size]} ${containerClassName ?? ''}`.trim()}
    >
      <Text
        style={labelVariantStyleMap[variant]}
        className={`text-center ${labelSizeClassMap[size]} ${labelClassName ?? ''}`.trim()}
      >
        {loading ? (loadingLabel ?? label) : label}
      </Text>
    </Pressable>
  );
};
