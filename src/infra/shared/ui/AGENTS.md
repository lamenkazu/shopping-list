# Shared UI Components

Este diretório contém componentes reutilizáveis e genéricos de UI.

## Objetivo
- Centralizar estilos e padrões visuais comuns.
- Reduzir Tailwind repetido em `view.tsx`.
- Manter tipagem explícita via interfaces de props.

## Componentes Disponíveis

### `screen.tsx`
Wrapper de tela padrão.

### `card.tsx`
Card genérico com título/subtítulo opcionais.

### `section.tsx`
Composição pronta de `UIScreen + UICard` para seções com foco em título/subtítulo e conteúdo.

### `button.tsx`
Botão baseado em `Pressable`, com variações visuais reutilizáveis.

Props (`UIButtonProps`):
- `label: string`
- `disabled?: boolean`
- `loading?: boolean`
- `loadingLabel?: string`
- `variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'dangerSoft' | 'info' | 'success' | 'warning'`
- `size?: 'md' | 'sm'`
- `onPress?: () => void`
- `testID?: string`
- `accessibilityLabel?: string`
- `containerClassName?: string`
- `labelClassName?: string`

### `input.tsx`
Input reutilizável com mensagem de erro acoplada.

### `message.tsx`
Mensagem de feedback com tom visual (`error`, `success`, `info`).

### `toast.tsx`
Notificação temporária para feedback rápido ao usuário.

Props (`UIToastProps`):
- `message: string`
- `tone?: 'success' | 'error' | 'info'`
- `onClose?: () => void`

### `text-link-button.tsx`
Botão textual baseado em `Pressable`, ideal para links com `Link asChild` do Expo Router.

### `theme-mode-toggle.tsx`
Componente de alternância de aparência (light/dark).

### `lucide-icon.tsx`
Renderização de ícones Lucide via `iconNode` em ambiente React Native.

### `icon-nodes.ts`
Catálogo local dos `iconNode` utilizados no app.

### `icon-button.tsx`
Botão de ícone reutilizável com temas (`default` e `danger`).

### `header.tsx`
Header visual da tela (custom) com suporte a voltar e ações à direita.

### `modal.tsx`
Modal genérica com card de conteúdo.

### `menu.tsx`
Menu de ações em overlay para opções rápidas (ex.: menu de 3 pontos).

## Convenções
- `shared/ui` deve permanecer genérico (sem semântica de feature).
- Se um componente for específico de domínio/tela, criar em `modules/<feature>/components`.
- Componentes de `shared/ui` não devem conter regra de negócio.

## Tema
- Os componentes base de UI usam o tema central (`src/infra/shared/theme/theme.ts`) via `useAppColors`.
- Evitar hardcode de cores Tailwind em componentes compartilhados.
