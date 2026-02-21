-- Harden list insert policy and add explicit self-insert policy for list_members.
-- This keeps RLS strict while avoiding insert failures when created_by is omitted.

alter table public.shopping_lists
  alter column created_by set default auth.uid();

drop policy if exists "lists_insert_authenticated" on public.shopping_lists;
create policy "lists_insert_authenticated"
  on public.shopping_lists
  for insert
  to authenticated
  with check (
    auth.uid() is not null
    and coalesce(created_by, auth.uid()) = auth.uid()
  );

drop policy if exists "members_insert_self" on public.list_members;
create policy "members_insert_self"
  on public.list_members
  for insert
  to authenticated
  with check (user_id = auth.uid());

select pg_notify('pgrst', 'reload schema');

