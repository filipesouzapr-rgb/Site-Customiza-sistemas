import { useState, type ChangeEvent, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { AlertCircle, ArrowLeft, CheckCircle2, Loader2, Paperclip, Send, X } from "lucide-react";
import { supabase } from "../../lib/supabaseClient";
import { useAuth } from "../../hooks/useAuth";

const inputClasses =
  "w-full rounded-xl border border-navy-900/12 bg-white px-4 py-3 text-sm text-navy-900 placeholder:text-navy-900/35 transition-colors focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/30";

// O valor precisa bater com a check constraint chamados_tipo_check no banco
// (aceita só minúsculo, sem acento) — o rótulo é só para exibição.
const tipoOptions = [
  { value: "erro", label: "Erro" },
  { value: "melhoria", label: "Melhoria" },
  { value: "personalizacao", label: "Personalização" },
];

const ALLOWED_EXTENSIONS = ["png", "jpg", "jpeg", "gif", "webp", "svg", "txt", "csv", "xlsx", "pdf"];

function isAllowedFile(file: File): boolean {
  if (file.type.startsWith("image/")) return true;
  const extension = file.name.split(".").pop()?.toLowerCase();
  return !!extension && ALLOWED_EXTENSIONS.includes(extension);
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

interface FormState {
  titulo: string;
  descricao: string;
  tipo: string;
}

const initialForm: FormState = { titulo: "", descricao: "", tipo: "" };

type Status = "idle" | "submitting" | "success" | "error";

export function NovoChamado() {
  const { session } = useAuth();

  const [form, setForm] = useState<FormState>(initialForm);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [attachmentWarning, setAttachmentWarning] = useState<string | null>(null);

  function updateField<K extends keyof FormState>(field: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const selected = event.target.files?.[0] ?? null;
    setFileError(null);

    if (selected && !isAllowedFile(selected)) {
      setFileError("Formato não suportado. Envie uma imagem, .txt, .csv, .xlsx ou .pdf.");
      setFile(null);
      event.target.value = "";
      return;
    }

    setFile(selected);
  }

  function removeFile() {
    setFile(null);
    setFileError(null);
  }

  function validate(): boolean {
    const newErrors: Partial<Record<keyof FormState, string>> = {};
    if (!form.titulo.trim()) newErrors.titulo = "Informe um título.";
    if (!form.descricao.trim() || form.descricao.trim().length < 10) {
      newErrors.descricao = "Descreva com um pouco mais de detalhes (mínimo 10 caracteres).";
    }
    if (!form.tipo) newErrors.tipo = "Selecione o tipo do chamado.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitError(null);
    setAttachmentWarning(null);

    if (!validate() || !session) return;

    setStatus("submitting");
    const clienteId = session.user.id;

    const { data: chamado, error: chamadoError } = await supabase
      .from("chamados")
      .insert({
        cliente_id: clienteId,
        titulo: form.titulo.trim(),
        descricao: form.descricao.trim(),
        tipo: form.tipo,
      })
      .select("id")
      .single();

    if (chamadoError || !chamado) {
      console.error("Erro ao criar chamado:", chamadoError);
      setStatus("error");
      setSubmitError("Não foi possível abrir o chamado. Tente novamente.");
      return;
    }

    if (file) {
      const path = `${clienteId}/${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from("anexos-chamados")
        .upload(path, file, { upsert: true });

      if (uploadError) {
        console.error("Erro ao enviar anexo:", uploadError);
        setAttachmentWarning("O chamado foi criado, mas não foi possível anexar o arquivo.");
      } else {
        const { error: anexoError } = await supabase.from("anexos_chamado").insert({
          chamado_id: chamado.id,
          nome_arquivo: file.name,
          url: path,
          tamanho: file.size,
        });

        if (anexoError) {
          console.error("Erro ao registrar anexo:", anexoError);
          setAttachmentWarning("O chamado foi criado, mas não foi possível registrar o anexo.");
        }
      }
    }

    setStatus("success");
  }

  if (status === "success") {
    return (
      <div className="mx-auto max-w-2xl px-6 py-10">
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-navy-900/8 bg-white px-8 py-16 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
            <CheckCircle2 size={30} aria-hidden="true" />
          </div>
          <h1 className="text-xl font-semibold text-navy-900">Chamado aberto com sucesso!</h1>
          <p className="max-w-sm text-sm leading-relaxed text-navy-900/60">
            Em breve a Customiza Sistemas vai analisar a sua solicitação.
          </p>
          {attachmentWarning && (
            <p className="flex items-center gap-2 rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-700">
              <AlertCircle size={16} aria-hidden="true" />
              {attachmentWarning}
            </p>
          )}
          <Link
            to="/area-do-cliente/chamados"
            className="mt-2 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition-all hover:bg-blue-500"
          >
            Ver meus chamados
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-10">
      <Link
        to="/area-do-cliente/chamados"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-navy-900/60 transition-colors hover:text-blue-600"
      >
        <ArrowLeft size={16} aria-hidden="true" />
        Voltar aos chamados
      </Link>

      <h1 className="mt-4 text-2xl font-bold tracking-tight text-navy-900">Novo chamado</h1>
      <p className="mt-1 text-sm text-navy-900/60">
        Conte para a Customiza Sistemas o que você precisa.
      </p>

      <form
        onSubmit={handleSubmit}
        noValidate
        className="mt-8 flex flex-col gap-5 rounded-2xl border border-navy-900/8 bg-white p-6 sm:p-8"
      >
        <div className="flex flex-col gap-1.5">
          <label htmlFor="titulo" className="text-sm font-medium text-navy-900">
            Título <span className="text-red-500">*</span>
          </label>
          <input
            id="titulo"
            type="text"
            value={form.titulo}
            onChange={(e) => updateField("titulo", e.target.value)}
            className={inputClasses}
          />
          {errors.titulo && <p className="text-xs text-red-500">{errors.titulo}</p>}
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="tipo" className="text-sm font-medium text-navy-900">
            Tipo <span className="text-red-500">*</span>
          </label>
          <select
            id="tipo"
            value={form.tipo}
            onChange={(e) => updateField("tipo", e.target.value)}
            className={inputClasses}
          >
            <option value="" disabled>
              Selecione uma opção
            </option>
            {tipoOptions.map((tipo) => (
              <option key={tipo.value} value={tipo.value}>
                {tipo.label}
              </option>
            ))}
          </select>
          {errors.tipo && <p className="text-xs text-red-500">{errors.tipo}</p>}
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="descricao" className="text-sm font-medium text-navy-900">
            Descrição <span className="text-red-500">*</span>
          </label>
          <textarea
            id="descricao"
            rows={5}
            placeholder="Descreva o problema, a melhoria ou a personalização que você precisa."
            value={form.descricao}
            onChange={(e) => updateField("descricao", e.target.value)}
            className={`${inputClasses} resize-none`}
          />
          {errors.descricao && <p className="text-xs text-red-500">{errors.descricao}</p>}
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="anexo" className="text-sm font-medium text-navy-900">
            Anexo
          </label>

          {!file ? (
            <input
              id="anexo"
              type="file"
              accept="image/*,.txt,.csv,.xlsx,.pdf"
              onChange={handleFileChange}
              className="w-full rounded-xl border border-dashed border-navy-900/20 bg-slate-50 px-4 py-3 text-sm text-navy-900/60 file:mr-4 file:rounded-lg file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-blue-700 hover:file:bg-blue-100"
            />
          ) : (
            <div className="flex items-center justify-between gap-3 rounded-xl border border-navy-900/12 bg-slate-50 px-4 py-3">
              <div className="flex min-w-0 items-center gap-2">
                <Paperclip size={16} className="shrink-0 text-navy-900/40" aria-hidden="true" />
                <span className="truncate text-sm text-navy-900">{file.name}</span>
                <span className="shrink-0 text-xs text-navy-900/40">{formatFileSize(file.size)}</span>
              </div>
              <button
                type="button"
                onClick={removeFile}
                aria-label="Remover arquivo"
                className="shrink-0 text-navy-900/40 transition-colors hover:text-red-600"
              >
                <X size={16} aria-hidden="true" />
              </button>
            </div>
          )}

          <p className="text-xs text-navy-900/40">Imagem, .txt, .csv, .xlsx ou .pdf.</p>
          {fileError && <p className="text-xs text-red-500">{fileError}</p>}
        </div>

        {submitError && (
          <p className="flex items-center gap-2 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
            <AlertCircle size={16} aria-hidden="true" />
            {submitError}
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
              Abrir chamado
              <Send size={16} aria-hidden="true" />
            </>
          )}
        </button>
      </form>
    </div>
  );
}
