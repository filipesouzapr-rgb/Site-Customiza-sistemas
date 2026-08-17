// Vercel Edge Function — lista os anexos de um chamado, já com URLs
// assinadas do Storage (bucket privado). Restrito a administradores.
export const config = { runtime: "edge" };

import { json } from "../_lib/http";
import { requireAdmin } from "./_lib/adminAuth";

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const ANEXOS_BUCKET = "anexos-chamados";
const SIGNED_URL_EXPIRES_IN = 60 * 60; // 1 hora

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
    .from("anexos_chamado")
    .select("id, nome_arquivo, url, tamanho")
    .eq("chamado_id", chamadoId)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Falha ao listar anexos:", error);
    return json({ ok: false, error: "Não foi possível carregar os anexos." }, 500);
  }

  if (!data || data.length === 0) {
    return json({ ok: true, anexos: [] }, 200);
  }

  const paths = data.map((anexo) => anexo.url);
  const { data: signedUrls, error: signError } = await admin.supabase.storage
    .from(ANEXOS_BUCKET)
    .createSignedUrls(paths, SIGNED_URL_EXPIRES_IN);

  if (signError) {
    console.error("Falha ao gerar links dos anexos:", signError);
    return json({ ok: false, error: "Não foi possível gerar os links dos anexos." }, 500);
  }

  const anexos = data.map((anexo, index) => ({
    id: anexo.id,
    nome_arquivo: anexo.nome_arquivo,
    tamanho: anexo.tamanho,
    signedUrl: signedUrls?.[index]?.signedUrl ?? null,
  }));

  return json({ ok: true, anexos }, 200);
}
