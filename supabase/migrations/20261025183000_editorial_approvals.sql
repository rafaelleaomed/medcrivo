-- Estado da central editorial: uma decisão por peça, protegida por RLS do usuário.
alter table public.studio_items drop constraint if exists studio_items_kind_check;
alter table public.studio_items
  add constraint studio_items_kind_check
  check (kind in ('ideas', 'stories', 'chat', 'reels', 'approvals'));
