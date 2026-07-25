-- CivicBridge Database Schema — Fresh Install
-- Run this file in the Supabase SQL Editor

-- 0. Extensions
create extension if not exists "uuid-ossp";

-- 1. Authorities
create table authorities (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  type text not null check (type in ('mla','mp','ward_member','panchayat','municipality','corporation','water_authority','electricity_board','other')),
  jurisdiction text not null default '',
  email text not null default '',
  phone text,
  created_at timestamptz not null default now()
);
alter table authorities enable row level security;

-- 2. Profiles
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  email text not null,
  role text not null default 'citizen' check (role in ('citizen', 'officer', 'admin')),
  authority_id uuid references authorities(id) on delete set null,
  created_at timestamptz not null default now()
);
alter table profiles enable row level security;

-- 3. Complaints
create table complaints (
  id uuid primary key default uuid_generate_v4(),
  case_number text not null unique,
  title text not null,
  description text not null,
  category text not null,
  image_url text,
  latitude double precision,
  longitude double precision,
  status text not null default 'submitted' check (status in ('submitted', 'under_review', 'in_progress', 'resolved')),
  assigned_to uuid not null references authorities(id) on delete cascade,
  user_id uuid not null references profiles(id) on delete cascade,
  resolution_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table complaints enable row level security;

-- 4. Complaint action log (status update history)
create table complaint_actions (
  id uuid primary key default uuid_generate_v4(),
  complaint_id uuid not null references complaints(id) on delete cascade,
  officer_id uuid not null references profiles(id) on delete cascade,
  from_status text check (from_status in ('submitted', 'under_review', 'in_progress', 'resolved')),
  to_status text not null check (to_status in ('submitted', 'under_review', 'in_progress', 'resolved')),
  notes text,
  created_at timestamptz not null default now()
);
alter table complaint_actions enable row level security;

-- 5. Comments
create table comments (
  id uuid primary key default uuid_generate_v4(),
  complaint_id uuid not null references complaints(id) on delete cascade,
  user_id uuid not null references profiles(id) on delete cascade,
  message text not null,
  created_at timestamptz not null default now()
);
alter table comments enable row level security;

-- 5. Indexes
create index complaints_status_idx on complaints(status);
create index complaints_user_id_idx on complaints(user_id);
create index complaints_assigned_to_idx on complaints(assigned_to);
create index complaints_case_number_idx on complaints(case_number);
create index complaints_created_at_idx on complaints(created_at desc);
create index comments_complaint_id_idx on comments(complaint_id);
create index complaint_actions_complaint_id_idx on complaint_actions(complaint_id);
create index profiles_authority_id_idx on profiles(authority_id);

-- 6. Updated-at trigger
create or replace function update_updated_at()
returns trigger as $$ begin new.updated_at = now(); return new; end; $$ language plpgsql;
create trigger complaints_updated_at
  before update on complaints for each row execute function update_updated_at();

-- 7. RLS Policies
-- Authorities
create policy "Anyone can view authorities" on authorities for select using (true);

-- Profiles
create policy "Anyone can view profiles" on profiles for select using (true);
create policy "Users can insert own profile" on profiles for insert with check (auth.uid() = id);
create policy "Users can update own profile" on profiles for update using (auth.uid() = id);

-- Complaints
create policy "Anyone can view complaints" on complaints for select using (true);
create policy "Citizens can create complaints" on complaints for insert with check (
  auth.uid() = user_id and exists (select 1 from profiles where id = auth.uid() and role in ('citizen', 'admin'))
);
create policy "Citizens can update own complaints" on complaints for update using (
  auth.uid() = user_id and exists (select 1 from profiles where id = auth.uid() and role in ('citizen', 'admin'))
);
create policy "Officers can view assigned complaints" on complaints for select using (
  exists (select 1 from profiles p where p.id = auth.uid() and p.role in ('officer', 'admin') and (p.authority_id = complaints.assigned_to or p.role = 'admin'))
);
create policy "Officers can update assigned complaints" on complaints for update using (
  exists (select 1 from profiles p where p.id = auth.uid() and p.role in ('officer', 'admin') and (p.authority_id = complaints.assigned_to or p.role = 'admin'))
);

-- Complaint actions
create policy "Anyone can view complaint actions"
  on complaint_actions for select using (true);
create policy "Officers can insert complaint actions"
  on complaint_actions for insert with check (
    exists (select 1 from profiles where id = auth.uid() and role in ('officer', 'admin'))
  );

-- Comments
create policy "Anyone can view comments" on comments for select using (true);
create policy "Authenticated users can comment" on comments for insert with check (auth.role() = 'authenticated');

-- 8. Seed authorities
insert into authorities (name, type, jurisdiction, email) values
  ('Water Authority', 'water_authority', 'City Wide', 'water@example.com'),
  ('Electricity Board', 'electricity_board', 'City Wide', 'electricity@example.com'),
  ('Municipal Corporation', 'corporation', 'City Wide', 'corporation@example.com'),
  ('MLA Office', 'mla', 'Constituency', 'mla@example.com'),
  ('MP Office', 'mp', 'Parliamentary Constituency', 'mp@example.com'),
  ('Ward Member Office', 'ward_member', 'Ward', 'ward@example.com'),
  ('Panchayat Office', 'panchayat', 'Panchayat', 'panchayat@example.com');

-- 9. Storage bucket
insert into storage.buckets (id, name, public)
values ('complaint-images', 'complaint-images', true)
on conflict (id) do nothing;
create policy "Anyone can view complaint images" on storage.objects for select using (bucket_id = 'complaint-images');
create policy "Authenticated users can upload images" on storage.objects for insert with check (bucket_id = 'complaint-images' and auth.role() = 'authenticated');
