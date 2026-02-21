-- Fix insert RLS for shopping_lists and owner trigger behavior

alter table public.shopping_lists
  alter column created_by set default auth.uid();

create or replace function public.handle_new_list_owner_member()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.list_members (list_id, user_id, role)
  values (new.id, new.created_by, 'owner')
  on conflict (list_id, user_id) do nothing;

  return new;
end;
$$;

drop policy if exists "lists_insert_authenticated" on public.shopping_lists;
create policy "lists_insert_authenticated"
  on public.shopping_lists
  for insert
  to authenticated
  with check (created_by = auth.uid());

select pg_notify('pgrst', 'reload schema');
