# Supabase setup

1. Open Supabase SQL editor.
2. Run `schema.sql`.
3. Enable email/password auth in Supabase Auth settings.
4. In `mobile/.env`, set:
   - `EXPO_PUBLIC_SUPABASE_URL`
   - `EXPO_PUBLIC_SUPABASE_KEY`

## CLI workflow (recommended)
1. Create/edit migration files in `supabase/migrations`.
2. Push migrations to remote:
   - `npx supabase db push`
3. If `db push` says up to date but tables are missing, ensure there is at least one SQL file in `supabase/migrations`.
