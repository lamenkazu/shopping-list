import type { PressableProps } from 'react-native';
import { Pressable, Text } from 'react-native';

export interface UITextLinkButtonProps
  extends Pick<PressableProps, 'onPress' | 'disabled' | 'testID'> {
  label: string;
  align?: 'left' | 'center' | 'right';
  containerClassName?: string;
  labelClassName?: string;
}

const alignClassMap: Record<NonNullable<UITextLinkButtonProps['align']>, string> = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
};

export const UITextLinkButton = ({
  label,
  align = 'left',
  onPress,
  disabled,
  testID,
  containerClassName,
  labelClassName,
}: UITextLinkButtonProps) => {
  return (
    <Pressable onPress={onPress} disabled={disabled} testID={testID} className={containerClassName}>
      <Text
        className={`font-medium underline text-zinc-700 dark:text-zinc-200 ${alignClassMap[align]} ${labelClassName ?? ''}`.trim()}
      >
        {label}
      </Text>
    </Pressable>
  );
};
