-- CivicBridge Database Schema
-- Run ONE statement at a time in the SQL Editor.
-- If a statement errors, just skip it and continue.

-- === STEP 1: Authorities table ===
create table if not exists authorities (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  type text not null check (type in ('mla','mp','ward_member','panchayat','municipality','corporation','water_authority','electricity_board','other')),
  jurisdiction text not null default '',
  email text not null default '',
  phone text,
  created_at timestamptz not null default now()
);

alter table authorities enable row level security;

-- === STEP 2: Add authority_id to profiles ===
alter table profiles add column if not exists authority_id uuid references authorities(id) on delete set null;

-- === STEP 3: Add columns to complaints ===
alter table complaints add column if not exists case_number text;
alter table complaints add column if not exists assigned_to uuid;

-- === STEP 4: Backfill case numbers ===
update complaints set case_number = 'CB-' || to_char(created_at, 'YYYY') || '-' || upper(substr(md5(id::text), 1, 6)) where case_number is null;

-- === STEP 5: Enforce NOT NULL ===
alter table complaints alter column case_number set not null;

-- === STEP 6: Add constraints ===
alter table complaints add constraint unique_case_number unique (case_number);
alter table complaints add constraint complaints_assigned_to_fkey foreign key (assigned_to) references authorities(id) on delete cascade;

alter table complaints enable row level security;

-- === STEP 7: Comments table ===
create table if not exists comments (
  id uuid primary key default gen_random_uuid(),
  complaint_id uuid not null references complaints(id) on delete cascade,
  user_id uuid not null references profiles(id) on delete cascade,
  message text not null,
  created_at timestamptz not null default now()
);

alter table comments enable row level security;

-- === STEP 8: Indexes ===
create index if not exists complaints_status_idx on complaints(status);
create index if not exists complaints_user_id_idx on complaints(user_id);
create index if not exists complaints_assigned_to_idx on complaints(assigned_to);
create index if not exists complaints_case_number_idx on complaints(case_number);
create index if not exists complaints_created_at_idx on complaints(created_at desc);
create index if not exists comments_complaint_id_idx on comments(complaint_id);
create index if not exists profiles_authority_id_idx on profiles(authority_id);

-- === STEP 9: Trigger ===
create or replace function update_updated_at()
returns trigger as $$ begin new.updated_at = now(); return new; end; $$ language plpgsql;
drop trigger if exists complaints_updated_at on complaints;
create trigger complaints_updated_at before update on complaints for each row execute function update_updated_at();

-- === STEP 10: RLS Policies ===
drop policy if exists "Anyone can view authorities" on authorities;
create policy "Anyone can view authorities" on authorities for select using (true);

drop policy if exists "Anyone can view profiles" on profiles;
create policy "Anyone can view profiles" on profiles for select using (true);
drop policy if exists "Users can insert own profile" on profiles;
create policy "Users can insert own profile" on profiles for insert with check (auth.uid() = id);
drop policy if exists "Users can update own profile" on profiles;
create policy "Users can update own profile" on profiles for update using (auth.uid() = id);

drop policy if exists "Anyone can view complaints" on complaints;
create policy "Anyone can view complaints" on complaints for select using (true);
drop policy if exists "Citizens can create complaints" on complaints;
create policy "Citizens can create complaints" on complaints for insert with check (auth.uid() = user_id and exists (select 1 from profiles where id = auth.uid() and role in ('citizen', 'admin')));
drop policy if exists "Citizens can update own complaints" on complaints;
create policy "Citizens can update own complaints" on complaints for update using (auth.uid() = user_id and exists (select 1 from profiles where id = auth.uid() and role in ('citizen', 'admin')));
drop policy if exists "Officers can view assigned complaints" on complaints;
create policy "Officers can view assigned complaints" on complaints for select using (exists (select 1 from profiles p where p.id = auth.uid() and p.role in ('officer', 'admin') and (p.authority_id = complaints.assigned_to or p.role = 'admin')));
drop policy if exists "Officers can update assigned complaints" on complaints;
create policy "Officers can update assigned complaints" on complaints for update using (exists (select 1 from profiles p where p.id = auth.uid() and p.role in ('officer', 'admin') and (p.authority_id = complaints.assigned_to or p.role = 'admin')));

drop policy if exists "Anyone can view comments" on comments;
create policy "Anyone can view comments" on comments for select using (true);
drop policy if exists "Authenticated users can comment" on comments;
create policy "Authenticated users can comment" on comments for insert with check (auth.role() = 'authenticated');

-- === STEP 11: Seed authorities ===
insert into authorities (name, type, jurisdiction, email) values
  ('Water Authority', 'water_authority', 'City Wide', 'water@example.com'),
  ('Electricity Board', 'electricity_board', 'City Wide', 'electricity@example.com'),
  ('Municipal Corporation', 'corporation', 'City Wide', 'corporation@example.com'),
  ('MLA Office', 'mla', 'Constituency', 'mla@example.com'),
  ('MP Office', 'mp', 'Parliamentary Constituency', 'mp@example.com'),
  ('Ward Member Office', 'ward_member', 'Ward', 'ward@example.com'),
  ('Panchayat Office', 'panchayat', 'Panchayat', 'panchayat@example.com')
on conflict (id) do nothing;

-- === STEP 12: Storage bucket ===
insert into storage.buckets (id, name, public)
values ('complaint-images', 'complaint-images', true)
on conflict (id) do nothing;
drop policy if exists "Anyone can view complaint images" on storage.objects;
create policy "Anyone can view complaint images" on storage.objects for select using (bucket_id = 'complaint-images');
drop policy if exists "Authenticated users can upload images" on storage.objects;
create policy "Authenticated users can upload images" on storage.objects for insert with check (bucket_id = 'complaint-images' and auth.role() = 'authenticated');
