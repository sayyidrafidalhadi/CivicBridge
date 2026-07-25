-- CivicBridge Database Schema
-- Run this in your Supabase SQL Editor

-- 0. Extensions
create extension if not exists "uuid-ossp";

-- 1. Profiles table
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  email text not null,
  role text not null default 'citizen' check (role in ('citizen', 'officer', 'admin')),
  created_at timestamptz not null default now()
);

alter table profiles enable row level security;

-- 2. Complaints table
create table if not exists complaints (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text not null,
  category text not null,
  image_url text,
  latitude double precision,
  longitude double precision,
  status text not null default 'submitted' check (status in ('submitted', 'under_review', 'in_progress', 'resolved')),
  user_id uuid not null references profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table complaints enable row level security;

-- 3. Comments table (optional)
create table if not exists comments (
  id uuid primary key default uuid_generate_v4(),
  complaint_id uuid not null references complaints(id) on delete cascade,
  user_id uuid not null references profiles(id) on delete cascade,
  message text not null,
  created_at timestamptz not null default now()
);

alter table comments enable row level security;

-- 4. Indexes
create index if not exists complaints_status_idx on complaints(status);
create index if not exists complaints_user_id_idx on complaints(user_id);
create index if not exists complaints_created_at_idx on complaints(created_at desc);
create index if not exists comments_complaint_id_idx on comments(complaint_id);

-- 5. Auto-update updated_at
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists complaints_updated_at on complaints;
create trigger complaints_updated_at
  before update on complaints
  for each row execute function update_updated_at();

-- 6. Row Level Security Policies

-- Profiles: users can read all profiles, insert/update only own
create policy "Anyone can view profiles"
  on profiles for select
  using (true);

create policy "Users can insert own profile"
  on profiles for insert
  with check (auth.uid() = id);

create policy "Users can update own profile"
  on profiles for update
  using (auth.uid() = id);

-- Complaints: citizens create, officers manage, everyone reads
create policy "Anyone can view complaints"
  on complaints for select
  using (true);

create policy "Citizens can create complaints"
  on complaints for insert
  with check (
    auth.uid() = user_id
    and exists (
      select 1 from profiles
      where id = auth.uid()
      and role in ('citizen', 'admin')
    )
  );

create policy "Citizens can update own complaints"
  on complaints for update
  using (
    auth.uid() = user_id
    and exists (
      select 1 from profiles
      where id = auth.uid()
      and role in ('citizen', 'admin')
    )
  );

create policy "Officers can update any complaint status"
  on complaints for update
  using (
    exists (
      select 1 from profiles
      where id = auth.uid()
      and role in ('officer', 'admin')
    )
  );

-- Comments
create policy "Anyone can view comments"
  on comments for select
  using (true);

create policy "Authenticated users can comment"
  on comments for insert
  with check (auth.role() = 'authenticated');

-- 7. Storage bucket
insert into storage.buckets (id, name, public)
values ('complaint-images', 'complaint-images', true)
on conflict (id) do nothing;

create policy "Anyone can view complaint images"
  on storage.objects for select
  using (bucket_id = 'complaint-images');

create policy "Authenticated users can upload images"
  on storage.objects for insert
  with check (
    bucket_id = 'complaint-images'
    and auth.role() = 'authenticated'
  );
