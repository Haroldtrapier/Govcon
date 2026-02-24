-- Create grant_applications table for tracking grant applications
create table if not exists grant_applications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  grant_title text not null,
  agency text,
  amount text,
  deadline timestamptz,
  submitted_date timestamptz,
  status text not null default 'draft' check (status in ('draft', 'in_review', 'submitted', 'awarded', 'rejected', 'pending')),
  completion_percent integer default 0 check (completion_percent >= 0 and completion_percent <= 100),
  notes text,
  cfda_number text,
  grant_id text,
  metadata jsonb default '{}',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists grant_applications_user_id_idx on grant_applications(user_id);
create index if not exists grant_applications_status_idx on grant_applications(status);
create index if not exists grant_applications_deadline_idx on grant_applications(deadline);

alter table grant_applications enable row level security;

create policy "Users can view own grant applications"
  on grant_applications for select
  using (auth.uid() = user_id);

create policy "Users can insert own grant applications"
  on grant_applications for insert
  with check (auth.uid() = user_id);

create policy "Users can update own grant applications"
  on grant_applications for update
  using (auth.uid() = user_id);

create policy "Users can delete own grant applications"
  on grant_applications for delete
  using (auth.uid() = user_id);

create trigger update_grant_applications_updated_at
  before update on grant_applications
  for each row
  execute function update_updated_at_column();

-- Create saved_grants table for bookmarked grants
create table if not exists saved_grants (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  grant_id text not null,
  title text not null,
  agency text,
  amount text,
  deadline timestamptz,
  category text,
  notes text,
  metadata jsonb default '{}',
  created_at timestamptz default now()
);

create index if not exists saved_grants_user_id_idx on saved_grants(user_id);
create unique index if not exists saved_grants_user_grant_idx on saved_grants(user_id, grant_id);

alter table saved_grants enable row level security;

create policy "Users can view own saved grants"
  on saved_grants for select
  using (auth.uid() = user_id);

create policy "Users can insert own saved grants"
  on saved_grants for insert
  with check (auth.uid() = user_id);

create policy "Users can delete own saved grants"
  on saved_grants for delete
  using (auth.uid() = user_id);

-- Create grant_tracking table for active grant management
create table if not exists grant_tracking (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  application_id uuid references grant_applications(id) on delete set null,
  title text not null,
  agency text,
  award_amount numeric,
  start_date timestamptz,
  end_date timestamptz,
  funds_spent numeric default 0,
  status text default 'active' check (status in ('active', 'closeout', 'completed')),
  milestones jsonb default '[]',
  reporting_schedule jsonb default '[]',
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists grant_tracking_user_id_idx on grant_tracking(user_id);
create index if not exists grant_tracking_status_idx on grant_tracking(status);

alter table grant_tracking enable row level security;

create policy "Users can view own grant tracking"
  on grant_tracking for select
  using (auth.uid() = user_id);

create policy "Users can insert own grant tracking"
  on grant_tracking for insert
  with check (auth.uid() = user_id);

create policy "Users can update own grant tracking"
  on grant_tracking for update
  using (auth.uid() = user_id);

create policy "Users can delete own grant tracking"
  on grant_tracking for delete
  using (auth.uid() = user_id);

create trigger update_grant_tracking_updated_at
  before update on grant_tracking
  for each row
  execute function update_updated_at_column();
