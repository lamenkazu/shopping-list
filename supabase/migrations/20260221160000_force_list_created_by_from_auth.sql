-- Force created_by from auth.uid() on insert to avoid client-side mismatches.

create or replace function public.set_list_created_by_from_auth()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null then
    raise exception 'Not authenticated';
  end if;

  new.created_by := auth.uid();
  return new;
end;
$$;

drop trigger if exists trg_lists_set_created_by on public.shopping_lists;
create trigger trg_lists_set_created_by
  before insert on public.shopping_lists
  for each row execute function public.set_list_created_by_from_auth();

drop policy if exists "lists_insert_authenticated" on public.shopping_lists;
create policy "lists_insert_authenticated"
  on public.shopping_lists
  for insert
  to authenticated
  with check (auth.uid() is not null);

select pg_notify('pgrst', 'reload schema');
