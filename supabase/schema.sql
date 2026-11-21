-- Kotoba-Biyori (ことば日和) Supabase Database Schema
-- Run this script once in Supabase Dashboard -> SQL Editor

create table if not exists public.user_learning_states (
  user_id uuid primary key references auth.users(id) on delete cascade,
  state jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

-- Enable Row Level Security (RLS)
alter table public.user_learning_states enable row level security;

-- Each user can only access and modify their own learning progress
drop policy if exists "Users can read own learning state" on public.user_learning_states;
create policy "Users can read own learning state"
  on public.user_learning_states
  for select
  using (auth.uid() = user_id);

drop policy if exists "Users can insert own learning state" on public.user_learning_states;
create policy "Users can insert own learning state"
  on public.user_learning_states
  for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can update own learning state" on public.user_learning_states;
create policy "Users can update own learning state"
  on public.user_learning_states
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Users can delete own learning state" on public.user_learning_states;
create policy "Users can delete own learning state"
  on public.user_learning_states
  for delete
  using (auth.uid() = user_id);
