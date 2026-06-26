-- ============================================================
-- KRONICA — Setup do blog/newsletter editorial
-- Cole esse script completo no SQL Editor do Supabase e clique em "Run"
-- (Esse script é adicional ao supabase/setup.sql que você já rodou)
-- ============================================================

-- 1. Tabela de posts
create table if not exists public.posts (
  id text primary key,
  title text not null,
  slug text not null unique,
  excerpt text not null,
  content text not null,
  cover_image text,
  status text not null default 'draft' check (status in ('draft', 'published')),
  tags text[] not null default '{}',
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_posts_status_published on public.posts (status, published_at desc);

-- 2. Atualiza "updated_at" automaticamente
drop trigger if exists trg_posts_updated_at on public.posts;
create trigger trg_posts_updated_at
  before update on public.posts
  for each row execute function public.set_updated_at();

-- 3. Habilita Row Level Security
alter table public.posts enable row level security;

-- 4. Qualquer visitante pode ver posts PUBLICADOS
drop policy if exists "Posts publicados são públicos" on public.posts;
create policy "Posts publicados são públicos"
  on public.posts for select
  to anon
  using (status = 'published');

-- 5. Usuários autenticados (você) veem todos, incluindo rascunhos
drop policy if exists "Autenticados veem todos os posts" on public.posts;
create policy "Autenticados veem todos os posts"
  on public.posts for select
  to authenticated
  using (true);

-- 6. Só autenticados podem inserir/editar/excluir
drop policy if exists "Autenticados podem inserir posts" on public.posts;
create policy "Autenticados podem inserir posts"
  on public.posts for insert
  to authenticated
  with check (true);

drop policy if exists "Autenticados podem editar posts" on public.posts;
create policy "Autenticados podem editar posts"
  on public.posts for update
  to authenticated
  using (true);

drop policy if exists "Autenticados podem excluir posts" on public.posts;
create policy "Autenticados podem excluir posts"
  on public.posts for delete
  to authenticated
  using (true);

-- 7. Bucket de imagens dos posts (reaproveita o mesmo padrão dos projetos)
insert into storage.buckets (id, name, public)
values ('post-images', 'post-images', true)
on conflict (id) do nothing;

drop policy if exists "Imagens de posts são públicas para leitura" on storage.objects;
create policy "Imagens de posts são públicas para leitura"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'post-images');

drop policy if exists "Autenticados podem subir imagens de posts" on storage.objects;
create policy "Autenticados podem subir imagens de posts"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'post-images');

drop policy if exists "Autenticados podem excluir imagens de posts" on storage.objects;
create policy "Autenticados podem excluir imagens de posts"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'post-images');

-- ============================================================
-- Fim do script
-- ============================================================
