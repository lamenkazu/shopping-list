import { useAppColors } from '@infra/shared/theme/use-app-colors';
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
  const colors = useAppColors();

  return (
    <View
      style={{
        backgroundColor: colors.surface,
        borderColor: colors.border,
      }}
      className={`rounded-2xl border p-4 ${className ?? ''}`.trim()}
    >
      {title ? (
        <Text style={{ color: colors.text }} className={`text-xl font-bold ${titleClassName ?? ''}`.trim()}>
          {title}
        </Text>
      ) : null}

      {subtitle ? (
        <Text
          style={{ color: colors.textMuted }}
          className={`mt-2 ${subtitleClassName ?? ''}`.trim()}
        >
          {subtitle}
        </Text>
      ) : null}

      {children ? (
        <View className={`${title || subtitle ? 'mt-3' : ''} ${contentClassName ?? ''}`.trim()}>
          {children}
        </View>
      ) : null}
    </View>
  );
};
