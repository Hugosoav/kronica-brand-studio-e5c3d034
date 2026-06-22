-- ============================================================
-- KRONICA — Setup do banco de dados de projetos
-- Cole esse script completo no SQL Editor do Supabase e clique em "Run"
-- ============================================================

-- 1. Tabela de projetos
create table if not exists public.projects (
  id text primary key,
  title text not null,
  category text not null,
  description text not null,
  full_description text not null,
  concept text not null,
  year text not null,
  client text,
  services text[] not null default '{}',
  tags text[] not null default '{}',
  cover_image text not null,
  gallery_images text[] not null default '{}',
  brand_history text,
  brand_voice_tone text,
  brand_values text[],
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2. Atualiza "updated_at" automaticamente
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_projects_updated_at on public.projects;
create trigger trg_projects_updated_at
  before update on public.projects
  for each row execute function public.set_updated_at();

-- 3. Habilita Row Level Security
alter table public.projects enable row level security;

-- 4. Qualquer visitante pode VISUALIZAR os projetos (necessário pro site público)
drop policy if exists "Projetos são públicos para leitura" on public.projects;
create policy "Projetos são públicos para leitura"
  on public.projects for select
  to anon, authenticated
  using (true);

-- 5. Só usuários autenticados (você, logado no /admin) podem inserir
drop policy if exists "Usuários autenticados podem inserir" on public.projects;
create policy "Usuários autenticados podem inserir"
  on public.projects for insert
  to authenticated
  with check (true);

-- 6. Só usuários autenticados podem editar
drop policy if exists "Usuários autenticados podem editar" on public.projects;
create policy "Usuários autenticados podem editar"
  on public.projects for update
  to authenticated
  using (true);

-- 7. Só usuários autenticados podem excluir
drop policy if exists "Usuários autenticados podem excluir" on public.projects;
create policy "Usuários autenticados podem excluir"
  on public.projects for delete
  to authenticated
  using (true);

-- 8. Bucket de armazenamento para as imagens (sem compressão/transformação)
insert into storage.buckets (id, name, public)
values ('project-images', 'project-images', true)
on conflict (id) do nothing;

-- 9. Qualquer visitante pode visualizar as imagens (necessário pro site público)
drop policy if exists "Imagens são públicas para leitura" on storage.objects;
create policy "Imagens são públicas para leitura"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'project-images');

-- 10. Só usuários autenticados podem subir imagens
drop policy if exists "Usuários autenticados podem subir imagens" on storage.objects;
create policy "Usuários autenticados podem subir imagens"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'project-images');

-- 11. Só usuários autenticados podem excluir imagens
drop policy if exists "Usuários autenticados podem excluir imagens" on storage.objects;
create policy "Usuários autenticados podem excluir imagens"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'project-images');

-- ============================================================
-- Fim do script
-- ============================================================
