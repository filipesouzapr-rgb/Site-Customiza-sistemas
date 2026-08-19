// Vercel Edge Function — chamada por um Database Webhook do Supabase
// (AFTER INSERT em public.chamados) para notificar por e-mail sempre que
// um cliente abre um novo chamado. Ver supabase/schema.sql para o SQL do
// trigger e as variáveis de ambiente necessárias.
export const config = { runtime: "edge" };

import { json } from "../_lib/http";
import { escapeHtml } from "../_lib/escapeHtml";
import { sendEmail } from "../_lib/resend";
import { getServiceClient } from "../_lib/supabaseService";
import { requireWebhookSecret } from "./_lib/webhookAuth";
import { tipoLabel } from "../../src/lib/tipoChamado";
import { company } from "../../src/config/company";

interface ChamadoRecord {
  id: string;
  cliente_id: string;
  titulo: string;
  descricao: string;
  tipo: string;
  sistema_id: string | null;
}

interface WebhookPayload {
  type: string;
  table: string;
  record: ChamadoRecord;
}

function isChamadoInsertPayload(body: unknown): body is WebhookPayload {
  if (!body || typeof body !== "object") return false;
  const b = body as Record<string, unknown>;
  if (b.type !== "INSERT" || b.table !== "chamados") return false;

  const record = b.record as Record<string, unknown> | undefined;
  return (
    !!record &&
    typeof record.id === "string" &&
    typeof record.cliente_id === "string" &&
    typeof record.titulo === "string" &&
    typeof record.descricao === "string" &&
    typeof record.tipo === "string"
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

  if (!isChamadoInsertPayload(body)) {
    // Webhook configurado para outro evento/tabela — ignora sem erro.
    return json({ ok: true, skipped: true }, 200);
  }

  const { record } = body;
  const supabase = getServiceClient();

  const { data: cliente } = await supabase
    .from("clientes")
    .select("nome, empresa")
    .eq("id", record.cliente_id)
    .maybeSingle();

  let sistemaNome: string | null = null;
  if (record.sistema_id) {
    const { data: sistema } = await supabase
      .from("sistemas")
      .select("nome")
      .eq("id", record.sistema_id)
      .maybeSingle();
    sistemaNome = sistema?.nome ?? null;
  }

  const clienteNome = cliente?.nome ?? "Cliente desconhecido";
  const clienteEmpresa = cliente?.empresa ?? null;
  const link = `${company.url}/admin/chamados/${record.id}`;

  const html = `
    <h2>Novo chamado aberto</h2>
    <p><strong>Cliente:</strong> ${escapeHtml(clienteNome)}${
      clienteEmpresa ? ` (${escapeHtml(clienteEmpresa)})` : ""
    }</p>
    <p><strong>Tipo:</strong> ${escapeHtml(tipoLabel(record.tipo))}</p>
    ${sistemaNome ? `<p><strong>Sistema:</strong> ${escapeHtml(sistemaNome)}</p>` : ""}
    <p><strong>Título:</strong> ${escapeHtml(record.titulo)}</p>
    <p><strong>Descrição:</strong></p>
    <p>${escapeHtml(record.descricao).replace(/\n/g, "<br/>")}</p>
    <p><a href="${link}">Ver chamado no painel</a></p>
  `;

  const toAddress =
    process.env.CHAMADOS_TO_EMAIL || process.env.CONTACT_TO_EMAIL || "customizasistemas@gmail.com";

  const result = await sendEmail({
    to: toAddress,
    subject: `Novo chamado — ${record.titulo}`,
    html,
  });

  if (!result.ok) {
    console.error("Falha ao enviar e-mail de novo chamado:", result.error);
    return json({ ok: false, error: "Falha ao enviar e-mail." }, 502);
  }

  return json({ ok: true }, 200);
}
