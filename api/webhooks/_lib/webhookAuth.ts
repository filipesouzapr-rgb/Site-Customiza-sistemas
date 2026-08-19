import { json } from "../../_lib/http";

/**
 * Confere o segredo compartilhado enviado pelo Database Webhook do Supabase
 * (header Authorization: Bearer <segredo>, configurado no painel do
 * Supabase). Evita que qualquer request externo finja ser um webhook real.
 */
export function requireWebhookSecret(request: Request): { ok: true } | { ok: false; response: Response } {
  const secret = process.env.SUPABASE_WEBHOOK_SECRET;
  if (!secret) {
    console.error("SUPABASE_WEBHOOK_SECRET não configurada.");
    return { ok: false, response: json({ ok: false, error: "Configuração do servidor incompleta." }, 500) };
  }

  const authHeader = request.headers.get("authorization");
  const token = authHeader?.replace(/^Bearer\s+/i, "").trim();

  if (!token || token !== secret) {
    return { ok: false, response: json({ ok: false, error: "Não autorizado." }, 401) };
  }

  return { ok: true };
}
