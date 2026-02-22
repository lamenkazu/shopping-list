alter table public.shopping_items
add column if not exists price_cents integer;

alter table public.shopping_items
drop constraint if exists shopping_items_price_cents_check;

alter table public.shopping_items
add constraint shopping_items_price_cents_check
check (price_cents is null or price_cents >= 0);

drop view if exists public.shopping_lists_with_totals;

create view public.shopping_lists_with_totals
with (security_invoker = true)
as
select
  l.id,
  l.name,
  l.created_by,
  l.created_at,
  l.updated_at,
  coalesce(sum(i.price_cents), 0)::bigint as total_price_cents
from public.shopping_lists l
left join public.shopping_items i on i.list_id = l.id
group by l.id, l.name, l.created_by, l.created_at, l.updated_at;

grant select on public.shopping_lists_with_totals to authenticated;

select pg_notify('pgrst', 'reload schema');
