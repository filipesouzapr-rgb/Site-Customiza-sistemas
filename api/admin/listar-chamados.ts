// Vercel Edge Function — lista todos os chamados de todos os clientes,
// com o nome do cliente. Restrito a administradores.
export const config = { runtime: "edge" };

import { json } from "../_lib/http";
import { requireAdmin } from "./_lib/adminAuth";

interface ChamadoRow {
  id: string;
  titulo: string;
  descricao: string;
  tipo: string;
  status: string;
  created_at: string;
  cliente_id: string;
  clientes: { nome: string } | null;
}

export default async function handler(request: Request): Promise<Response> {
  if (request.method !== "GET") {
    return json({ ok: false, error: "Método não permitido." }, 405);
  }

  const admin = await requireAdmin(request);
  if (!admin.ok) return admin.response;

  const { data, error } = await admin.supabase
    .from("chamados")
    .select("id, titulo, descricao, tipo, status, created_at, cliente_id, clientes(nome)")
    .order("created_at", { ascending: false })
    .returns<ChamadoRow[]>();

  if (error) {
    console.error("Falha ao listar chamados:", error);
    return json({ ok: false, error: "Não foi possível carregar os chamados." }, 500);
  }

  const chamados = (data ?? []).map((chamado) => ({
    id: chamado.id,
    titulo: chamado.titulo,
    descricao: chamado.descricao,
    tipo: chamado.tipo,
    status: chamado.status,
    created_at: chamado.created_at,
    cliente_id: chamado.cliente_id,
    cliente_nome: chamado.clientes?.nome ?? null,
  }));

  return json({ ok: true, chamados }, 200);
}
