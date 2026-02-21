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

Uso:
```tsx
<UIScreen>
  {/** conteúdo da tela **/}
</UIScreen>
```

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

Uso:
```tsx
<UICard title="Profile" subtitle="Email: user@email.com">
  {/** conteúdo **/}
</UICard>
```

### `section.tsx`
Composição pronta de `UIScreen + UICard` para seções com foco em título/subtítulo e conteúdo.

Props (`UISectionProps`):
- `title: string`
- `subtitle?: string`
- `children: ReactNode`
- `containerClassName?: string`
- `cardClassName?: string`
- `contentClassName?: string`

Uso:
```tsx
<UISection title="Sign in" subtitle="Shared shopping list in real time.">
  {/** conteúdo da seção **/}
</UISection>
```

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

Uso:
```tsx
<UIButton
  label="Create list"
  loading={isCreating}
  loadingLabel="Creating..."
  onPress={handleSubmit(onSubmit)}
/>
```

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

Uso:
```tsx
<UIInput
  placeholder="seu@email.com"
  keyboardType="email-address"
  autoCapitalize="none"
  value={value}
  onChangeText={onChange}
  errorMessage={errors.email?.message}
/>
```

### `message.tsx`
Mensagem de feedback com tom visual.

Props (`UIMessageProps`):
- `tone: 'error' | 'success' | 'info'`
- `message?: string | null`
- `className?: string`

Uso:
```tsx
<UIMessage tone="error" message={state.error} className="mt-3" />
```

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

Uso:
```tsx
<Link href={'/sign-up' as never} asChild>
  <UITextLinkButton label="Create account" />
</Link>
```

## Convenções
- `shared/ui` deve permanecer genérico (sem semântica de feature).
- Se um componente for específico de domínio/tela, criar em `modules/<feature>/components`.
- Componentes de `shared/ui` não devem conter regra de negócio.
- Priorizar composição de `screen`, `card`, `button`, `input` e `message` antes de adicionar Tailwind diretamente nas views.
