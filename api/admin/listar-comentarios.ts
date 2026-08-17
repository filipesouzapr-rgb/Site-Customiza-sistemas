// Vercel Edge Function — lista as mensagens de um chamado. Restrito a
// administradores.
export const config = { runtime: "edge" };

import { json } from "../_lib/http";
import { requireAdmin } from "./_lib/adminAuth";

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export default async function handler(request: Request): Promise<Response> {
  if (request.method !== "GET") {
    return json({ ok: false, error: "Método não permitido." }, 405);
  }

  const admin = await requireAdmin(request);
  if (!admin.ok) return admin.response;

  const chamadoId = new URL(request.url).searchParams.get("chamado_id");
  if (!chamadoId || !UUID_REGEX.test(chamadoId)) {
    return json({ ok: false, error: "chamado_id inválido." }, 400);
  }

  const { data, error } = await admin.supabase
    .from("comentarios_chamado")
    .select("id, chamado_id, autor_tipo, mensagem, created_at")
    .eq("chamado_id", chamadoId)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Falha ao listar comentários:", error);
    return json({ ok: false, error: "Não foi possível carregar as mensagens." }, 500);
  }

  return json({ ok: true, comentarios: data ?? [] }, 200);
}
