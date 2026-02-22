import { useAppColors } from '@infra/shared/theme/use-app-colors';
import type { ReactNode } from 'react';
import type { TextInputProps } from 'react-native';
import { Pressable, Text, TextInput, View } from 'react-native';

export interface UIInputProps extends Omit<TextInputProps, 'value' | 'onChangeText'> {
  value: string;
  onChangeText: (text: string) => void;
  errorMessage?: string;
  containerClassName?: string;
  inputClassName?: string;
  errorClassName?: string;
  rightAccessory?: ReactNode;
  onPressRightAccessory?: () => void;
  rightAccessoryAccessibilityLabel?: string;
}

export const UIInput = ({
  value,
  onChangeText,
  errorMessage,
  placeholderTextColor,
  containerClassName,
  inputClassName,
  errorClassName,
  rightAccessory,
  onPressRightAccessory,
  rightAccessoryAccessibilityLabel,
  ...rest
}: UIInputProps) => {
  const colors = useAppColors();

  return (
    <View className={containerClassName}>
      <View className="relative">
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholderTextColor={placeholderTextColor ?? colors.placeholder}
          style={{
            backgroundColor: colors.inputBackground,
            borderColor: errorMessage ? colors.danger : colors.border,
            color: colors.text,
          }}
          className={`rounded-xl border px-4 py-3 ${rightAccessory ? 'pr-12' : ''} ${inputClassName ?? ''}`.trim()}
          {...rest}
        />

        {rightAccessory ? (
          <Pressable
            onPress={onPressRightAccessory}
            accessibilityRole="button"
            accessibilityLabel={rightAccessoryAccessibilityLabel}
            className="absolute bottom-0 right-0 top-0 w-12 items-center justify-center"
          >
            {rightAccessory}
          </Pressable>
        ) : null}
      </View>

      {errorMessage ? (
        <Text
          style={{ color: colors.danger }}
          className={`mt-1 text-sm ${errorClassName ?? ''}`.trim()}
        >
          {errorMessage}
        </Text>
      ) : null}
    </View>
  );
};
