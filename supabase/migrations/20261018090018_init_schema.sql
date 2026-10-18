-- Esquema inicial: perfil do profissional, jobs de geração, posts e uso de IA.
-- Todas as tabelas ficam em `public` (exposto pela Data API), por isso RLS é obrigatório
-- e cada política combina `to authenticated` com o predicado de dono.

create table public.doctor_profiles (
  user_id uuid primary key references auth.users (id) on delete cascade,
  name text not null default '',
  profession text not null default 'medico' check (profession in ('medico', 'dentista')),
  specialty text not null default '',
  council_id text not null default '',          -- CRM/UF ou CRO/UF
  rqe text not null default '',
  instagram text not null default '',
  tiktok text not null default '',
  youtube text not null default '',
  booking_link text not null default '',
  interests text[] not null default '{}',
  audience_pains text[] not null default '{}',
  tone text not null default 'didatico',
  brand jsonb not null default '{}'::jsonb,     -- { primary, accent, background, headlineFont }
  onboarded boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  topic text not null,
  status text not null default 'draft' check (status in ('draft', 'approved', 'scheduled', 'published')),
  draft jsonb not null,
  compliance jsonb,
  evidence jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index posts_user_created_idx on public.posts (user_id, created_at desc);

create table public.generation_jobs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  kind text not null check (kind in ('carousel')),
  status text not null default 'queued' check (status in ('queued', 'running', 'done', 'failed')),
  progress integer not null default 0 check (progress between 0 and 100),
  step text not null default 'Na fila',
  input jsonb not null,
  post_id uuid references public.posts (id) on delete set null,
  error text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index generation_jobs_user_created_idx on public.generation_jobs (user_id, created_at desc);
create index generation_jobs_post_id_idx on public.generation_jobs (post_id);

create table public.ai_usage_events (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  job_id uuid references public.generation_jobs (id) on delete set null,
  model text not null,
  input_tokens integer not null default 0,
  output_tokens integer not null default 0,
  created_at timestamptz not null default now()
);
create index ai_usage_events_user_created_idx on public.ai_usage_events (user_id, created_at desc);
create index ai_usage_events_job_id_idx on public.ai_usage_events (job_id);

-- updated_at automático (SECURITY INVOKER: só toca a linha que o próprio usuário já pode alterar)
create function public.touch_updated_at() returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create trigger doctor_profiles_touch before update on public.doctor_profiles
  for each row execute function public.touch_updated_at();
create trigger posts_touch before update on public.posts
  for each row execute function public.touch_updated_at();
create trigger generation_jobs_touch before update on public.generation_jobs
  for each row execute function public.touch_updated_at();

-- RLS
alter table public.doctor_profiles enable row level security;
alter table public.posts enable row level security;
alter table public.generation_jobs enable row level security;
alter table public.ai_usage_events enable row level security;

create policy "dono lê o próprio perfil" on public.doctor_profiles for select
  to authenticated using ((select auth.uid()) = user_id);
create policy "dono cria o próprio perfil" on public.doctor_profiles for insert
  to authenticated with check ((select auth.uid()) = user_id);
create policy "dono atualiza o próprio perfil" on public.doctor_profiles for update
  to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

create policy "dono lê os próprios posts" on public.posts for select
  to authenticated using ((select auth.uid()) = user_id);
create policy "dono cria os próprios posts" on public.posts for insert
  to authenticated with check ((select auth.uid()) = user_id);
create policy "dono atualiza os próprios posts" on public.posts for update
  to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "dono apaga os próprios posts" on public.posts for delete
  to authenticated using ((select auth.uid()) = user_id);

create policy "dono lê os próprios jobs" on public.generation_jobs for select
  to authenticated using ((select auth.uid()) = user_id);
create policy "dono cria os próprios jobs" on public.generation_jobs for insert
  to authenticated with check ((select auth.uid()) = user_id);
create policy "dono atualiza os próprios jobs" on public.generation_jobs for update
  to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

create policy "dono lê o próprio uso de IA" on public.ai_usage_events for select
  to authenticated using ((select auth.uid()) = user_id);
create policy "dono registra o próprio uso de IA" on public.ai_usage_events for insert
  to authenticated with check ((select auth.uid()) = user_id);

-- Acesso pela Data API (RLS acima restringe as linhas). Visitantes anônimos não acessam nada.
revoke all on public.doctor_profiles, public.posts, public.generation_jobs, public.ai_usage_events from anon;
grant select, insert, update on public.doctor_profiles to authenticated;
grant select, insert, update, delete on public.posts to authenticated;
grant select, insert, update on public.generation_jobs to authenticated;
grant select, insert on public.ai_usage_events to authenticated;
