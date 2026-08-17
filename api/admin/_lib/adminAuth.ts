import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { json } from "../../_lib/http";

/**
 * Cliente Supabase com a Secret key (privilégio total, ignora RLS).
 * Só deve ser usado dentro de funções serverless — nunca no front-end.
 */
export function getServiceClient(): SupabaseClient {
  const url = process.env.VITE_SUPABASE_URL;
  const secretKey = process.env.SUPABASE_SECRET_KEY;

  if (!url || !secretKey) {
    throw new Error(
      "Supabase (service role) não configurado: defina VITE_SUPABASE_URL e SUPABASE_SECRET_KEY no ambiente do servidor.",
    );
  }

  return createClient(url, secretKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

export interface AdminCheckResult {
  ok: true;
  userId: string;
  supabase: SupabaseClient;
}

/**
 * Extrai o token de acesso do header Authorization, valida contra o
 * Supabase Auth e confirma que o usuário está cadastrado na tabela
 * `admins`. Retorna um Response de erro pronto (401/403) quando a
 * verificação falha — o handler chamador só precisa devolvê-lo.
 */
export async function requireAdmin(
  request: Request,
): Promise<AdminCheckResult | { ok: false; response: Response }> {
  const authHeader = request.headers.get("authorization");
  const token = authHeader?.replace(/^Bearer\s+/i, "").trim();

  if (!token) {
    return { ok: false, response: json({ ok: false, error: "Não autenticado." }, 401) };
  }

  const supabase = getServiceClient();

  const { data: userData, error: userError } = await supabase.auth.getUser(token);
  if (userError || !userData.user) {
    return { ok: false, response: json({ ok: false, error: "Sessão inválida ou expirada." }, 401) };
  }

  const { data: adminRow, error: adminError } = await supabase
    .from("admins")
    .select("user_id")
    .eq("user_id", userData.user.id)
    .maybeSingle();

  if (adminError || !adminRow) {
    return {
      ok: false,
      response: json({ ok: false, error: "Acesso restrito a administradores." }, 403),
    };
  }

  return { ok: true, userId: userData.user.id, supabase };
}
