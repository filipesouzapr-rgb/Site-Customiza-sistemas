interface SendEmailParams {
  to: string | string[];
  subject: string;
  html: string;
  replyTo?: string;
}

type SendEmailResult = { ok: true } | { ok: false; error: string };

/**
 * Envia um e-mail via Resend. Requer RESEND_API_KEY no ambiente do servidor
 * (mesma conta/domínio já usados pelo formulário de contato).
 */
export async function sendEmail(params: SendEmailParams): Promise<SendEmailResult> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return { ok: false, error: "RESEND_API_KEY não configurada." };
  }

  const fromAddress =
    process.env.CONTACT_FROM_EMAIL || "Customiza Sistemas <contato@customizasistemas.com.br>";

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: fromAddress,
      to: Array.isArray(params.to) ? params.to : [params.to],
      reply_to: params.replyTo,
      subject: params.subject,
      html: params.html,
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    return { ok: false, error: `Resend respondeu ${response.status}: ${text}` };
  }

  return { ok: true };
}
