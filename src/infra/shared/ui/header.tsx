import { useAppColors } from '@infra/shared/theme/use-app-colors';
import type { ReactNode } from 'react';
import { Text, View } from 'react-native';

import type { LucideIconNode } from '@infra/shared/ui/lucide-icon';
import { UIIconButton } from '@infra/shared/ui/icon-button';

export interface UIHeaderProps {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  rightSlot?: ReactNode;
  backIconNode?: LucideIconNode;
  className?: string;
}

export const UIHeader = ({
  title,
  subtitle,
  onBack,
  rightSlot,
  backIconNode,
  className,
}: UIHeaderProps) => {
  const colors = useAppColors();

  return (
    <View className={`mb-4 ${className ?? ''}`.trim()}>
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-2">
          {onBack && backIconNode ? (
            <UIIconButton
              iconNode={backIconNode}
              size="md"
              onPress={onBack}
              accessibilityLabel="Voltar"
            />
          ) : null}

          <View>
            <Text style={{ color: colors.text }} className="text-2xl font-bold">
              {title}
            </Text>
            {subtitle ? (
              <Text style={{ color: colors.textMuted }} className="mt-0.5 text-sm">
                {subtitle}
              </Text>
            ) : null}
          </View>
        </View>

        {rightSlot}
      </View>
    </View>
  );
};
