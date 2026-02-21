import type { ReactNode } from 'react';
import { View } from 'react-native';

export interface UIScreenProps {
  children: ReactNode;
  centered?: boolean;
  padded?: boolean;
  className?: string;
}

export const UIScreen = ({ children, centered, padded = true, className }: UIScreenProps) => {
  return (
    <View
      className={`flex-1 bg-zinc-100 dark:bg-zinc-900 ${centered ? 'items-center justify-center' : ''} ${padded ? 'px-4 py-5' : ''} ${className ?? ''}`.trim()}
    >
      {children}
    </View>
  );
};
