-- Fix recursion in list_members policy
-- Previous policy queried public.list_members inside itself and caused infinite recursion.

drop policy if exists "members_select_member" on public.list_members;
create policy "members_select_member"
  on public.list_members
  for select
  using (user_id = auth.uid());

select pg_notify('pgrst', 'reload schema');
