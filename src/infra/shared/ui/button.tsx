import type { PressableProps } from 'react-native';
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

const containerVariantClassMap: Record<UIButtonVariant, string> = {
  primary: 'bg-zinc-900 dark:bg-zinc-100',
  secondary: 'bg-zinc-200 dark:bg-zinc-700',
  danger: 'bg-red-600 dark:bg-red-700',
  dangerSoft: 'bg-red-100 dark:bg-red-900/40',
  info: 'bg-blue-600',
  success: 'bg-emerald-200 dark:bg-emerald-700',
  warning: 'bg-amber-200 dark:bg-amber-700',
};

const labelVariantClassMap: Record<UIButtonVariant, string> = {
  primary: 'text-zinc-100 dark:text-zinc-900',
  secondary: 'text-zinc-900 dark:text-zinc-100',
  danger: 'text-white',
  dangerSoft: 'text-red-700 dark:text-red-300',
  info: 'text-white',
  success: 'text-zinc-900 dark:text-zinc-100',
  warning: 'text-zinc-900 dark:text-zinc-100',
};

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
  const isDisabled = Boolean(disabled || loading);

  return (
    <Pressable
      disabled={isDisabled}
      onPress={onPress}
      testID={testID}
      accessibilityLabel={accessibilityLabel}
      className={`${containerSizeClassMap[size]} ${containerVariantClassMap[variant]} ${containerClassName ?? ''}`.trim()}
    >
      <Text
        className={`text-center ${labelSizeClassMap[size]} ${labelVariantClassMap[variant]} ${labelClassName ?? ''}`.trim()}
      >
        {loading ? (loadingLabel ?? label) : label}
      </Text>
    </Pressable>
  );
};
