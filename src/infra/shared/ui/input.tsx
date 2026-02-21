import type { TextInputProps } from 'react-native';
import { Text, TextInput, View } from 'react-native';

export interface UIInputProps extends Omit<TextInputProps, 'value' | 'onChangeText'> {
  value: string;
  onChangeText: (text: string) => void;
  errorMessage?: string;
  containerClassName?: string;
  inputClassName?: string;
  errorClassName?: string;
}

export const UIInput = ({
  value,
  onChangeText,
  errorMessage,
  placeholderTextColor,
  containerClassName,
  inputClassName,
  errorClassName,
  ...rest
}: UIInputProps) => {
  return (
    <View className={containerClassName}>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholderTextColor={placeholderTextColor ?? '#71717a'}
        className={`rounded-xl border border-zinc-300 px-4 py-3 text-zinc-900 dark:border-zinc-700 dark:text-zinc-100 ${inputClassName ?? ''}`.trim()}
        {...rest}
      />

      {errorMessage ? (
        <Text className={`mt-1 text-sm text-red-600 ${errorClassName ?? ''}`.trim()}>
          {errorMessage}
        </Text>
      ) : null}
    </View>
  );
};
