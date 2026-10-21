-- Novo tipo de item: roteiros de Reels/TikTok (3 opções por pedido).
alter table public.studio_items drop constraint studio_items_kind_check;
alter table public.studio_items
  add constraint studio_items_kind_check check (kind in ('ideas', 'stories', 'chat', 'reels'));
