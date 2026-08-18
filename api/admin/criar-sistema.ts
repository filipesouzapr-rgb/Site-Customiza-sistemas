// Vercel Edge Function — cadastra um novo sistema em `sistemas`. A tabela
// tem leitura aberta a autenticados (o front-end lista direto via Supabase),
// mas o insert é bloqueado por RLS — só passa pelo cliente service_role
// usado aqui. Restrito a administradores.
export const config = { runtime: "edge" };

import { json } from "../_lib/http";
import { requireAdmin } from "./_lib/adminAuth";

interface CriarSistemaPayload {
  nome: string;
}

function isValidPayload(body: unknown): body is CriarSistemaPayload {
  if (!body || typeof body !== "object") return false;
  const b = body as Record<string, unknown>;
  return typeof b.nome === "string" && b.nome.trim().length > 0;
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
    .from("sistemas")
    .insert({ nome: body.nome.trim() })
    .select("id, nome, created_at")
    .single();

  if (error || !data) {
    console.error("Falha ao inserir sistema:", error);
    return json({ ok: false, error: "Não foi possível cadastrar o sistema." }, 500);
  }

  return json({ ok: true, sistema: data }, 201);
}
