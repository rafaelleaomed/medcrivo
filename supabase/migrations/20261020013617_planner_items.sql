-- Planner: agendamentos do calendário editorial. Cada item é um post salvo (post_id) ou um item livre
-- (título, formato, data/hora e nota). Sem publicação automática nesta etapa: é só o calendário.
create table public.planner_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  post_id uuid references public.posts (id) on delete cascade,
  title text not null check (char_length(title) between 1 and 200),
  format text not null default 'carrossel' check (format in ('carrossel', 'reels', 'stories', 'imagem')),
  scheduled_at timestamptz not null,
  note text not null default '' check (char_length(note) <= 1000),
  status text not null default 'planned' check (status in ('planned', 'published')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Consulta principal: itens do usuário num intervalo de datas (mês ou semana visível).
create index planner_items_user_scheduled_idx on public.planner_items (user_id, scheduled_at);
-- FK sem índice deixa o ON DELETE CASCADE de posts lento.
create index planner_items_post_id_idx on public.planner_items (post_id);

create trigger planner_items_touch before update on public.planner_items
  for each row execute function public.touch_updated_at();

alter table public.planner_items enable row level security;

create policy "dono lê os próprios agendamentos" on public.planner_items for select
  to authenticated using ((select auth.uid()) = user_id);

-- Ao vincular um post, ele também precisa ser do próprio usuário.
create policy "dono cria os próprios agendamentos" on public.planner_items for insert
  to authenticated with check (
    (select auth.uid()) = user_id
    and (post_id is null or exists (
      select 1 from public.posts p where p.id = post_id and p.user_id = (select auth.uid())
    ))
  );
create policy "dono atualiza os próprios agendamentos" on public.planner_items for update
  to authenticated using ((select auth.uid()) = user_id)
  with check (
    (select auth.uid()) = user_id
    and (post_id is null or exists (
      select 1 from public.posts p where p.id = post_id and p.user_id = (select auth.uid())
    ))
  );
create policy "dono apaga os próprios agendamentos" on public.planner_items for delete
  to authenticated using ((select auth.uid()) = user_id);

-- Privilégios mínimos (os padrões do Supabase concedem ALL, inclusive TRUNCATE, que não passa por RLS).
revoke all on public.planner_items from anon, authenticated;
grant select, insert, update, delete on public.planner_items to authenticated;
