# Roadmap Técnico de Refatoração MVVM + Core/Infra (Arquivo alvo: `docs/refactor.md`)

## Resumo
Este roadmap define a migração incremental do app `./mobile` para uma arquitetura baseada em `core` + `infra`, com padrão MVVM (`model.ts`, `view-model.tsx`, `view.tsx`), mantendo Expo Router ativo e com `app` apenas como camada de roteamento (wrappers finos).  
Também define a introdução de contratos de repositório em `core`, implementações concretas em `infra`, padronização de erros com `AppError`, e formulários com `react-hook-form` + `zod@4`.

## Status Atual (2026-02-21)
1. Fases implementadas: Fase 0, Fase 1, Fase 2, Fase 3, Fase 4 e Fase 5 (estrutura, contratos, repositórios, DI, MVVM e wrappers de rota).
2. `app` está como camada de roteamento/wrappers; lógica de navegação e auth guard está em `src/infra/navigation/root-layout.tsx`.
3. Funções avulsas de acesso ao Supabase foram removidas; agora o acesso passa por contratos em `src/core/repositories` e classes em `src/infra/repositories/supabase`.
4. Pendências para fechamento total do roadmap: Fase 6 (checklist hardening final) e Fase 7 (testes unitários/smoke).
5. Observação de validação: o typecheck ainda acusa falta de `zod`, `react-hook-form` e `@hookform/resolvers` enquanto as dependências não forem instaladas localmente.

## Objetivos e Critérios de Sucesso
1. Manter funcionamento atual da aplicação durante toda a refatoração.
2. Centralizar contratos e tipos de domínio em `src/core`.
3. Mover implementação real de UI/estado/regra para `src/infra`.
4. Padronizar todas as telas críticas em MVVM.
5. Substituir funções avulsas de repositório por contratos + classes.
6. Aplicar `react-hook-form` e `zod@4` em todos os formulários.
7. Manter Expo Router como está, com arquivos de rota em `app`.

## Decisões Arquiteturais Fechadas
1. `app` permanece como root do Expo Router.
2. `app` terá apenas wrappers de rota, sem regra de negócio.
3. Repositórios usarão contratos em `core` e classes em `infra`.
4. Migração ocorrerá por feature vertical, não big-bang.
5. `zod@4` e `react-hook-form` serão padrão para formulários.

## Estrutura Alvo
1. `mobile/app`  
Arquivos de rota do Expo Router, apenas composição/redirect/import de telas da `infra`.
2. `mobile/src/core/docs`  
Documentação técnica de domínio e ADRs da arquitetura.
3. `mobile/src/core/dto`  
DTOs de entrada/saída entre view-model e repositórios.
4. `mobile/src/core/error`  
`AppError`, códigos de erro e normalização de erros.
5. `mobile/src/core/repositories`  
Contratos (interfaces) de repositórios.
6. `mobile/src/infra/screens`  
Telas em MVVM por feature.
7. `mobile/src/infra/components`  
Componentes reutilizáveis de UI.
8. `mobile/src/infra/providers`  
Providers e contextos de runtime da app.
9. `mobile/src/infra/repositories/supabase`  
Implementações concretas dos contratos de repositório.
10. `mobile/src/infra/lib`  
Clientes/adapters infra (Supabase client, mappers, helpers de plataforma).
11. `mobile/src/infra/utils`  
Helpers utilitários específicos de infraestrutura.

## Convenção MVVM (Padrão Obrigatório)
1. `model.ts`  
Schemas zod, tipos de formulário, DTOs locais da tela, `defaultValues`, mapeadores `toDTO`.
2. `view-model.tsx`  
Hooks de estado e ações, integração com repositórios, tratamento de erro, navegação, efeitos.
3. `view.tsx`  
Somente JSX/estilo/composição de componentes e bindings do form.
4. `index.tsx`  
Exporta a tela final da feature (`export default View` ou composição equivalente).

