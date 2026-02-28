create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  created_at timestamptz not null default now()
);

create table if not exists public.shopping_lists (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_by uuid not null default auth.uid() references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  invite_token text,
  invite_expires_at timestamptz
);

create table if not exists public.list_members (
  list_id uuid not null references public.shopping_lists(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null default 'member' check (role in ('owner', 'member')),
  created_at timestamptz not null default now(),
  primary key (list_id, user_id)
);

create table if not exists public.shopping_items (
  id uuid primary key default gen_random_uuid(),
  list_id uuid not null references public.shopping_lists(id) on delete cascade,
  title text not null,
  quantity numeric(10,2),
  unit text,
  price_cents integer check (price_cents is null or price_cents >= 0),
  is_purchased boolean not null default false,
  purchased_at timestamptz,
  purchased_by uuid references auth.users(id),
  created_by uuid not null default auth.uid() references auth.users(id),
  updated_by uuid not null references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.list_invites (
  id uuid primary key default gen_random_uuid(),
  list_id uuid not null references public.shopping_lists(id) on delete cascade,
  token_hash text not null unique,
  created_by uuid not null default auth.uid() references auth.users(id),
  created_at timestamptz not null default now(),
  expires_at timestamptz not null,
  revoked_at timestamptz,
  uses_count int not null default 0
);

create index if not exists idx_items_list_created_at on public.shopping_items(list_id, created_at desc);
create index if not exists idx_members_user_id on public.list_members(user_id);
create index if not exists idx_list_invites_token_hash on public.list_invites(token_hash);
create unique index if not exists idx_shopping_lists_invite_token
  on public.shopping_lists(invite_token)
  where invite_token is not null;

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
group by l.id, l.name, l.created_by, l.created_at, l.updated_at, l.invite_token, l.invite_expires_at;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data->>'full_name')
  on conflict (id) do nothing;

  return new;
end;
$$;

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

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

drop trigger if exists trg_lists_set_created_by on public.shopping_lists;
create trigger trg_lists_set_created_by
  before insert on public.shopping_lists
  for each row execute function public.set_list_created_by_from_auth();

drop trigger if exists trg_lists_set_updated_at on public.shopping_lists;
create trigger trg_lists_set_updated_at
  before update on public.shopping_lists
  for each row execute function public.set_updated_at();

drop trigger if exists trg_items_set_updated_at on public.shopping_items;
create trigger trg_items_set_updated_at
  before update on public.shopping_items
  for each row execute function public.set_updated_at();

drop trigger if exists trg_list_insert_owner on public.shopping_lists;
create trigger trg_list_insert_owner
  after insert on public.shopping_lists
  for each row execute function public.handle_new_list_owner_member();

alter table public.profiles enable row level security;
alter table public.shopping_lists enable row level security;
alter table public.list_members enable row level security;
alter table public.shopping_items enable row level security;
alter table public.list_invites enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
  on public.profiles
  for select
  using (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
  on public.profiles
  for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

drop policy if exists "lists_select_member" on public.shopping_lists;
create policy "lists_select_member"
  on public.shopping_lists
  for select
  using (
    exists (
      select 1
      from public.list_members m
      where m.list_id = shopping_lists.id
        and m.user_id = auth.uid()
    )
  );

drop policy if exists "lists_insert_authenticated" on public.shopping_lists;
create policy "lists_insert_authenticated"
  on public.shopping_lists
  for insert
  to authenticated
  with check (auth.uid() is not null);

drop policy if exists "lists_update_member" on public.shopping_lists;
create policy "lists_update_member"
  on public.shopping_lists
  for update
  using (
    exists (
      select 1
      from public.list_members m
      where m.list_id = shopping_lists.id
        and m.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1
      from public.list_members m
      where m.list_id = shopping_lists.id
        and m.user_id = auth.uid()
    )
  );

drop policy if exists "lists_delete_owner" on public.shopping_lists;
create policy "lists_delete_owner"
  on public.shopping_lists
  for delete
  using (
    exists (
      select 1
      from public.list_members m
      where m.list_id = shopping_lists.id
        and m.user_id = auth.uid()
        and m.role = 'owner'
    )
  );

drop policy if exists "members_select_member" on public.list_members;
create policy "members_select_member"
  on public.list_members
  for select
  using (user_id = auth.uid());

drop policy if exists "members_insert_self" on public.list_members;
create policy "members_insert_self"
  on public.list_members
  for insert
  to authenticated
  with check (user_id = auth.uid());

drop policy if exists "items_select_member" on public.shopping_items;
create policy "items_select_member"
  on public.shopping_items
  for select
  using (
    exists (
      select 1
      from public.list_members m
      where m.list_id = shopping_items.list_id
        and m.user_id = auth.uid()
    )
  );

drop policy if exists "items_insert_member" on public.shopping_items;
create policy "items_insert_member"
  on public.shopping_items
  for insert
  with check (
    exists (
      select 1
      from public.list_members m
      where m.list_id = shopping_items.list_id
        and m.user_id = auth.uid()
    )
  );

drop policy if exists "items_update_member" on public.shopping_items;
create policy "items_update_member"
  on public.shopping_items
  for update
  using (
    exists (
      select 1
      from public.list_members m
      where m.list_id = shopping_items.list_id
        and m.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1
      from public.list_members m
      where m.list_id = shopping_items.list_id
        and m.user_id = auth.uid()
    )
  );

drop policy if exists "items_delete_member" on public.shopping_items;
create policy "items_delete_member"
  on public.shopping_items
  for delete
  using (
    exists (
      select 1
      from public.list_members m
      where m.list_id = shopping_items.list_id
        and m.user_id = auth.uid()
    )
  );

drop policy if exists "invites_select_member" on public.list_invites;
create policy "invites_select_member"
  on public.list_invites
  for select
  using (
    exists (
      select 1
      from public.list_members m
      where m.list_id = list_invites.list_id
        and m.user_id = auth.uid()
    )
  );

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

create or replace function public.accept_invite(p_token text)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_token_hash text := encode(extensions.digest(p_token, 'sha256'), 'hex');
  v_invite public.list_invites%rowtype;
begin
  select *
  into v_invite
  from public.list_invites
  where token_hash = v_token_hash
    and revoked_at is null
    and expires_at > now()
  order by created_at desc
  limit 1;

  if v_invite.id is null then
    raise exception 'Invite is invalid or expired.';
  end if;

  insert into public.list_members (list_id, user_id, role)
  values (v_invite.list_id, auth.uid(), 'member')
  on conflict (list_id, user_id) do nothing;

  update public.list_invites
  set uses_count = uses_count + 1
  where id = v_invite.id;

  return v_invite.list_id;
end;
$$;

revoke all on function public.create_invite(uuid, boolean) from public;
revoke all on function public.accept_invite(text) from public;

grant execute on function public.create_invite(uuid, boolean) to authenticated;
grant execute on function public.accept_invite(text) to authenticated;

grant usage on schema public to anon, authenticated;
grant select, insert, update, delete on table public.profiles to authenticated;
grant select, insert, update, delete on table public.shopping_lists to authenticated;
grant select, insert, update, delete on table public.list_members to authenticated;
grant select, insert, update, delete on table public.shopping_items to authenticated;
grant select, insert, update, delete on table public.list_invites to authenticated;
grant select on public.shopping_lists_with_totals to authenticated;

select pg_notify('pgrst', 'reload schema');










