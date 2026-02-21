create or replace function public.create_invite(p_list_id uuid)
returns table(token text, expires_at timestamptz)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_token text := encode(extensions.gen_random_bytes(24), 'hex');
  v_expires_at timestamptz := now() + interval '30 days';
begin
  if not exists (
    select 1
    from public.list_members
    where list_id = p_list_id
      and user_id = auth.uid()
  ) then
    raise exception 'You are not a member of this list.';
  end if;

  insert into public.list_invites (list_id, token_hash, created_by, expires_at)
  values (
    p_list_id,
    encode(extensions.digest(v_token, 'sha256'), 'hex'),
    auth.uid(),
    v_expires_at
  );

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
