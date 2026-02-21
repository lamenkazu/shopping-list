# Plano Tecnico - Realtime Shopping

## 1) Decisao arquitetural (resposta objetiva)
Sim: no MVP, o app em `./mobile` conversa direto com o Supabase para Auth, banco e realtime.
Nao: o app nao deve carregar segredos (service role, chaves de IA).
Futuro: quando houver regras sensiveis e IA, criar `./backend` para intermediar essas operacoes.

## 2) Objetivo do produto
Aplicacao de lista de compras compartilhada em tempo real entre membros da mesma lista.

Capacidades principais do MVP:
1. Criar conta, entrar, recuperar senha.
2. Criar lista de compras.
3. Convidar pessoas por link para entrar na lista.
4. Itens em tempo real: criar, editar, excluir, marcar/desmarcar comprado.
5. Todas as rotas fora de autenticacao sao privadas.

## 3) Escopo e limites do MVP
Inclui:
1. Mobile-first (Android/iOS) em `./mobile`.
2. Auth por email/senha.
3. Realtime por lista (nao por digitacao, apenas apos salvar).
4. Convite por link reutilizavel com expiracao de 30 dias.
5. Permissao: membros editam itens; exclusao da lista inteira apenas owner.

Nao inclui agora:
1. Backend dedicado em `./backend`.
2. Push notification.
3. Offline com merge de conflitos.
4. AI SDK em producao.

## 4) Topologia por fase
### Fase A (agora) - Sem backend proprio
`mobile app -> Supabase Auth + Postgres + Realtime + RLS`

Uso direto do app:
1. Login/cadastro/reset.
2. CRUD de listas/itens.
3. Subscriptions de realtime.

### Fase B (futuro) - Backend leve em `./backend`
`mobile app -> backend API -> Supabase + provedores externos (AI, etc)`

Uso via backend:
1. Operacoes que exigem segredo (service role / API keys).
2. Orquestracao com AI SDK da Vercel.
3. Regras de negocio sensiveis que nao devem ficar no cliente.

## 5) Estrutura de repositorio alvo
Estado atual:
1. `./mobile` existe e contem o app Expo.
2. `./backend` ainda nao existe.

Estrutura planejada:
1. `./mobile`
   - `app/(public)` -> `sign-in`, `sign-up`, `forgot-password`
   - `app/(private)` -> `lists`, `lists/[listId]`, `invite/[token]`, `profile`
   - `src/lib/supabase.ts`
   - `src/features/{auth,lists,items,invites}`
2. `./backend` (fase futura)
   - `src/routes/*`
   - `src/services/{supabase,ai}`
   - `src/middleware/auth.ts`
   - `src/config/env.ts`

## 6) Modelo de dados (Supabase/Postgres)
Tabelas:
1. `profiles`
   - `id uuid pk references auth.users`
   - `full_name text`
   - `created_at timestamptz default now()`
2. `shopping_lists`
   - `id uuid pk default gen_random_uuid()`
   - `name text not null`
   - `created_by uuid not null`
   - `created_at timestamptz default now()`
   - `updated_at timestamptz default now()`
3. `list_members`
   - `list_id uuid not null`
   - `user_id uuid not null`
   - `role text check (role in ('owner','member'))`
   - `created_at timestamptz default now()`
   - `primary key (list_id, user_id)`
4. `shopping_items`
   - `id uuid pk default gen_random_uuid()`
   - `list_id uuid not null`
   - `title text not null`
   - `quantity numeric(10,2) null`
   - `unit text null`
   - `is_purchased boolean default false`
   - `purchased_at timestamptz null`
   - `purchased_by uuid null`
   - `created_by uuid not null`
   - `updated_by uuid not null`
   - `created_at timestamptz default now()`
   - `updated_at timestamptz default now()`
5. `list_invites`
   - `id uuid pk default gen_random_uuid()`
   - `list_id uuid not null`
   - `token_hash text unique not null`
   - `created_by uuid not null`
   - `created_at timestamptz default now()`
   - `expires_at timestamptz not null`
   - `revoked_at timestamptz null`
   - `uses_count int default 0`

Indices minimos:
1. `shopping_items(list_id, created_at desc)`
2. `list_members(user_id)`
3. `list_invites(token_hash)`

