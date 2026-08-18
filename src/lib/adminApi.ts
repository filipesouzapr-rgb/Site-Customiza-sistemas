import { supabase } from "./supabaseClient";

export interface CriarClientePayload {
  nome: string;
  email: string;
  empresa?: string;
  senha: string;
  sistemas?: string[];
}

export interface ChamadoAdmin {
  id: string;
  titulo: string;
  descricao: string;
  tipo: string;
  status: string;
  created_at: string;
  cliente_id: string;
  cliente_nome: string | null;
}

interface ApiResult<T> {
  ok: boolean;
  status: number;
  data: T & { error?: string };
}

async function authHeaders(): Promise<Record<string, string>> {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

interface ClienteCriado {
  id: string;
  nome: string;
  email: string;
  empresa: string | null;
}

export async function criarCliente(
  payload: CriarClientePayload,
): Promise<ApiResult<{ cliente?: ClienteCriado }>> {
  const response = await fetch("/api/admin/criar-cliente", {
    method: "POST",
    headers: { "Content-Type": "application/json", ...(await authHeaders()) },
    body: JSON.stringify(payload),
  });
  const data = await response.json();
  return { ok: response.ok, status: response.status, data };
}

export async function listarChamados(): Promise<ApiResult<{ chamados: ChamadoAdmin[] }>> {
  const response = await fetch("/api/admin/listar-chamados", {
    headers: await authHeaders(),
  });
  const data = await response.json();
  return { ok: response.ok, status: response.status, data };
}

export async function atualizarStatus(
  chamadoId: string,
  status: string,
): Promise<ApiResult<{ ok: boolean }>> {
  const response = await fetch("/api/admin/atualizar-status", {
    method: "POST",
    headers: { "Content-Type": "application/json", ...(await authHeaders()) },
    body: JSON.stringify({ chamado_id: chamadoId, status }),
  });
  const data = await response.json();
  return { ok: response.ok, status: response.status, data };
}

export interface ComentarioAdmin {
  id: string;
  chamado_id: string;
  autor_tipo: string;
  mensagem: string;
  created_at: string;
}

export async function listarComentarios(
  chamadoId: string,
): Promise<ApiResult<{ comentarios: ComentarioAdmin[] }>> {
  const response = await fetch(
    `/api/admin/listar-comentarios?chamado_id=${encodeURIComponent(chamadoId)}`,
    { headers: await authHeaders() },
  );
  const data = await response.json();
  return { ok: response.ok, status: response.status, data };
}

export async function responderChamado(
  chamadoId: string,
  mensagem: string,
): Promise<ApiResult<{ comentario?: ComentarioAdmin }>> {
  const response = await fetch("/api/admin/responder-chamado", {
    method: "POST",
    headers: { "Content-Type": "application/json", ...(await authHeaders()) },
    body: JSON.stringify({ chamado_id: chamadoId, mensagem }),
  });
  const data = await response.json();
  return { ok: response.ok, status: response.status, data };
}

export interface AnexoAdmin {
  id: string;
  nome_arquivo: string;
  tamanho: number | null;
  signedUrl: string | null;
}

export async function listarAnexos(chamadoId: string): Promise<ApiResult<{ anexos: AnexoAdmin[] }>> {
  const response = await fetch(
    `/api/admin/listar-anexos?chamado_id=${encodeURIComponent(chamadoId)}`,
    { headers: await authHeaders() },
  );
  const data = await response.json();
  return { ok: response.ok, status: response.status, data };
}

export interface Sistema {
  id: string;
  nome: string;
  created_at: string;
}

// A tabela `sistemas` tem leitura aberta a usuários autenticados via RLS,
// então a listagem consulta o Supabase diretamente — sem endpoint próprio.
export async function listarSistemas(): Promise<{ data: Sistema[]; error: string | null }> {
  const { data, error } = await supabase.from("sistemas").select("id, nome, created_at").order("nome");
  if (error) {
    return { data: [], error: error.message };
  }
  return { data: data ?? [], error: null };
}

export async function criarSistema(nome: string): Promise<ApiResult<{ sistema?: Sistema }>> {
  const response = await fetch("/api/admin/criar-sistema", {
    method: "POST",
    headers: { "Content-Type": "application/json", ...(await authHeaders()) },
    body: JSON.stringify({ nome }),
  });
  const data = await response.json();
  return { ok: response.ok, status: response.status, data };
}
