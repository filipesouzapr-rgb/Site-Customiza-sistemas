// Vercel Edge Function — chamada por um Database Webhook do Supabase
// (AFTER INSERT em public.comentarios_chamado) para notificar por e-mail
// sempre que um cliente escreve numa mensagem num chamado já aberto.
// Mensagens do próprio admin não geram notificação (ver isComentarioPayload).
// Ver supabase/schema.sql para o SQL do trigger e as variáveis de ambiente
// necessárias.
export const config = { runtime: "edge" };

import { json } from "../_lib/http";
import { escapeHtml } from "../_lib/escapeHtml";
import { sendEmail } from "../_lib/resend";
import { getServiceClient } from "../_lib/supabaseService";
import { requireWebhookSecret } from "./_lib/webhookAuth";
import { company } from "../../src/config/company";

interface ComentarioRecord {
  id: string;
  chamado_id: string;
  autor_tipo: string;
  mensagem: string;
}

interface WebhookPayload {
  type: string;
  table: string;
  record: ComentarioRecord;
}

function isComentarioClienteInsertPayload(body: unknown): body is WebhookPayload {
  if (!body || typeof body !== "object") return false;
  const b = body as Record<string, unknown>;
  if (b.type !== "INSERT" || b.table !== "comentarios_chamado") return false;

  const record = b.record as Record<string, unknown> | undefined;
  return (
    !!record &&
    typeof record.id === "string" &&
    typeof record.chamado_id === "string" &&
    typeof record.autor_tipo === "string" &&
    typeof record.mensagem === "string" &&
    record.autor_tipo === "cliente"
  );
}

export default async function handler(request: Request): Promise<Response> {
  if (request.method !== "POST") {
    return json({ ok: false, error: "Método não permitido." }, 405);
  }

  const auth = requireWebhookSecret(request);
  if (!auth.ok) return auth.response;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, error: "JSON inválido." }, 400);
  }

  if (!isComentarioClienteInsertPayload(body)) {
    // Não é mensagem de cliente (ex: resposta do admin) — ignora sem erro.
    return json({ ok: true, skipped: true }, 200);
  }

  const { record } = body;
  const supabase = getServiceClient();

  const { data: chamado } = await supabase
    .from("chamados")
    .select("titulo, cliente_id")
    .eq("id", record.chamado_id)
    .maybeSingle();

  if (!chamado) {
    console.error("Chamado não encontrado para o comentário:", record.chamado_id);
    return json({ ok: false, error: "Chamado não encontrado." }, 404);
  }

  const { data: cliente } = await supabase
    .from("clientes")
    .select("nome")
    .eq("id", chamado.cliente_id)
    .maybeSingle();

  const clienteNome = cliente?.nome ?? "Cliente desconhecido";
  const link = `${company.url}/admin/chamados/${record.chamado_id}`;

  const html = `
    <h2>Nova mensagem em um chamado</h2>
    <p><strong>Cliente:</strong> ${escapeHtml(clienteNome)}</p>
    <p><strong>Chamado:</strong> ${escapeHtml(chamado.titulo)}</p>
    <p><strong>Mensagem:</strong></p>
    <p>${escapeHtml(record.mensagem).replace(/\n/g, "<br/>")}</p>
    <p><a href="${link}">Ver chamado no painel</a></p>
  `;

  const toAddress =
    process.env.CHAMADOS_TO_EMAIL || process.env.CONTACT_TO_EMAIL || "customizasistemas@gmail.com";

  const result = await sendEmail({
    to: toAddress,
    subject: `Nova mensagem — ${chamado.titulo}`,
    html,
  });

  if (!result.ok) {
    console.error("Falha ao enviar e-mail de nova mensagem:", result.error);
    return json({ ok: false, error: "Falha ao enviar e-mail." }, 502);
  }

  return json({ ok: true }, 200);
}
