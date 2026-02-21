import { useAppColors } from '@infra/shared/theme/use-app-colors';
import type { ReactNode } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

export interface UIScreenProps {
  children: ReactNode;
  centered?: boolean;
  padded?: boolean;
  className?: string;
}

export const UIScreen = ({ children, centered, padded = true, className }: UIScreenProps) => {
  const colors = useAppColors();

  return (
    <SafeAreaView
      edges={['top', 'left', 'right']}
      style={{ backgroundColor: colors.background }}
      className={`flex-1 ${centered ? 'items-center justify-center' : ''} ${padded ? 'px-4 pt-5 pb-5' : ''} ${className ?? ''}`.trim()}
    >
      {children}
    </SafeAreaView>
  );
};
