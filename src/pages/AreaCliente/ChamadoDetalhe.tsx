import { useEffect, useState, type FormEvent } from "react";
import { Link, useParams } from "react-router-dom";
import { AlertCircle, ArrowLeft, Loader2, MessageSquare, Paperclip, Send } from "lucide-react";
import { supabase } from "../../lib/supabaseClient";
import { useAuth } from "../../hooks/useAuth";
import { tipoLabel } from "../../lib/tipoChamado";
import { statusStyles, statusLabel } from "../../lib/statusChamado";
import { AnexosList, type Anexo } from "../../components/AnexosList";

const ANEXOS_BUCKET = "anexos-chamados";
const SIGNED_URL_EXPIRES_IN = 60 * 60; // 1 hora

interface Chamado {
  id: string;
  titulo: string;
  descricao: string;
  tipo: string;
  status: string;
  created_at: string;
  sistema_id: string | null;
  sistemas: { nome: string } | null;
}

interface Comentario {
  id: string;
  autor_tipo: string;
  mensagem: string;
  created_at: string;
}

function formatDateTime(value: string): string {
  return new Date(value).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function ChamadoDetalhe() {
  const { id } = useParams<{ id: string }>();
  const { session } = useAuth();

  const [chamado, setChamado] = useState<Chamado | null | undefined>(undefined);
  const [comentarios, setComentarios] = useState<Comentario[] | null>(null);
  const [anexos, setAnexos] = useState<Anexo[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [mensagem, setMensagem] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);

  useEffect(() => {
    if (!session || !id) return;

    const clienteId = session.user.id;
    let isMounted = true;

    async function load() {
      const [chamadoResult, comentariosResult, anexosResult] = await Promise.all([
        supabase
          .from("chamados")
          .select("id, titulo, descricao, tipo, status, created_at, sistema_id, sistemas(nome)")
          .eq("id", id)
          .eq("cliente_id", clienteId)
          .maybeSingle()
          .returns<Chamado | null>(),
        supabase
          .from("comentarios_chamado")
          .select("id, autor_tipo, mensagem, created_at")
          .eq("chamado_id", id)
          .order("created_at", { ascending: true }),
        supabase
          .from("anexos_chamado")
          .select("id, nome_arquivo, url, tamanho")
          .eq("chamado_id", id)
          .order("created_at", { ascending: true }),
      ]);

      if (!isMounted) return;

      if (chamadoResult.error) {
        console.error("Erro ao carregar chamado:", chamadoResult.error);
        setLoadError("Não foi possível carregar este chamado.");
        return;
      }
      setChamado(chamadoResult.data ?? null);

      if (comentariosResult.error) {
        console.error("Erro ao carregar mensagens:", comentariosResult.error);
        setLoadError("Não foi possível carregar as mensagens.");
        return;
      }
      setComentarios(comentariosResult.data ?? []);

      if (anexosResult.error) {
        console.error("Erro ao carregar anexos:", anexosResult.error);
      } else if (anexosResult.data && anexosResult.data.length > 0) {
        const paths = anexosResult.data.map((anexo) => anexo.url);
        const { data: signedUrls, error: signError } = await supabase.storage
          .from(ANEXOS_BUCKET)
          .createSignedUrls(paths, SIGNED_URL_EXPIRES_IN);

        if (!isMounted) return;

        if (signError) {
          console.error("Erro ao gerar links dos anexos:", signError);
        } else {
          setAnexos(
            anexosResult.data.map((anexo, index) => ({
              id: anexo.id,
              nome_arquivo: anexo.nome_arquivo,
              tamanho: anexo.tamanho,
              signedUrl: signedUrls?.[index]?.signedUrl ?? null,
            })),
          );
        }
      }
    }

    load();

    return () => {
      isMounted = false;
    };
  }, [session, id]);

  async function handleSendMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSendError(null);

    const texto = mensagem.trim();
    if (!texto || !session || !id) return;

    setIsSending(true);
    const { data, error } = await supabase
      .from("comentarios_chamado")
      .insert({ chamado_id: id, autor_tipo: "cliente", mensagem: texto })
      .select("id, autor_tipo, mensagem, created_at")
      .single();
    setIsSending(false);

    if (error || !data) {
      console.error("Erro ao enviar mensagem:", error);
      setSendError("Não foi possível enviar sua mensagem. Tente novamente.");
      return;
    }

    setComentarios((prev) => [...(prev ?? []), data]);
    setMensagem("");
  }

  if (loadError) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-10">
        <div className="flex items-center gap-3 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
          <AlertCircle size={18} aria-hidden="true" />
          {loadError}
        </div>
      </div>
    );
  }

  if (chamado === undefined) {
    return (
      <div className="flex items-center justify-center gap-2 py-24 text-navy-900/50">
        <Loader2 size={20} className="animate-spin" aria-hidden="true" />
        Carregando chamado...
      </div>
    );
  }

  if (chamado === null) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-10">
        <Link
          to="/area-do-cliente/chamados"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-navy-900/60 transition-colors hover:text-blue-600"
        >
          <ArrowLeft size={16} aria-hidden="true" />
          Voltar aos chamados
        </Link>
        <div className="mt-6 flex flex-col items-center gap-3 rounded-2xl border border-dashed border-navy-900/15 py-16 text-center">
          <AlertCircle size={28} className="text-navy-900/30" aria-hidden="true" />
          <p className="text-sm text-navy-900/50">Chamado não encontrado.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <Link
        to="/area-do-cliente/chamados"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-navy-900/60 transition-colors hover:text-blue-600"
      >
        <ArrowLeft size={16} aria-hidden="true" />
        Voltar aos chamados
      </Link>

      <div className="mt-4 rounded-2xl border border-navy-900/8 bg-white p-6 sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-navy-900 sm:text-2xl">
              {chamado.titulo}
            </h1>
            <p className="mt-1 flex flex-wrap items-center gap-x-2 text-xs uppercase tracking-wide text-navy-900/40">
              <span>{tipoLabel(chamado.tipo)}</span>
              {chamado.sistemas?.nome && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="normal-case text-navy-900/50">{chamado.sistemas.nome}</span>
                </>
              )}
            </p>
          </div>
          <span
            className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold capitalize ${
              statusStyles[chamado.status] ?? "bg-navy-900/8 text-navy-900/60"
            }`}
          >
            {statusLabel(chamado.status)}
          </span>
        </div>
        <p className="mt-4 text-sm leading-relaxed text-navy-900/70">{chamado.descricao}</p>
        <p className="mt-4 text-xs text-navy-900/40">
          Aberto em {formatDateTime(chamado.created_at)}
        </p>
      </div>

      {anexos.length > 0 && (
        <div className="mt-8">
          <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-navy-900/50">
            <Paperclip size={16} aria-hidden="true" />
            Anexos
          </h2>
          <div className="mt-4">
            <AnexosList anexos={anexos} />
          </div>
        </div>
      )}

      <div className="mt-8">
        <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-navy-900/50">
          <MessageSquare size={16} aria-hidden="true" />
          Mensagens
        </h2>

        <div className="mt-4 flex flex-col gap-3">
          {comentarios === null && (
            <div className="flex items-center justify-center gap-2 py-10 text-navy-900/50">
              <Loader2 size={18} className="animate-spin" aria-hidden="true" />
              Carregando mensagens...
            </div>
          )}

          {comentarios !== null && comentarios.length === 0 && (
            <p className="rounded-xl border border-dashed border-navy-900/15 px-4 py-6 text-center text-sm text-navy-900/40">
              Nenhuma mensagem ainda. Envie a primeira abaixo.
            </p>
          )}

          {comentarios?.map((comentario) => {
            const isCliente = comentario.autor_tipo === "cliente";
            return (
              <div
                key={comentario.id}
                className={`flex flex-col ${isCliente ? "items-end" : "items-start"}`}
              >
                <span className="mb-1 px-1 text-xs font-medium text-navy-900/40">
                  {isCliente ? "Você" : "Customiza Sistemas"}
                </span>
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed sm:max-w-[75%] ${
                    isCliente
                      ? "rounded-br-sm bg-blue-600 text-white"
                      : "rounded-bl-sm border border-navy-900/8 bg-slate-50 text-navy-900"
                  }`}
                >
                  {comentario.mensagem}
                </div>
                <span className="mt-1 px-1 text-xs text-navy-900/30">
                  {formatDateTime(comentario.created_at)}
                </span>
              </div>
            );
          })}
        </div>

        <form onSubmit={handleSendMessage} className="mt-6 flex flex-col gap-3">
          <textarea
            rows={3}
            placeholder="Escreva uma mensagem..."
            value={mensagem}
            onChange={(e) => setMensagem(e.target.value)}
            className="w-full resize-none rounded-xl border border-navy-900/12 bg-white px-4 py-3 text-sm text-navy-900 placeholder:text-navy-900/35 transition-colors focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/30"
          />

          {sendError && (
            <p className="flex items-center gap-2 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
              <AlertCircle size={16} aria-hidden="true" />
              {sendError}
            </p>
          )}

          <button
            type="submit"
            disabled={isSending || !mensagem.trim()}
            className="inline-flex w-fit items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition-all hover:bg-blue-500 disabled:pointer-events-none disabled:opacity-70"
          >
            {isSending ? (
              <>
                <Loader2 size={16} className="animate-spin" aria-hidden="true" />
                Enviando...
              </>
            ) : (
              <>
                Enviar
                <Send size={16} aria-hidden="true" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