## Interfaces Públicas/Contratos a Introduzir
1. `src/core/repositories/auth.repository.ts`  
`signIn`, `signUp`, `resetPassword`, `signOut`, `getSession`.
2. `src/core/repositories/lists.repository.ts`  
`fetchLists`, `fetchListById`, `createList`, `deleteList`.
3. `src/core/repositories/items.repository.ts`  
`fetchItemsByList`, `createItem`, `updateItem`, `deleteItem`, `togglePurchased`.
4. `src/core/repositories/invites.repository.ts`  
`createInvite`, `acceptInvite`.
5. `src/core/error/AppError.ts`  
Classe com `code`, `message`, `details`, `cause`.
6. `src/core/error/error-codes.ts`  
Catálogo de códigos (`AUTH_*`, `LISTS_*`, `ITEMS_*`, `INVITES_*`, `NETWORK_*`, `UNKNOWN`).
7. `src/core/dto/*.dto.ts`  
DTOs de domínio, desacoplados do formato específico do Supabase.
8. `src/infra/repositories/supabase/*.repository.ts`  
Classes que implementam os contratos acima.
9. `src/infra/factories/dependency-injection.factory.ts`  
Fábrica simples para entrega de implementações concretas (inicialmente Supabase).

## Roadmap por Fases (Incremental e em Tarefas Pequenas)

## Fase 0 — Fundação da Arquitetura
1. Criar pastas-alvo `core/docs`, `core/dto`, `core/error`, `core/repositories`, `infra/screens`, `infra/repositories/supabase`, `infra/factories`, `infra/providers`, `infra/components`, `infra/lib`, `infra/utils`.
2. Definir aliases de import para `@core/*`, `@infra/*`, `@app/*` sem quebrar imports atuais.
3. Criar ADR em `src/core/docs/adr-001-architecture-core-infra-mvvm.md`.
4. Criar `AppError` e estratégia de mapeamento de erro.
5. Critério de aceite: estrutura criada e build/typecheck passando.

## Fase 1 — Contratos de Repositório + Implementações Supabase
1. Especificar contratos de `auth`, `lists`, `items`, `invites` em `src/core/repositories`.
2. Criar DTOs de domínio em `src/core/dto`.
3. Implementar classes Supabase em `src/infra/repositories/supabase`.
4. Criar fábrica de DI em `src/infra/factories`.
5. Substituir uso direto de funções avulsas nas camadas superiores por contratos.
6. Critério de aceite: fluxo atual funciona consumindo contratos.

## Fase 2 — Refatoração MVVM do Fluxo de Auth
1. Criar `src/infra/screens/auth/SignIn/{model.ts,view-model.tsx,view.tsx,index.tsx}`.
2. Criar `src/infra/screens/auth/SignUp/{model.ts,view-model.tsx,view.tsx,index.tsx}`.
3. Criar `src/infra/screens/auth/ForgotPassword/{model.ts,view-model.tsx,view.tsx,index.tsx}`.
4. Implementar formulários com `react-hook-form` + `zod@4`.
5. Ajustar wrappers de rota em `app/(public)/*.tsx` para importar da `infra`.
6. Critério de aceite: login/cadastro/esqueci-senha funcionando com MVVM.

## Fase 3 — Refatoração MVVM do Fluxo de Listas
1. Criar `src/infra/screens/lists/ListsHome/{model.ts,view-model.tsx,view.tsx,index.tsx}`.
2. Migrar criação/remoção/carregamento de listas para view-model.
3. Mover estados locais e side-effects da view para view-model.
4. Atualizar `app/(tabs)/index.tsx` para wrapper.
5. Critério de aceite: tela inicial de listas operando via MVVM + contratos.

## Fase 4 — Refatoração MVVM do Fluxo de Itens
1. Criar `src/infra/screens/lists/ListDetails/{model.ts,view-model.tsx,view.tsx,index.tsx}`.
2. Migrar lógica de realtime, CRUD de item e edição para view-model.
3. Modelar schema zod do formulário de item.
4. Atualizar wrapper `app/(tabs)/lists/[listId].tsx`.
5. Critério de aceite: CRUD de itens e realtime íntegros após migração.

## Fase 5 — Refatoração MVVM de Convites e Perfil
1. Criar `src/infra/screens/invites/AcceptInvite/{model.ts,view-model.tsx,view.tsx,index.tsx}`.
2. Criar `src/infra/screens/profile/Profile/{model.ts,view-model.tsx,view.tsx,index.tsx}`.
3. Ajustar wrappers `app/(tabs)/invite/[token].tsx` e `app/(tabs)/profile.tsx`.
4. Critério de aceite: aceitar convite e logout funcionando via MVVM.

