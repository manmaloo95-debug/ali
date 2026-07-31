create extension if not exists pgcrypto;

create table if not exists public.memories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  type text not null check (type in ('fact','goal','project','preference','lesson','relationship')),
  content text not null,
  importance real not null default 0.5 check (importance between 0 and 1),
  confidence real not null default 0.5 check (confidence between 0 and 1),
  tags text[] not null default '{}',
  links uuid[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists memories_user_id_idx on public.memories(user_id);
create index if not exists memories_tags_idx on public.memories using gin(tags);

create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null,
  user_id uuid not null references auth.users(id) on delete cascade,
  engine text not null,
  success boolean not null,
  confidence real not null,
  risk_level text not null,
  duration_ms integer not null,
  created_at timestamptz not null default now()
);

create index if not exists audit_logs_user_id_created_at_idx on public.audit_logs(user_id, created_at desc);

alter table public.memories enable row level security;
alter table public.audit_logs enable row level security;

create policy "users manage own memories" on public.memories
for all to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "users read own audit logs" on public.audit_logs
for select to authenticated
using (auth.uid() = user_id);
