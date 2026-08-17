import { supabase } from "./supabaseClient";

export interface CriarClientePayload {
  nome: string;
  email: string;
  empresa?: string;
  senha: string;
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
