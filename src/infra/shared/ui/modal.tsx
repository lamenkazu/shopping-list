import { useAppColors } from '@infra/shared/theme/use-app-colors';
import type { ReactNode } from 'react';
import { Modal, Pressable, Text, View } from 'react-native';

export interface UIModalProps {
  visible: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
}

export const UIModal = ({ visible, title, onClose, children }: UIModalProps) => {
  const colors = useAppColors();

  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
      <Pressable
        onPress={onClose}
        className="flex-1 items-center justify-center px-5"
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.35)' }}
      >
        <Pressable
          onPress={event => event.stopPropagation()}
          className="w-full rounded-3xl border p-5"
          style={{ backgroundColor: colors.surface, borderColor: colors.border }}
        >
          <Text style={{ color: colors.text }} className="text-lg font-semibold">
            {title}
          </Text>

          <View className="mt-4">{children}</View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};
