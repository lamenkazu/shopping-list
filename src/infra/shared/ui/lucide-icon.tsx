import { Feather } from '@expo/vector-icons';
import { lucideIconNodes } from '@infra/shared/ui/icon-nodes';
import type { StyleProp, TextStyle } from 'react-native';

export type LucideIconNode = ReadonlyArray<readonly [string, Record<string, unknown>]>;

export interface UILucideIconProps {
  iconNode: LucideIconNode;
  size?: number;
  color?: string;
  strokeWidth?: number;
  style?: StyleProp<TextStyle>;
}

const resolveFeatherName = (iconNode: LucideIconNode) => {
  if (iconNode === lucideIconNodes.plus) return 'plus';
  if (iconNode === lucideIconNodes.ellipsisVertical) return 'more-vertical';
  if (iconNode === lucideIconNodes.trash2) return 'trash-2';
  if (iconNode === lucideIconNodes.pencil) return 'edit-2';
  if (iconNode === lucideIconNodes.circle) return 'circle';
  if (iconNode === lucideIconNodes.circleCheck) return 'check-circle';
  if (iconNode === lucideIconNodes.chevronLeft) return 'chevron-left';
  if (iconNode === lucideIconNodes.user) return 'user';
  if (iconNode === lucideIconNodes.link) return 'link';
  if (iconNode === lucideIconNodes.eye) return 'eye';
  if (iconNode === lucideIconNodes.eyeOff) return 'eye-off';
  if (iconNode === lucideIconNodes.x) return 'x';
  if (iconNode === lucideIconNodes.copy) return 'copy';

  return 'circle';
};

export const UILucideIcon = ({
  iconNode,
  size = 20,
  color = '#111827',
  strokeWidth,
  style,
}: UILucideIconProps) => {
  const featherName = resolveFeatherName(iconNode);

  return (
    <Feather
      name={featherName}
      size={size}
      color={color}
      style={style}
      // Mantido para compatibilidade da assinatura do componente
      strokeWidth={strokeWidth}
    />
  );
};
