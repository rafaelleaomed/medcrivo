-- Itens das ferramentas de criação: pautas (ideas), sequências de stories (stories) e conversas do assistente (chat).
-- O conteúdo varia por ferramenta, por isso fica em `payload` (jsonb). RLS por dono, como as demais tabelas.
create table public.studio_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  kind text not null check (kind in ('ideas', 'stories', 'chat')),
  title text not null default '' check (char_length(title) <= 200),
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index studio_items_user_kind_updated_idx on public.studio_items (user_id, kind, updated_at desc);

create trigger studio_items_touch before update on public.studio_items
  for each row execute function public.touch_updated_at();

alter table public.studio_items enable row level security;

create policy "dono lê os próprios itens" on public.studio_items for select
  to authenticated using ((select auth.uid()) = user_id);
create policy "dono cria os próprios itens" on public.studio_items for insert
  to authenticated with check ((select auth.uid()) = user_id);
create policy "dono atualiza os próprios itens" on public.studio_items for update
  to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "dono apaga os próprios itens" on public.studio_items for delete
  to authenticated using ((select auth.uid()) = user_id);

-- Privilégios mínimos (os padrões do Supabase concedem ALL, inclusive TRUNCATE, que não passa por RLS).
revoke all on public.studio_items from anon, authenticated;
grant select, insert, update, delete on public.studio_items to authenticated;
