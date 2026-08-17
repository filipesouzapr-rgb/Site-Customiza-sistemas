// Vercel Edge Function — recebe o envio do formulário de /contato e
// encaminha por e-mail via Resend. Usa apenas as Web APIs padrão
// (Request/Response/fetch), sem depender de pacotes da Vercel.
export const config = { runtime: "edge" };

import { json } from "./_lib/http";

interface ContactPayload {
  name: string;
  company: string;
  email: string;
  whatsapp: string;
  solutionType: string;
  message: string;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isValidPayload(body: unknown): body is ContactPayload {
  if (!body || typeof body !== "object") return false;
  const b = body as Record<string, unknown>;
  return (
    typeof b.name === "string" &&
    b.name.trim().length > 0 &&
    typeof b.email === "string" &&
    EMAIL_REGEX.test(b.email) &&
    typeof b.whatsapp === "string" &&
    b.whatsapp.trim().length > 0 &&
    typeof b.solutionType === "string" &&
    b.solutionType.trim().length > 0 &&
    typeof b.message === "string" &&
    b.message.trim().length >= 10 &&
    typeof b.company === "string"
  );
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export default async function handler(request: Request): Promise<Response> {
  if (request.method !== "POST") {
    return json({ ok: false, error: "Método não permitido." }, 405);
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, error: "JSON inválido." }, 400);
  }

  if (!isValidPayload(body)) {
    return json({ ok: false, error: "Dados inválidos." }, 400);
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("RESEND_API_KEY não configurada.");
    return json({ ok: false, error: "Configuração do servidor incompleta." }, 500);
  }

  const fromAddress = process.env.CONTACT_FROM_EMAIL || "Customiza Sistemas <contato@customizasistemas.com.br>";
  const toAddress = process.env.CONTACT_TO_EMAIL || "customizasistemas@gmail.com";

  const html = `
    <h2>Nova solicitação de orçamento</h2>
    <p><strong>Nome:</strong> ${escapeHtml(body.name)}</p>
    <p><strong>Empresa:</strong> ${escapeHtml(body.company || "—")}</p>
    <p><strong>E-mail:</strong> ${escapeHtml(body.email)}</p>
    <p><strong>WhatsApp:</strong> ${escapeHtml(body.whatsapp)}</p>
    <p><strong>Tipo de solução:</strong> ${escapeHtml(body.solutionType)}</p>
    <p><strong>Mensagem:</strong></p>
    <p>${escapeHtml(body.message).replace(/\n/g, "<br/>")}</p>
  `;

  try {
    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: fromAddress,
        to: [toAddress],
        reply_to: body.email,
        subject: `Novo orçamento — ${body.name}${body.company ? ` (${body.company})` : ""}`,
        html,
      }),
    });

    if (!resendResponse.ok) {
      console.error("Falha ao enviar via Resend:", resendResponse.status, await resendResponse.text());
      return json({ ok: false, error: "Falha ao enviar e-mail." }, 502);
    }

    return json({ ok: true }, 200);
  } catch (error) {
    console.error("Erro ao enviar contato:", error);
    return json({ ok: false, error: "Erro interno." }, 500);
  }
}
