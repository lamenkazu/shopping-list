import { useAppColors } from '@infra/shared/theme/use-app-colors';
import { UIIconButton } from '@infra/shared/ui/icon-button';
import { lucideIconNodes } from '@infra/shared/ui/icon-nodes';
import { Text, View } from 'react-native';

export type UIToastTone = 'success' | 'error' | 'info';

export interface UIToastProps {
  message: string;
  tone?: UIToastTone;
  onClose?: () => void;
}

export const UIToast = ({ message, tone = 'info', onClose }: UIToastProps) => {
  const colors = useAppColors();

  const toneStyle = {
    success: {
      backgroundColor: colors.successSoft,
      borderColor: colors.success,
      textColor: colors.text,
    },
    error: {
      backgroundColor: colors.dangerSoft,
      borderColor: colors.danger,
      textColor: colors.text,
    },
    info: {
      backgroundColor: colors.infoSoft,
      borderColor: colors.info,
      textColor: colors.text,
    },
  }[tone];

  return (
    <View
      style={{
        backgroundColor: toneStyle.backgroundColor,
        borderColor: toneStyle.borderColor,
      }}
      className="mx-4 mb-3 flex-row items-center gap-2 rounded-xl border px-3 py-3"
    >
      <Text style={{ color: toneStyle.textColor }} className="flex-1 text-sm font-medium">
        {message}
      </Text>

      {onClose ? (
        <UIIconButton
          iconNode={lucideIconNodes.x}
          size="sm"
          onPress={onClose}
          accessibilityLabel="Fechar aviso"
        />
      ) : null}
    </View>
  );
};
