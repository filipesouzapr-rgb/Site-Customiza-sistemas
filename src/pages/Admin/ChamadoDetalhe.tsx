import { useEffect, useState, type FormEvent } from "react";
import { Link, useParams } from "react-router-dom";
import { AlertCircle, ArrowLeft, Loader2, Lock, MessageSquare, Paperclip, Send } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { AppHeader } from "../../components/AppHeader";
import { StatusSelect } from "../../components/StatusSelect";
import { AnexosList } from "../../components/AnexosList";
import {
  listarChamados,
  listarComentarios,
  listarAnexos,
  atualizarStatus,
  responderChamado,
  type ChamadoAdmin,
  type ComentarioAdmin,
  type AnexoAdmin,
} from "../../lib/adminApi";
import { tipoLabel } from "../../lib/tipoChamado";

function formatDateTime(value: string): string {
  return new Date(value).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

type PageState = "loading" | "denied" | "error" | "notfound" | "ready";

export function ChamadoDetalhe() {
  const { id } = useParams<{ id: string }>();
  const { session } = useAuth();

  const [pageState, setPageState] = useState<PageState>("loading");
  const [chamado, setChamado] = useState<ChamadoAdmin | null>(null);
  const [comentarios, setComentarios] = useState<ComentarioAdmin[]>([]);
  const [anexos, setAnexos] = useState<AnexoAdmin[]>([]);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [statusError, setStatusError] = useState<string | null>(null);

  const [mensagem, setMensagem] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    async function load() {
      setPageState("loading");

      const [chamadosResult, comentariosResult, anexosResult] = await Promise.all([
        listarChamados(),
        listarComentarios(id as string),
        listarAnexos(id as string),
      ]);

      if (
        chamadosResult.status === 403 ||
        comentariosResult.status === 403 ||
        anexosResult.status === 403
      ) {
        setPageState("denied");
        return;
      }

      if (!chamadosResult.ok || !comentariosResult.ok) {
        setPageState("error");
        return;
      }

      const encontrado = chamadosResult.data.chamados?.find((c) => c.id === id) ?? null;
      if (!encontrado) {
        setPageState("notfound");
        return;
      }

      setChamado(encontrado);
      setComentarios(comentariosResult.data.comentarios ?? []);
      if (anexosResult.ok) {
        setAnexos(anexosResult.data.anexos ?? []);
      } else {
        console.error("Erro ao carregar anexos:", anexosResult.data.error);
      }
      setPageState("ready");
    }

    load();
  }, [id]);

  async function handleStatusChange(novoStatus: string) {
    if (!chamado) return;
    const anterior = chamado.status;

    setIsUpdatingStatus(true);
    setStatusError(null);
    setChamado({ ...chamado, status: novoStatus });

    const result = await atualizarStatus(chamado.id, novoStatus);
    setIsUpdatingStatus(false);

    if (!result.ok) {
      setChamado((prev) => (prev ? { ...prev, status: anterior } : prev));
      setStatusError(result.data.error || "Não foi possível atualizar o status.");
    }
  }

  async function handleSendReply(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSendError(null);

    const texto = mensagem.trim();
    if (!texto || !chamado) return;

    setIsSending(true);
    const result = await responderChamado(chamado.id, texto);
    setIsSending(false);

    if (!result.ok || !result.data.comentario) {
      setSendError(result.data.error || "Não foi possível enviar a resposta.");
      return;
    }

    setComentarios((prev) => [...prev, result.data.comentario as ComentarioAdmin]);
    setMensagem("");
  }

  if (pageState === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-navy-950">
        <Loader2 size={28} className="animate-spin text-cyan-accent" aria-hidden="true" />
      </div>
    );
  }

  if (pageState === "denied") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-navy-950 px-6 text-center">
        <Lock size={32} className="text-cyan-accent" aria-hidden="true" />
        <h1 className="text-xl font-semibold text-white">Acesso restrito</h1>
        <p className="max-w-sm text-sm text-white/60">
          Sua conta não tem permissão de administrador para acessar este painel.
        </p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <AppHeader homeTo="/admin" userEmail={session?.user.email} />

      <main className="flex-1">
        <div className="mx-auto max-w-3xl px-6 py-10">
          <Link
            to="/admin"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-navy-900/60 transition-colors hover:text-blue-600"
          >
            <ArrowLeft size={16} aria-hidden="true" />
            Voltar ao painel
          </Link>

          {pageState === "error" && (
            <div className="mt-6 flex items-center gap-3 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
              <AlertCircle size={18} aria-hidden="true" />
              Não foi possível carregar este chamado.
            </div>
          )}

          {pageState === "notfound" && (
            <div className="mt-6 flex flex-col items-center gap-3 rounded-2xl border border-dashed border-navy-900/15 py-16 text-center">
              <AlertCircle size={28} className="text-navy-900/30" aria-hidden="true" />
              <p className="text-sm text-navy-900/50">Chamado não encontrado.</p>
            </div>
          )}

          {pageState === "ready" && chamado && (
            <>
              <div className="mt-4 rounded-2xl border border-navy-900/8 bg-white p-6 sm:p-8">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
                      {chamado.cliente_nome ?? "Cliente desconhecido"}
                    </p>
                    <h1 className="mt-1 text-xl font-bold tracking-tight text-navy-900 sm:text-2xl">
                      {chamado.titulo}
                    </h1>
                    <p className="mt-1 text-xs uppercase tracking-wide text-navy-900/40">
                      {tipoLabel(chamado.tipo)}
                    </p>
                  </div>

                  <div className="flex shrink-0 items-center gap-2">
                    {isUpdatingStatus && (
                      <Loader2 size={14} className="animate-spin text-navy-900/40" aria-hidden="true" />
                    )}
                    <StatusSelect
                      id="status-detalhe"
                      label={`Status do chamado ${chamado.titulo}`}
                      value={chamado.status}
                      disabled={isUpdatingStatus}
                      onChange={handleStatusChange}
                    />
                  </div>
                </div>

                {statusError && (
                  <p className="mt-4 flex items-center gap-2 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
                    <AlertCircle size={16} aria-hidden="true" />
                    {statusError}
                  </p>
                )}

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
                  {comentarios.length === 0 && (
                    <p className="rounded-xl border border-dashed border-navy-900/15 px-4 py-6 text-center text-sm text-navy-900/40">
                      Nenhuma mensagem ainda.
                    </p>
                  )}

                  {comentarios.map((comentario) => {
                    const isAdmin = comentario.autor_tipo === "admin";
                    return (
                      <div
                        key={comentario.id}
                        className={`flex flex-col ${isAdmin ? "items-end" : "items-start"}`}
                      >
                        <span className="mb-1 px-1 text-xs font-medium text-navy-900/40">
                          {isAdmin ? "Customiza Sistemas" : chamado.cliente_nome ?? "Cliente"}
                        </span>
                        <div
                          className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed sm:max-w-[75%] ${
                            isAdmin
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

                <form onSubmit={handleSendReply} className="mt-6 flex flex-col gap-3">
                  <textarea
                    rows={3}
                    placeholder="Escreva uma resposta..."
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
                        Responder
                        <Send size={16} aria-hidden="true" />
                      </>
                    )}
                  </button>
                </form>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
