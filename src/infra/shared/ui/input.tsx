import { useAppColors } from '@infra/shared/theme/use-app-colors';
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
  const colors = useAppColors();

  return (
    <View className={containerClassName}>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholderTextColor={placeholderTextColor ?? colors.placeholder}
        style={{
          backgroundColor: colors.inputBackground,
          borderColor: errorMessage ? colors.danger : colors.border,
          color: colors.text,
        }}
        className={`rounded-xl border px-4 py-3 ${inputClassName ?? ''}`.trim()}
        {...rest}
      />

      {errorMessage ? (
        <Text style={{ color: colors.danger }} className={`mt-1 text-sm ${errorClassName ?? ''}`.trim()}>
          {errorMessage}
        </Text>
      ) : null}
    </View>
  );
};
