# Realtime Shopping (Mobile)

Aplicativo mobile de lista de compras compartilhada em tempo real.

## Sobre o projeto
Este app permite criar listas de compras e compartilhar com outras pessoas.
Todos os participantes da mesma lista visualizam atualizações em tempo real (após salvar alterações), como:

- criar e excluir listas
- criar, editar e excluir itens
- marcar e desmarcar item como comprado
- gerar e aceitar convite por link
- autenticação de usuário (login, cadastro e recuperação de senha)

## Objetivo
Facilitar colaboração em listas de compras (família, casal, amigos, etc.) com sincronização online.

## Tecnologias utilizadas
- React Native
- Expo
- Expo Router (roteamento baseado em arquivos)
- TypeScript
- NativeWind (estilização)
- Supabase (auth, banco e realtime)
- React Hook Form
- Zod
- Biome (lint e formatação)

## Pré-requisitos
- Node.js 20+
- pnpm
- Android Studio (para emulador Android) ou dispositivo físico com Expo Go
- Conta e projeto no Supabase

## Configuração do ambiente
1. Instale as dependências:

```bash
pnpm install
```

2. Crie o arquivo `.env` com base no `.env.example`:

```bash
cp .env.example .env
```

3. Preencha as variáveis do Supabase no `.env`:
- `EXPO_PUBLIC_SUPABASE_URL`
- `EXPO_PUBLIC_SUPABASE_KEY`

## Como executar
### Iniciar servidor Expo
```bash
pnpm start
```

### Rodar no Android
```bash
pnpm android
```

### Rodar no iOS
```bash
pnpm ios
```

### Rodar no Web
```bash
pnpm web
```

## Scripts úteis
- `pnpm lint` -> validação com Biome
- `pnpm lint:fix` -> correções automáticas de lint
- `pnpm format` -> formatação de código

## Banco de dados (Supabase)
As migrations SQL estão em `supabase/migrations`.
Para sincronizar schema com seu projeto Supabase, use a CLI do Supabase no diretório `mobile`.

Exemplo:
```bash
npx supabase db push
```

## Estrutura resumida
- `app/` -> rotas do Expo Router
- `src/core/` -> contratos, DTOs, erros e regras de domínio
- `src/infra/` -> implementação da aplicação (telas, repositórios, providers, UI)
- `src/infra/shared/ui/` -> componentes visuais reutilizáveis
- `supabase/` -> schema e migrations

## Status atual
Projeto em desenvolvimento ativo com foco em:
- melhorias de UI/UX
- arquitetura MVVM
- separação `core` e `infra`
- evolução do backend leve para operações sensíveis e IA no futuro
