alter table public.shopping_lists
  add column if not exists invite_token text,
  add column if not exists invite_expires_at timestamptz;

drop index if exists idx_shopping_lists_invite_token;
create unique index if not exists idx_shopping_lists_invite_token
  on public.shopping_lists(invite_token)
  where invite_token is not null;

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
  l.invite_token,
  l.invite_expires_at,
  coalesce(sum(i.price_cents), 0)::bigint as total_price_cents
from public.shopping_lists l
left join public.shopping_items i on i.list_id = l.id
group by
  l.id,
  l.name,
  l.created_by,
  l.created_at,
  l.updated_at,
  l.invite_token,
  l.invite_expires_at;

grant select on public.shopping_lists_with_totals to authenticated;

drop function if exists public.create_invite(uuid);
drop function if exists public.create_invite(uuid, boolean);

create or replace function public.create_invite(
  p_list_id uuid,
  p_force_new boolean default false
)
returns table(token text, expires_at timestamptz)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_existing_token text;
  v_existing_expires_at timestamptz;
  v_token text;
  v_expires_at timestamptz := now() + interval '24 hours';
begin
  if not exists (
    select 1
    from public.list_members
    where list_id = p_list_id
      and user_id = auth.uid()
  ) then
    raise exception 'You are not a member of this list.';
  end if;

  select invite_token, invite_expires_at
  into v_existing_token, v_existing_expires_at
  from public.shopping_lists
  where id = p_list_id;

  if not p_force_new
     and v_existing_token is not null
     and v_existing_expires_at is not null
     and v_existing_expires_at > now() then
    return query
    select v_existing_token, v_existing_expires_at;
    return;
  end if;

  if v_existing_token is not null then
    update public.list_invites
    set revoked_at = now()
    where token_hash = encode(extensions.digest(v_existing_token, 'sha256'), 'hex')
      and revoked_at is null;
  end if;

  v_token := encode(extensions.gen_random_bytes(24), 'hex');

  insert into public.list_invites (list_id, token_hash, created_by, expires_at)
  values (
    p_list_id,
    encode(extensions.digest(v_token, 'sha256'), 'hex'),
    auth.uid(),
    v_expires_at
  );

  update public.shopping_lists
  set invite_token = v_token,
      invite_expires_at = v_expires_at
  where id = p_list_id;

  return query
  select v_token, v_expires_at;
end;
$$;

revoke all on function public.create_invite(uuid, boolean) from public;
grant execute on function public.create_invite(uuid, boolean) to authenticated;

select pg_notify('pgrst', 'reload schema');
