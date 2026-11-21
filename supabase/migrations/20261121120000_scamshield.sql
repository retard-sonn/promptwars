create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  region text not null default 'in' check (region in ('in', 'us', 'uk', 'generic')),
  created_at timestamptz not null default now()
);
alter table public.profiles enable row level security;
create policy "profiles_select_own" on public.profiles for select to authenticated using ((select auth.uid()) = id);
create policy "profiles_insert_own" on public.profiles for insert to authenticated with check ((select auth.uid()) = id);
create policy "profiles_update_own" on public.profiles for update to authenticated using ((select auth.uid()) = id) with check ((select auth.uid()) = id);

create table public.reports (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  channel text not null check (channel in ('sms', 'whatsapp', 'email', 'unknown')),
  region text not null check (region in ('in', 'us', 'uk', 'generic')),
  verdict text not null check (verdict in ('Likely a scam', 'Suspicious', 'No clear signs of fraud', 'Not enough to tell')),
  score integer not null check (score between 0 and 100),
  confidence numeric not null check (confidence between 0 and 1),
  summary text not null,
  signals jsonb not null default '[]'::jsonb,
  urls jsonb not null default '[]'::jsonb,
  message_redacted text,
  message_hash text not null,
  provider_trace jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);
alter table public.reports enable row level security;
create policy "reports_select_own" on public.reports for select to authenticated using ((select auth.uid()) = user_id);
create policy "reports_insert_own" on public.reports for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "reports_delete_own" on public.reports for delete to authenticated using ((select auth.uid()) = user_id);
create index reports_user_created_idx on public.reports(user_id, created_at desc);

create table public.community_submissions (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid references auth.users(id) on delete set null,
  scam_type text not null,
  redacted_text text not null,
  sender_pattern text,
  domain text,
  status text not null default 'pending' check (status in ('pending', 'reviewed', 'accepted', 'rejected')),
  created_at timestamptz not null default now()
);
alter table public.community_submissions enable row level security;
create index community_status_created_idx on public.community_submissions(status, created_at desc);

create view public.report_trends with (security_invoker = true) as
select date_trunc('day', created_at) as day, region, verdict, count(*) as report_count
from public.reports
group by 1, 2, 3
having count(*) >= 5;
grant select on public.report_trends to authenticated;

insert into storage.buckets (id, name, public)
values ('screenshots', 'screenshots', false)
on conflict (id) do nothing;
create policy "screenshots_select_own" on storage.objects for select to authenticated using (bucket_id = 'screenshots' and owner_id = (select auth.uid()::text));
create policy "screenshots_insert_own" on storage.objects for insert to authenticated with check (bucket_id = 'screenshots' and owner_id = (select auth.uid()::text));
create policy "screenshots_update_own" on storage.objects for update to authenticated using (bucket_id = 'screenshots' and owner_id = (select auth.uid()::text)) with check (bucket_id = 'screenshots' and owner_id = (select auth.uid()::text));
create policy "screenshots_delete_own" on storage.objects for delete to authenticated using (bucket_id = 'screenshots' and owner_id = (select auth.uid()::text));
