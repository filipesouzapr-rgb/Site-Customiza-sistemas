// Vercel Edge Function — atualiza o status de um chamado. Restrito a
// administradores.
export const config = { runtime: "edge" };

import { json } from "../_lib/http";
import { requireAdmin } from "./_lib/adminAuth";

interface AtualizarStatusPayload {
  chamado_id: string;
  status: string;
}

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// Mesmos status que o front-end sabe estilizar (ver statusStyles em
// src/pages/AreaCliente/Chamados.tsx).
const VALID_STATUSES = ["aberto", "em_andamento", "resolvido", "fechado"];

function isValidPayload(body: unknown): body is AtualizarStatusPayload {
  if (!body || typeof body !== "object") return false;
  const b = body as Record<string, unknown>;
  return (
    typeof b.chamado_id === "string" &&
    UUID_REGEX.test(b.chamado_id) &&
    typeof b.status === "string" &&
    VALID_STATUSES.includes(b.status)
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
    .from("chamados")
    .update({ status: body.status })
    .eq("id", body.chamado_id)
    .select("id, status")
    .maybeSingle();

  if (error) {
    console.error("Falha ao atualizar chamado:", error);
    return json({ ok: false, error: "Não foi possível atualizar o chamado." }, 500);
  }

  if (!data) {
    return json({ ok: false, error: "Chamado não encontrado." }, 404);
  }

  return json({ ok: true, chamado: data }, 200);
}
