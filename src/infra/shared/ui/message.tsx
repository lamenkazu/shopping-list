import { Text } from 'react-native';

export type UIMessageTone = 'error' | 'success' | 'info';

export interface UIMessageProps {
  tone: UIMessageTone;
  message?: string | null;
  className?: string;
}

const toneClassMap: Record<UIMessageTone, string> = {
  error: 'text-red-600',
  success: 'text-emerald-700',
  info: 'text-zinc-600 dark:text-zinc-300',
};

export const UIMessage = ({ tone, message, className }: UIMessageProps) => {
  if (!message) {
    return null;
  }

  return (
    <Text className={`text-sm ${toneClassMap[tone]} ${className ?? ''}`.trim()}>{message}</Text>
  );
};
