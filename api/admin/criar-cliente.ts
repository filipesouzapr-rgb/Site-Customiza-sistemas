// Vercel Edge Function — cria um usuário no Supabase Auth e o cadastro
// correspondente em `clientes`. Restrito a administradores.
export const config = { runtime: "edge" };

import { json } from "../_lib/http";
import { requireAdmin } from "./_lib/adminAuth";

interface CriarClientePayload {
  nome: string;
  email: string;
  empresa?: string;
  senha: string;
  sistemas?: string[];
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function isValidPayload(body: unknown): body is CriarClientePayload {
  if (!body || typeof body !== "object") return false;
  const b = body as Record<string, unknown>;
  return (
    typeof b.nome === "string" &&
    b.nome.trim().length > 0 &&
    typeof b.email === "string" &&
    EMAIL_REGEX.test(b.email) &&
    typeof b.senha === "string" &&
    b.senha.length >= 6 &&
    (b.empresa === undefined || typeof b.empresa === "string") &&
    (b.sistemas === undefined ||
      (Array.isArray(b.sistemas) && b.sistemas.every((s) => typeof s === "string" && UUID_REGEX.test(s))))
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

  const { supabase } = admin;

  const { data: created, error: createError } = await supabase.auth.admin.createUser({
    email: body.email,
    password: body.senha,
    email_confirm: true,
  });

  if (createError || !created.user) {
    return json(
      { ok: false, error: createError?.message || "Não foi possível criar o usuário." },
      400,
    );
  }

  const { error: insertError } = await supabase.from("clientes").insert({
    id: created.user.id,
    nome: body.nome,
    empresa: body.empresa || null,
  });

  if (insertError) {
    // Evita deixar um usuário órfão em auth.users sem registro em clientes.
    await supabase.auth.admin.deleteUser(created.user.id);
    console.error("Falha ao inserir cliente:", insertError);
    return json({ ok: false, error: "Não foi possível cadastrar o cliente." }, 500);
  }

  const sistemaIds = [...new Set(body.sistemas ?? [])];
  if (sistemaIds.length > 0) {
    const { error: sistemasError } = await supabase
      .from("cliente_sistemas")
      .insert(sistemaIds.map((sistemaId) => ({ cliente_id: created.user!.id, sistema_id: sistemaId })));

    if (sistemasError) {
      // Mantém o mesmo invariante de não deixar registros órfãos/inconsistentes.
      await supabase.from("clientes").delete().eq("id", created.user.id);
      await supabase.auth.admin.deleteUser(created.user.id);
      console.error("Falha ao vincular sistemas ao cliente:", sistemasError);
      return json({ ok: false, error: "Não foi possível vincular os sistemas ao cliente." }, 500);
    }
  }

  return json(
    {
      ok: true,
      cliente: {
        id: created.user.id,
        nome: body.nome,
        email: body.email,
        empresa: body.empresa || null,
      },
    },
    201,
  );
}
