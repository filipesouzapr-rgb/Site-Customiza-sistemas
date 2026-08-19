import { createClient, type SupabaseClient } from "@supabase/supabase-js";

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
