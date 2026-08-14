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
 * Envio do formulário de contato.
 *
 * Ainda não existe backend conectado. Esta função simula o envio para que a
 * experiência do usuário fique pronta. Para integrar futuramente, substitua
 * o corpo desta função por uma chamada real, por exemplo:
 *
 *   const response = await fetch("/api/contato", {
 *     method: "POST",
 *     headers: { "Content-Type": "application/json" },
 *     body: JSON.stringify(data),
 *   });
 *   return { ok: response.ok };
 *
 * A partir daí, a chamada pode disparar e-mail, gravar em banco de dados,
 * notificar via WhatsApp ou integrar com um CRM.
 */
export async function submitContactRequest(
  data: ContactFormData,
): Promise<ContactSubmitResult> {
  await new Promise((resolve) => setTimeout(resolve, 1200));

  if (import.meta.env.DEV) {
    console.info("[contato] solicitação de orçamento (simulada):", data);
  }

  return { ok: true };
}
