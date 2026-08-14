import { useState, type FormEvent } from "react";
import { CheckCircle2, Loader2, Send } from "lucide-react";
import { submitContactRequest, type ContactFormData } from "../lib/contactApi";

const solutionTypes = [
  "Sistema sob medida",
  "Automação",
  "Dashboard",
  "Integração",
  "Sistema financeiro",
  "Sistema administrativo",
  "Outro",
];

type FormState = ContactFormData;
type FormErrors = Partial<Record<keyof FormState, string>>;
type Status = "idle" | "submitting" | "success" | "error";

const initialState: FormState = {
  name: "",
  company: "",
  email: "",
  whatsapp: "",
  solutionType: "",
  message: "",
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(values: FormState): FormErrors {
  const errors: FormErrors = {};

  if (!values.name.trim()) errors.name = "Informe seu nome.";
  if (!values.email.trim()) {
    errors.email = "Informe seu e-mail.";
  } else if (!emailRegex.test(values.email)) {
    errors.email = "Informe um e-mail válido.";
  }
  if (!values.whatsapp.trim()) errors.whatsapp = "Informe um WhatsApp para contato.";
  if (!values.solutionType) errors.solutionType = "Selecione o tipo de solução.";
  if (!values.message.trim()) {
    errors.message = "Conte um pouco sobre a sua necessidade.";
  } else if (values.message.trim().length < 10) {
    errors.message = "Descreva com um pouco mais de detalhes (mínimo 10 caracteres).";
  }

  return errors;
}

const inputClasses =
  "w-full rounded-xl border bg-white px-4 py-3 text-sm text-navy-900 placeholder:text-navy-900/35 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600/30";

function fieldBorder(hasError: boolean) {
  return hasError ? "border-red-400 focus:border-red-400" : "border-navy-900/12 focus:border-blue-600";
}

export function ContactForm() {
  const [values, setValues] = useState<FormState>(initialState);
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<Status>("idle");

  function updateField<K extends keyof FormState>(field: K, value: FormState[K]) {
    setValues((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const validationErrors = validate(values);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;

    setStatus("submitting");
    try {
      const result = await submitContactRequest(values);
      if (result.ok) {
        setStatus("success");
        setValues(initialState);
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="flex flex-col items-center gap-4 rounded-2xl border border-navy-900/8 bg-slate-50 px-8 py-16 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
          <CheckCircle2 size={30} aria-hidden="true" />
        </div>
        <h3 className="text-xl font-semibold text-navy-900">
          Recebemos sua solicitação!
        </h3>
        <p className="max-w-sm text-sm leading-relaxed text-navy-900/60">
          Em breve entraremos em contato para entender melhor a sua necessidade.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-2 text-sm font-semibold text-blue-600 hover:text-blue-700"
        >
          Enviar outra solicitação
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="name" className="text-sm font-medium text-navy-900">
            Nome <span className="text-red-500">*</span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            value={values.name}
            onChange={(e) => updateField("name", e.target.value)}
            className={`${inputClasses} ${fieldBorder(!!errors.name)}`}
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "name-error" : undefined}
          />
          {errors.name && (
            <p id="name-error" className="text-xs text-red-500">
              {errors.name}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="company" className="text-sm font-medium text-navy-900">
            Empresa
          </label>
          <input
            id="company"
            name="company"
            type="text"
            autoComplete="organization"
            value={values.company}
            onChange={(e) => updateField("company", e.target.value)}
            className={`${inputClasses} ${fieldBorder(false)}`}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="email" className="text-sm font-medium text-navy-900">
            E-mail <span className="text-red-500">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            value={values.email}
            onChange={(e) => updateField("email", e.target.value)}
            className={`${inputClasses} ${fieldBorder(!!errors.email)}`}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "email-error" : undefined}
          />
          {errors.email && (
            <p id="email-error" className="text-xs text-red-500">
              {errors.email}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="whatsapp" className="text-sm font-medium text-navy-900">
            WhatsApp <span className="text-red-500">*</span>
          </label>
          <input
            id="whatsapp"
            name="whatsapp"
            type="tel"
            autoComplete="tel"
            placeholder="(00) 00000-0000"
            value={values.whatsapp}
            onChange={(e) => updateField("whatsapp", e.target.value)}
            className={`${inputClasses} ${fieldBorder(!!errors.whatsapp)}`}
            aria-invalid={!!errors.whatsapp}
            aria-describedby={errors.whatsapp ? "whatsapp-error" : undefined}
          />
          {errors.whatsapp && (
            <p id="whatsapp-error" className="text-xs text-red-500">
              {errors.whatsapp}
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="solutionType" className="text-sm font-medium text-navy-900">
          Tipo de solução <span className="text-red-500">*</span>
        </label>
        <select
          id="solutionType"
          name="solutionType"
          value={values.solutionType}
          onChange={(e) => updateField("solutionType", e.target.value)}
          className={`${inputClasses} ${fieldBorder(!!errors.solutionType)}`}
          aria-invalid={!!errors.solutionType}
          aria-describedby={errors.solutionType ? "solutionType-error" : undefined}
        >
          <option value="" disabled>
            Selecione uma opção
          </option>
          {solutionTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
        {errors.solutionType && (
          <p id="solutionType-error" className="text-xs text-red-500">
            {errors.solutionType}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="message" className="text-sm font-medium text-navy-900">
          Mensagem <span className="text-red-500">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          placeholder="Conte um pouco sobre o processo ou problema que você quer resolver."
          value={values.message}
          onChange={(e) => updateField("message", e.target.value)}
          className={`${inputClasses} resize-none ${fieldBorder(!!errors.message)}`}
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? "message-error" : undefined}
        />
        {errors.message && (
          <p id="message-error" className="text-xs text-red-500">
            {errors.message}
          </p>
        )}
      </div>

      {status === "error" && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
          Não foi possível enviar sua solicitação agora. Tente novamente em instantes.
        </p>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="mt-2 inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition-all hover:bg-blue-500 disabled:pointer-events-none disabled:opacity-70"
      >
        {status === "submitting" ? (
          <>
            <Loader2 size={18} className="animate-spin" aria-hidden="true" />
            Enviando...
          </>
        ) : (
          <>
            Solicitar orçamento
            <Send size={16} aria-hidden="true" />
          </>
        )}
      </button>
    </form>
  );
}
