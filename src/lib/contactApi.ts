export interface ContactFormData {
  name: string;
  company: string;
  email: string;
  whatsapp: string;
  solutionType: string;
  message: string;
}

export interface ContactSubmitResult {
  ok: boolean;
}

/**
 * Envio do formulário de contato para a função serverless em
 * `api/contato.ts`, que encaminha por e-mail via Resend.
 */
export async function submitContactRequest(
  data: ContactFormData,
): Promise<ContactSubmitResult> {
  try {
    const response = await fetch("/api/contato", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return { ok: response.ok };
  } catch {
    return { ok: false };
  }
}
