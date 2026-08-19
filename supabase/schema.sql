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

-- Descoberta por tentativa e erro em 2026-08-18 (não aparece em
-- information_schema.table_constraints, só em pg_constraint) — o front-end
-- (NovoChamado.tsx) precisa enviar exatamente um destes 3 valores em
-- `tipo`, senão a inserção falha com 23514/check_violation.
alter table public.chamados
  add constraint chamados_tipo_check
  check (tipo in ('erro', 'melhoria', 'personalizacao'));

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
-- comentarios_chamado
-- =========================================================================
-- Já existia no banco, mas não estava documentada aqui — estrutura e
-- políticas descobertas em 2026-08-18 via introspecção (OpenAPI da
-- PostgREST) e testes de insert/select como cliente autenticado.
create table if not exists public.comentarios_chamado (
  id uuid primary key default gen_random_uuid(),
  chamado_id uuid not null references public.chamados (id),
  autor_tipo text not null,
  mensagem text not null,
  created_at timestamptz default now()
);

alter table public.comentarios_chamado enable row level security;

-- autor_tipo só aceita 'cliente' ou 'admin' (confirmado por tentativa).
alter table public.comentarios_chamado
  add constraint comentarios_chamado_autor_tipo_check
  check (autor_tipo in ('cliente', 'admin'));

-- Cliente vê os comentários dos próprios chamados (mesmo padrão de
-- anexos_chamado).
create policy "Cliente vê os comentários dos próprios chamados"
  on public.comentarios_chamado
  for select
  to public
  using (
    chamado_id in (
      select id from public.chamados where cliente_id = auth.uid()
    )
  );

-- Cliente só consegue inserir comentário nos próprios chamados E só com
-- autor_tipo = 'cliente' — não dá para se passar por admin pela RLS
-- (confirmado: autor_tipo diferente de 'cliente' é rejeitado com 42501,
-- não com a check constraint). Postagem como 'admin' precisa vir de um
-- papel com mais privilégio (ex: futura function serverless com
-- service_role, mesmo padrão de api/admin/*).
create policy "Cliente comenta os próprios chamados"
  on public.comentarios_chamado
  for insert
  to public
  with check (
    autor_tipo = 'cliente'
    and chamado_id in (
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

-- =========================================================================
-- Storage: bucket anexos-chamados
-- =========================================================================
-- Também ainda precisa ser criado — rode no SQL Editor. Bucket privado
-- (public = false): os arquivos não têm URL pública, só ficam acessíveis
-- via URL assinada (supabase.storage.from(...).createSignedUrl(...)) para
-- quem passar nas políticas abaixo.
--
-- Caminho de cada arquivo: {cliente_id}/{nome-do-arquivo} — as políticas
-- usam storage.foldername(name)[1] (primeiro segmento do caminho) para
-- conferir se bate com o uuid do usuário autenticado.
insert into storage.buckets (id, name, public)
values ('anexos-chamados', 'anexos-chamados', false)
on conflict (id) do nothing;

create policy "Cliente faz upload dos próprios anexos"
  on storage.objects
  for insert
  to public
  with check (
    bucket_id = 'anexos-chamados'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Cliente vê os próprios anexos no storage"
  on storage.objects
  for select
  to public
  using (
    bucket_id = 'anexos-chamados'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- =========================================================================
-- Notificações por e-mail (gatilhos via pg_net)
-- =========================================================================
-- Ainda precisa ser criado — rode o bloco abaixo no SQL Editor do Supabase.
-- A UI de Database Webhooks (Studio > Database > Webhooks) não funciona
-- neste projeto (erro "schema supabase_functions does not exist" — parece
-- um problema de provisionamento; habilitar a extensão pg_net sozinha não
-- resolve porque a UI de Webhooks depende também do schema
-- supabase_functions, que é outra peça). Em vez da UI, os triggers abaixo
-- chamam net.http_post diretamente, o que só precisa da extensão pg_net
-- (schema `net`), sem depender de supabase_functions.
--
-- As duas Edge Functions que recebem essas chamadas são
-- api/webhooks/novo-chamado.ts e api/webhooks/nova-mensagem.ts; elas
-- conferem o mesmo segredo compartilhado (env var SUPABASE_WEBHOOK_SECRET,
-- já configurada no Vercel) enviado no header Authorization, então
-- qualquer request sem o header correto é rejeitado com 401 — o payload
-- JSON montado abaixo (type/table/schema/record/old_record) replica o
-- formato que a UI de Webhooks nativa enviaria, então as funções não
-- precisaram de nenhuma adaptação.
--
-- net.http_post é assíncrono (enfileira a chamada e retorna na hora) — o
-- INSERT do cliente não fica esperando o e-mail sair. Para depurar envios,
-- consulte a tabela de respostas do pg_net (o nome exato varia por versão,
-- geralmente net._http_response ou net.http_response):
--   select * from net._http_response order by created desc limit 5;
--
-- Troque <SUPABASE_WEBHOOK_SECRET> pelo valor real antes de rodar.

create extension if not exists pg_net with schema net;

create or replace function public.notificar_novo_chamado()
returns trigger
language plpgsql
security definer
set search_path = public, net
as $$
begin
  perform net.http_post(
    url := 'https://customizasistemas.com.br/api/webhooks/novo-chamado',
    body := jsonb_build_object(
      'type', 'INSERT',
      'table', 'chamados',
      'schema', 'public',
      'record', to_jsonb(new),
      'old_record', null
    ),
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer <SUPABASE_WEBHOOK_SECRET>'
    ),
    timeout_milliseconds := 5000
  );
  return new;
end;
$$;

drop trigger if exists trg_notificar_novo_chamado on public.chamados;
create trigger trg_notificar_novo_chamado
  after insert on public.chamados
  for each row
  execute function public.notificar_novo_chamado();

create or replace function public.notificar_nova_mensagem()
returns trigger
language plpgsql
security definer
set search_path = public, net
as $$
begin
  perform net.http_post(
    url := 'https://customizasistemas.com.br/api/webhooks/nova-mensagem',
    body := jsonb_build_object(
      'type', 'INSERT',
      'table', 'comentarios_chamado',
      'schema', 'public',
      'record', to_jsonb(new),
      'old_record', null
    ),
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer <SUPABASE_WEBHOOK_SECRET>'
    ),
    timeout_milliseconds := 5000
  );
  return new;
end;
$$;

-- Só dispara para mensagens de cliente — respostas do admin (via
-- api/admin/responder-chamado.ts) não geram notificação. O endpoint
-- também ignora autor_tipo='admin' por conta própria, então isso é só
-- para evitar uma chamada HTTP desnecessária.
drop trigger if exists trg_notificar_nova_mensagem on public.comentarios_chamado;
create trigger trg_notificar_nova_mensagem
  after insert on public.comentarios_chamado
  for each row
  when (new.autor_tipo = 'cliente')
  execute function public.notificar_nova_mensagem();

-- Variáveis de ambiente usadas pelos dois endpoints (Vercel):
--   SUPABASE_WEBHOOK_SECRET — segredo compartilhado com os triggers (obrigatória)
--   RESEND_API_KEY          — mesma usada por api/contato.ts (obrigatória)
--   CHAMADOS_TO_EMAIL       — opcional; se ausente, cai em CONTACT_TO_EMAIL
--                             e depois em customizasistemas@gmail.com
--   CONTACT_FROM_EMAIL      — opcional; mesmo remetente do contato se ausente