## Fase 6 — Hardening Arquitetural
1. Garantir que `app` não tenha regra de negócio.
2. Garantir que infra não importe contratos por caminhos circulares.
3. Padronizar mapeamento de erros para `AppError`.
4. Padronizar nomenclatura de DTO e retorno.
5. Critério de aceite: checklist arquitetural aprovado.

## Fase 7 — Qualidade e Testes
1. Criar testes unitários de `model.ts` (schemas zod e mapeadores).
2. Criar testes unitários de `view-model.tsx` com mocks de repositório.
3. Criar smoke tests dos fluxos críticos.
4. Critério de aceite: cobertura mínima nos fluxos críticos definidos abaixo.

## Backlog de Tarefas Pequenas (Ordem Recomendada)
1. T001 Criar `AppError` + códigos.
2. T002 Criar contratos `auth.repository.ts`.
3. T003 Criar contratos `lists.repository.ts`.
4. T004 Criar contratos `items.repository.ts`.
5. T005 Criar contratos `invites.repository.ts`.
6. T006 Criar DTOs de auth.
7. T007 Criar DTOs de listas.
8. T008 Criar DTOs de itens.
9. T009 Criar DTOs de convites.
10. T010 Implementar `AuthSupabaseRepository`.
11. T011 Implementar `ListsSupabaseRepository`.
12. T012 Implementar `ItemsSupabaseRepository`.
13. T013 Implementar `InvitesSupabaseRepository`.
14. T014 Criar factory de DI.
15. T015 Migrar `SignIn` para MVVM.
16. T016 Migrar `SignUp` para MVVM.
17. T017 Migrar `ForgotPassword` para MVVM.
18. T018 Migrar `ListsHome` para MVVM.
19. T019 Migrar `ListDetails` para MVVM.
20. T020 Migrar `AcceptInvite` para MVVM.
21. T021 Migrar `Profile` para MVVM.
22. T022 Limpar regra de negócio de `app`.
23. T023 Testes unitários de models.
24. T024 Testes unitários de view-models.
25. T025 Documentar padrão final em `core/docs`.

## Casos de Teste e Cenários
1. Auth: login válido, login inválido, sessão expirada.
2. SignUp: cadastro com sucesso, validações de campos, fluxo com confirmação de e-mail.
3. ForgotPassword: envio válido, erro de e-mail inválido.
4. Lists: criar lista, listar, excluir lista.
5. Items: criar item, editar item, excluir item, marcar/desmarcar comprado.
6. Realtime: dois usuários na mesma lista com atualização após salvar item.
7. Invites: gerar link, aceitar link válido, rejeitar token inválido/expirado.
8. Guards: rota privada sem sessão redireciona para sign-in.
9. Erros: falhas de repositório resultam em `AppError` padronizado para UI.
10. Arquitetura: verificação de que wrappers em `app` não contêm regras de negócio.

## Riscos e Mitigações
1. Risco: quebra de rotas ao mover telas.  
Mitigação: manter wrappers em `app` e migrar por feature.
2. Risco: regressão em realtime durante MVVM de list details.  
Mitigação: migrar essa tela isoladamente com smoke test multiusuário.
3. Risco: acoplamento persistente ao Supabase nas telas.  
Mitigação: bloquear acesso direto ao cliente Supabase fora de `infra/repositories`.
4. Risco: refatoração extensa com alto delta.  
Mitigação: entregas verticais pequenas e validadas a cada fase.

## Assumptions e Defaults Adotados
1. `app` continuará existindo exclusivamente para roteamento do Expo Router.
2. Toda regra de negócio nova vai para `view-model` ou serviços/repositórios em `infra`.
3. Todos os formulários novos e migrados usarão `react-hook-form` + `zod@4`.
4. Contratos de repositório ficarão em `core`, implementações em `infra`.
5. Migração seguirá ordem vertical: Auth -> Lists -> Items -> Invites -> Profile.
6. O arquivo `docs/refactor.md` será a fonte de verdade do roadmap desta refatoração.






