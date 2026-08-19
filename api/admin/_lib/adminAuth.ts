import type { SupabaseClient } from "@supabase/supabase-js";
import { json } from "../../_lib/http";
import { getServiceClient } from "../../_lib/supabaseService";

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

  let supabase: SupabaseClient;
  try {
    supabase = getServiceClient();
  } catch (error) {
    console.error("Falha ao inicializar o cliente Supabase (service role):", error);
    return {
      ok: false,
      response: json({ ok: false, error: "Configuração do servidor incompleta." }, 500),
    };
  }

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
