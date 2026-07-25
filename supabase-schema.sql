-- CivicBridge Database Schema v2
-- Idempotent migration — safe to run on existing tables

-- 0. Extensions
create extension if not exists "uuid-ossp";

-- 1. Authorities table
create table if not exists authorities (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  type text not null check (type in ('mla','mp','ward_member','panchayat','municipality','corporation','water_authority','electricity_board','other')),
  jurisdiction text not null default '',
  email text not null default '',
  phone text,
  created_at timestamptz not null default now()
);

alter table authorities enable row level security;

-- 2. Profiles table
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  email text not null,
  role text not null default 'citizen' check (role in ('citizen', 'officer', 'admin')),
  authority_id uuid references authorities(id) on delete set null,
  created_at timestamptz not null default now()
);

alter table profiles enable row level security;

-- 3. Complaints table — alter existing if needed
create table if not exists complaints (
  id uuid primary key default uuid_generate_v4(),
  case_number text,
  title text not null,
  description text not null,
  category text not null,
  image_url text,
  latitude double precision,
  longitude double precision,
  status text not null default 'submitted' check (status in ('submitted', 'under_review', 'in_progress', 'resolved')),
  assigned_to uuid,
  user_id uuid not null references profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Add columns if table already existed without them
do $$
begin
  if not exists (select 1 from information_schema.columns where table_name = 'complaints' and column_name = 'case_number') then
    alter table complaints add column case_number text;
  end if;
  if not exists (select 1 from information_schema.columns where table_name = 'complaints' and column_name = 'assigned_to') then
    alter table complaints add column assigned_to uuid references authorities(id) on delete cascade;
  end if;
end $$;

-- Add unique constraint on case_number if not exists
do $$
begin
  if not exists (select 1 from information_schema.table_constraints where constraint_name = 'unique_case_number') then
    alter table complaints add constraint unique_case_number unique (case_number);
  end if;
end $$;

-- Migrate old data: set a default case_number for rows that don't have one
update complaints set case_number = 'CB-' || to_char(created_at, 'YYYY') || '-' || upper(substr(md5(id::text), 1, 6)) where case_number is null;

-- Make case_number not null going forward
alter table complaints alter column case_number set not null;

alter table complaints enable row level security;

-- 4. Comments table
create table if not exists comments (
  id uuid primary key default uuid_generate_v4(),
  complaint_id uuid not null references complaints(id) on delete cascade,
  user_id uuid not null references profiles(id) on delete cascade,
  message text not null,
  created_at timestamptz not null default now()
);

alter table comments enable row level security;

-- 5. Indexes (IF NOT EXISTS is not supported, using safe approach)
create index if not exists complaints_status_idx on complaints(status);
create index if not exists complaints_user_id_idx on complaints(user_id);
create index if not exists complaints_assigned_to_idx on complaints(assigned_to);
create index if not exists complaints_case_number_idx on complaints(case_number);
create index if not exists complaints_created_at_idx on complaints(created_at desc);
create index if not exists comments_complaint_id_idx on comments(complaint_id);
create index if not exists profiles_authority_id_idx on profiles(authority_id);

-- 6. Auto-update updated_at
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

-- 7. Row Level Security Policies

-- Authorities
create policy "Anyone can view authorities"
  on authorities for select
  using (true);

-- Profiles
create policy "Anyone can view profiles"
  on profiles for select
  using (true);

create policy "Users can insert own profile"
  on profiles for insert
  with check (auth.uid() = id);

create policy "Users can update own profile"
  on profiles for update
  using (auth.uid() = id);

-- Complaints
-- Drop old policies first to avoid conflicts
drop policy if exists "Anyone can view complaints" on complaints;
drop policy if exists "Citizens can create complaints" on complaints;
drop policy if exists "Citizens can update own complaints" on complaints;
drop policy if exists "Officers can view assigned complaints" on complaints;
drop policy if exists "Officers can update assigned complaints" on complaints;

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

create policy "Officers can view assigned complaints"
  on complaints for select
  using (
    exists (
      select 1 from profiles p
      where p.id = auth.uid()
      and p.role in ('officer', 'admin')
      and (p.authority_id = complaints.assigned_to or p.role = 'admin')
    )
  );

create policy "Officers can update assigned complaints"
  on complaints for update
  using (
    exists (
      select 1 from profiles p
      where p.id = auth.uid()
      and p.role in ('officer', 'admin')
      and (p.authority_id = complaints.assigned_to or p.role = 'admin')
    )
  );

-- Comments
create policy "Anyone can view comments"
  on comments for select
  using (true);

create policy "Authenticated users can comment"
  on comments for insert
  with check (auth.role() = 'authenticated');

-- 8. Seed default authorities
insert into authorities (name, type, jurisdiction, email) values
  ('Water Authority', 'water_authority', 'City Wide', 'water@example.com'),
  ('Electricity Board', 'electricity_board', 'City Wide', 'electricity@example.com'),
  ('Municipal Corporation', 'corporation', 'City Wide', 'corporation@example.com'),
  ('MLA Office', 'mla', 'Constituency', 'mla@example.com'),
  ('MP Office', 'mp', 'Parliamentary Constituency', 'mp@example.com')
on conflict (id) do nothing;

-- 9. Storage bucket
insert into storage.buckets (id, name, public)
values ('complaint-images', 'complaint-images', true)
on conflict (id) do nothing;

drop policy if exists "Anyone can view complaint images" on storage.objects;
create policy "Anyone can view complaint images"
  on storage.objects for select
  using (bucket_id = 'complaint-images');

drop policy if exists "Authenticated users can upload images" on storage.objects;
create policy "Authenticated users can upload images"
  on storage.objects for insert
  with check (
    bucket_id = 'complaint-images'
    and auth.role() = 'authenticated'
  );