## 7) Seguranca e autorizacao (RLS)
Politicas obrigatorias:
1. Apenas membros de uma lista leem/escrevem `shopping_lists`, `shopping_items`, `list_members`.
2. `delete` em `shopping_lists` permitido apenas para `role = owner`.
3. Usuario so acessa seu proprio `profiles`.
4. Convites aceitos apenas por usuarios autenticados.
5. Token de convite salvo somente como hash, nunca em texto puro.

## 8) Rotas de aplicacao
Rotas publicas (somente 3):
1. `/sign-in`
2. `/sign-up`
3. `/forgot-password`

Rotas privadas:
1. `/lists`
2. `/lists/[listId]`
3. `/invite/[token]`
4. `/profile`

Regra global:
1. Sem sessao + rota privada -> redireciona para `/sign-in`.
2. Com sessao + rota publica -> redireciona para `/lists`.

## 9) Realtime no mobile
Contrato de sincronizacao:
1. Abrir tela da lista -> buscar snapshot inicial.
2. Criar subscription filtrada por `list_id` em `shopping_items`.
3. Aplicar eventos `INSERT`, `UPDATE`, `DELETE` na store local.
4. Conflito no MVP: ultima gravacao vence (`last write wins`).

## 10) Plano de implementacao por fases
### Fase 0 - Fundacao (mobile + Supabase)
1. Criar projeto Supabase e configurar variaveis no `./mobile`.
2. Criar migrations das tabelas e indices.
3. Ativar RLS e politicas.
4. Validar auth basico.

### Fase 1 - Autenticacao e guardas
1. Implementar telas `sign-in`, `sign-up`, `forgot-password`.
2. Implementar guard de rotas privadas.
3. Implementar logout e restauracao de sessao.

### Fase 2 - Listas e itens
1. CRUD de listas.
2. CRUD de itens com `quantity` e `unit`.
3. Marcar/desmarcar comprado.

### Fase 3 - Convites
1. Gerar convite (token + hash + expiracao).
2. Aceitar convite via `/invite/[token]`.
3. Inserir usuario em `list_members`.

### Fase 4 - Realtime e robustez
1. Subscription em tempo real por lista.
2. Estados de erro/retry e reconnect.
3. Prevenir duplicacao de item na reconciliacao de eventos.

### Fase 5 - Hardening MVP
1. Testes E2E dos fluxos criticos.
2. Telemetria basica (erros e tempos de resposta).
3. Checklist de release Android/iOS.

### Fase 6 - Backend leve (`./backend`) + AI SDK
1. Criar `./backend` (Node/TypeScript) com API HTTP.
2. Mover operacoes sensiveis do cliente para backend.
3. Integrar AI SDK da Vercel no backend.
4. Expor endpoints de IA consumidos pelo app.

## 11) Contratos futuros do backend (`./backend`)
Endpoints iniciais planejados:
1. `POST /api/invites/create`
   - Entrada: `{ listId }`
   - Saida: `{ inviteUrl, expiresAt }`
2. `POST /api/invites/accept`
   - Entrada: `{ token }`
   - Saida: `{ listId, alreadyMember }`
3. `POST /api/ai/suggest-items`
   - Entrada: `{ listId, context? }`
   - Saida: `{ suggestions: string[] }`

Regras:
1. O backend valida JWT do usuario antes de operar.
2. Chaves sensiveis ficam somente no backend.
3. App nunca recebe service role key.

## 12) Testes de aceitacao (DoD)
1. Usuario A cria lista, usuario B entra por link, ambos veem as mudancas em segundos.
2. Sem login nao acessa rota privada.
3. Usuario nao membro nao acessa lista por RLS.
4. Apenas owner consegue excluir lista inteira.
5. Link expirado retorna erro amigavel.
6. Recuperacao de senha completa sem erro.

## 13) Custos e operacao
1. Comecar no plano free do Supabase (escala MVP pequena).
2. Monitorar conexoes realtime, tamanho de banco e throughput mensal.
3. Definir gatilho de migracao para `./backend` quando:
   - houver integracao de IA,
   - houver necessidade de segredos/operacoes privilegiadas,
   - ou aumento de complexidade de regras de negocio.

## 14) Proximos passos imediatos
1. Validar este plano como baseline tecnico oficial.
2. Criar backlog de implementacao da Fase 0 a Fase 2.
3. Implementar primeiro em `./mobile` com Supabase direto.
4. Deixar `./backend` para a Fase 6, exceto se surgir necessidade de segredo antes.
