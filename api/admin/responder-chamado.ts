// Vercel Edge Function — registra a resposta de um administrador a um
// chamado. Restrito a administradores.
export const config = { runtime: "edge" };

import { json } from "../_lib/http";
import { requireAdmin } from "./_lib/adminAuth";

interface ResponderChamadoPayload {
  chamado_id: string;
  mensagem: string;
}

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function isValidPayload(body: unknown): body is ResponderChamadoPayload {
  if (!body || typeof body !== "object") return false;
  const b = body as Record<string, unknown>;
  return (
    typeof b.chamado_id === "string" &&
    UUID_REGEX.test(b.chamado_id) &&
    typeof b.mensagem === "string" &&
    b.mensagem.trim().length > 0
  );
}

export default async function handler(request: Request): Promise<Response> {
  if (request.method !== "POST") {
    return json({ ok: false, error: "Método não permitido." }, 405);
  }

  const admin = await requireAdmin(request);
  if (!admin.ok) return admin.response;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, error: "JSON inválido." }, 400);
  }

  if (!isValidPayload(body)) {
    return json({ ok: false, error: "Dados inválidos." }, 400);
  }

  const { data, error } = await admin.supabase
    .from("comentarios_chamado")
    .insert({
      chamado_id: body.chamado_id,
      autor_tipo: "admin",
      mensagem: body.mensagem.trim(),
    })
    .select("id, chamado_id, autor_tipo, mensagem, created_at")
    .single();

  if (error || !data) {
    console.error("Falha ao responder chamado:", error);
    return json({ ok: false, error: "Não foi possível enviar a resposta." }, 500);
  }

  return json({ ok: true, comentario: data }, 201);
}
