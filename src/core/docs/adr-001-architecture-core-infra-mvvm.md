# ADR 001 - Core/Infra + MVVM

## Context
The mobile app is being refactored to enforce architectural boundaries and improve maintainability.

## Decision
- Keep Expo Router root in `app` with thin route wrappers.
- Keep contracts, DTOs, docs, and errors in `src/core`.
- Keep runtime implementations in `src/infra`.
- Use MVVM per screen:
  - `model.ts` for schema/types/defaults/mappers
  - `view-model.tsx` for business logic/state/actions
  - `view.tsx` for JSX only
- Use repository contracts in core and Supabase classes in infra.

## Consequences
- Better abstraction and testability.
- Easier migration to backend in the future.
- Reduced framework-specific coupling in domain contracts.

