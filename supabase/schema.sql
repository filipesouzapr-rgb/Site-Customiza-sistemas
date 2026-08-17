-- Schema do banco Supabase — documentação versionada.
--
-- As tabelas abaixo já existem no projeto Supabase; este arquivo NÃO precisa
-- ser executado. Ele documenta o schema atual (colunas, chaves, RLS) tal
-- como introspectado via information_schema/pg_policies em 2026-08-15,
-- para ter o histórico do banco acompanhando o código no repositório.
--
-- Projeto: lrmrrxoyxubdkchmhyec.supabase.co

-- =========================================================================
-- clientes
-- =========================================================================
-- Um registro por usuário autenticado: id é o mesmo uuid de auth.users(id)
-- (não tem valor default — é preenchido a partir do usuário logado, não
-- gerado pela tabela).
create table if not exists public.clientes (
  id uuid primary key references auth.users (id),
  nome text not null,
  empresa text,
  created_at timestamptz default now()
);

alter table public.clientes enable row level security;

-- Cada cliente só enxerga o próprio cadastro. Não há política de
-- INSERT/UPDATE/DELETE para o público — a criação do registro é feita por
-- fora (ex: trigger no signup ou papel service_role), não pelo cliente.
create policy "Cliente vê o próprio cadastro"
  on public.clientes
  for select
  to public
  using (auth.uid() = id);

-- =========================================================================
-- chamados
-- =========================================================================
create table if not exists public.chamados (
  id uuid primary key default gen_random_uuid(),
  cliente_id uuid not null references public.clientes (id),
  titulo text not null,
  descricao text not null,
  tipo text not null,
  status text not null default 'aberto',
  created_at timestamptz default now()
);

alter table public.chamados enable row level security;

-- Cliente só vê e cria os próprios chamados. Não há política de
-- UPDATE/DELETE para o público — alteração de status, por exemplo, deve
-- ser feita por outro papel (ex: painel administrativo/service_role).
create policy "Cliente vê os próprios chamados"
  on public.chamados
  for select
  to public
  using (auth.uid() = cliente_id);

create policy "Cliente cria os próprios chamados"
  on public.chamados
  for insert
  to public
  with check (auth.uid() = cliente_id);

-- =========================================================================
-- anexos_chamado
-- =========================================================================
create table if not exists public.anexos_chamado (
  id uuid primary key default gen_random_uuid(),
  chamado_id uuid not null references public.chamados (id),
  nome_arquivo text not null,
  url text not null,
  tamanho integer,
  created_at timestamptz default now()
);

alter table public.anexos_chamado enable row level security;

-- Acesso ao anexo segue o dono do chamado ao qual ele pertence. Também sem
-- política de UPDATE/DELETE para o público.
create policy "Cliente vê os próprios anexos"
  on public.anexos_chamado
  for select
  to public
  using (
    chamado_id in (
      select id from public.chamados where cliente_id = auth.uid()
    )
  );

create policy "Cliente cria os próprios anexos"
  on public.anexos_chamado
  for insert
  to public
  with check (
    chamado_id in (
      select id from public.chamados where cliente_id = auth.uid()
    )
  );

-- =========================================================================
-- admins
-- =========================================================================
-- Ao contrário das tabelas acima, esta ainda precisa ser criada — rode este
-- bloco no SQL Editor do Supabase antes de considerar o schema.sql
-- atualizado com a realidade do banco.
--
-- Lista de permissão de administradores: user_id é o mesmo uuid de
-- auth.users(id). RLS habilitada e SEM NENHUMA política — isso nega acesso
-- por padrão a `anon` e `authenticated`; só o papel service_role (que tem
-- BYPASSRLS no Supabase) consegue ler ou escrever aqui. Não use a chave
-- anon/publishable para consultar esta tabela pelo app: ela sempre virá
-- vazia.
create table if not exists public.admins (
  user_id uuid primary key references auth.users (id)
);

alter table public.admins enable row level security;
