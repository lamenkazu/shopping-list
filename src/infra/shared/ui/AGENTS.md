# Shared UI Components

Este diretório contém componentes reutilizáveis e genéricos de UI.

## Objetivo
- Centralizar estilos e padrões visuais comuns.
- Reduzir Tailwind repetido em `view.tsx`.
- Manter tipagem explícita via interfaces de props.

## Componentes Disponíveis

### `screen.tsx`
Wrapper de tela padrão.

Props (`UIScreenProps`):
- `children: ReactNode`
- `centered?: boolean`
- `padded?: boolean` (default: `true`)
- `className?: string`

### `card.tsx`
Card genérico com título/subtítulo opcionais.

Props (`UICardProps`):
- `children?: ReactNode`
- `title?: string`
- `subtitle?: string`
- `className?: string`
- `titleClassName?: string`
- `subtitleClassName?: string`
- `contentClassName?: string`

### `section.tsx`
Composição pronta de `UIScreen + UICard` para seções com foco em título/subtítulo e conteúdo.

Props (`UISectionProps`):
- `title: string`
- `subtitle?: string`
- `children: ReactNode`
- `containerClassName?: string`
- `cardClassName?: string`
- `contentClassName?: string`

### `button.tsx`
Botão baseado em `Pressable`, com variações visuais reutilizáveis.

Props (`UIButtonProps`):
- `label: string`
- `disabled?: boolean`
- `loading?: boolean`
- `loadingLabel?: string`
- `variant?: 'primary' | 'secondary' | 'danger' | 'dangerSoft' | 'info' | 'success' | 'warning'`
- `size?: 'md' | 'sm'`
- `onPress?: () => void`
- `testID?: string`
- `accessibilityLabel?: string`
- `containerClassName?: string`
- `labelClassName?: string`

### `input.tsx`
Input reutilizável com mensagem de erro acoplada.

Props (`UIInputProps`):
- herda `TextInputProps` (exceto `value` e `onChangeText`)
- `value: string`
- `onChangeText: (text: string) => void`
- `errorMessage?: string`
- `containerClassName?: string`
- `inputClassName?: string`
- `errorClassName?: string`

### `message.tsx`
Mensagem de feedback com tom visual.

Props (`UIMessageProps`):
- `tone: 'error' | 'success' | 'info'`
- `message?: string | null`
- `className?: string`

### `text-link-button.tsx`
Botão textual baseado em `Pressable`, ideal para links com `Link asChild` do Expo Router.

Props (`UITextLinkButtonProps`):
- `label: string`
- `align?: 'left' | 'center' | 'right'`
- `onPress?: () => void`
- `disabled?: boolean`
- `testID?: string`
- `containerClassName?: string`
- `labelClassName?: string`

### `theme-mode-toggle.tsx`
Componente de alternância de aparência (light/dark).

Props (`UIThemeModeToggleProps`):
- `mode: 'light' | 'dark'`
- `onChange: (mode: 'light' | 'dark') => void`
- `className?: string`

### `lucide-icon.tsx`
Renderização de ícones Lucide via `iconNode` em ambiente React Native.

Props (`UILucideIconProps`):
- `iconNode: LucideIconNode`
- `size?: number`
- `color?: string`
- `strokeWidth?: number`
- `style?: StyleProp<ViewStyle>`

### `icon-nodes.ts`
Catálogo local dos `iconNode` utilizados no app.

Uso:
```ts
lucideIconNodes.plus
lucideIconNodes.trash2
lucideIconNodes.ellipsisVertical
```

### `icon-button.tsx`
Botão de ícone reutilizável com temas (`default` e `danger`).

Props (`UIIconButtonProps`):
- `iconNode: LucideIconNode`
- `size?: 'sm' | 'md'`
- `tone?: 'default' | 'danger'`
- `onPress?: () => void`
- `disabled?: boolean`
- `testID?: string`
- `accessibilityLabel?: string`
- `containerClassName?: string`

### `header.tsx`
Header visual da tela (custom) com suporte a voltar e ações à direita.

Props (`UIHeaderProps`):
- `title: string`
- `subtitle?: string`
- `onBack?: () => void`
- `rightSlot?: ReactNode`
- `backIconNode?: LucideIconNode`
- `className?: string`

### `modal.tsx`
Modal genérica com card de conteúdo.

Props (`UIModalProps`):
- `visible: boolean`
- `title: string`
- `onClose: () => void`
- `children: ReactNode`

### `menu.tsx`
Menu de ações em overlay para opções rápidas (ex.: menu de 3 pontos).

Props:
- `UIMenuProps`
- `UIMenuItem`

## Convenções
- `shared/ui` deve permanecer genérico (sem semântica de feature).
- Se um componente for específico de domínio/tela, criar em `modules/<feature>/components`.
- Componentes de `shared/ui` não devem conter regra de negócio.
- Priorizar composição de `screen`, `card`, `button`, `input`, `icon-button`, `header`, `modal` e `menu` antes de adicionar Tailwind direto nas views.

## Tema
- Os componentes base de UI usam o tema central (`src/infra/shared/theme/theme.ts`) via `useAppColors`.
- Evitar hardcode de cores Tailwind em componentes compartilhados.
