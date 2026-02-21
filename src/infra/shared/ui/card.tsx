import type { ReactNode } from 'react';
import { Text, View } from 'react-native';

export interface UICardProps {
  children?: ReactNode;
  title?: string;
  subtitle?: string;
  className?: string;
  titleClassName?: string;
  subtitleClassName?: string;
  contentClassName?: string;
}

export const UICard = ({
  children,
  title,
  subtitle,
  className,
  titleClassName,
  subtitleClassName,
  contentClassName,
}: UICardProps) => {
  return (
    <View className={`rounded-2xl bg-white p-4 dark:bg-zinc-800 ${className ?? ''}`.trim()}>
      {title ? (
        <Text className={`text-xl font-bold text-zinc-900 dark:text-zinc-100 ${titleClassName ?? ''}`.trim()}>
          {title}
        </Text>
      ) : null}

      {subtitle ? (
        <Text className={`mt-2 text-zinc-600 dark:text-zinc-300 ${subtitleClassName ?? ''}`.trim()}>
          {subtitle}
        </Text>
      ) : null}

      {children ? <View className={`${title || subtitle ? 'mt-3' : ''} ${contentClassName ?? ''}`.trim()}>{children}</View> : null}
    </View>
  );
};
