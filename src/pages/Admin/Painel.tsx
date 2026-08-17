import { useEffect, useState, type FormEvent } from "react";
import { AlertCircle, CheckCircle2, Loader2, Lock, UserPlus } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { AppHeader } from "../../components/AppHeader";
import { criarCliente, listarChamados, atualizarStatus, type ChamadoAdmin } from "../../lib/adminApi";
import { tipoLabel } from "../../lib/tipoChamado";
import { statusOptions, statusStyles } from "../../lib/statusChamado";

const inputClasses =
  "w-full rounded-xl border border-navy-900/12 bg-white px-4 py-3 text-sm text-navy-900 placeholder:text-navy-900/35 transition-colors focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/30";

interface ClienteFormState {
  nome: string;
  email: string;
  empresa: string;
  senha: string;
}

const initialClienteForm: ClienteFormState = { nome: "", email: "", empresa: "", senha: "" };
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type PanelState = "loading" | "denied" | "error" | "ready";

export function Painel() {
  const { session } = useAuth();

  const [panelState, setPanelState] = useState<PanelState>("loading");
  const [chamados, setChamados] = useState<ChamadoAdmin[]>([]);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [rowError, setRowError] = useState<string | null>(null);

  const [clienteForm, setClienteForm] = useState<ClienteFormState>(initialClienteForm);
  const [clienteErrors, setClienteErrors] = useState<Partial<Record<keyof ClienteFormState, string>>>({});
  const [isCreatingCliente, setIsCreatingCliente] = useState(false);
  const [clienteMessage, setClienteMessage] = useState<{ type: "success" | "error"; text: string } | null>(
    null,
  );

  useEffect(() => {
    loadChamados();
  }, []);

  async function loadChamados() {
    setPanelState("loading");
    const result = await listarChamados();

    if (result.status === 403) {
      setPanelState("denied");
      return;
    }

    if (!result.ok) {
      setPanelState("error");
      return;
    }

    setChamados(result.data.chamados ?? []);
    setPanelState("ready");
  }

  function updateClienteField<K extends keyof ClienteFormState>(field: K, value: ClienteFormState[K]) {
    setClienteForm((prev) => ({ ...prev, [field]: value }));
    setClienteErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  function validateClienteForm(): boolean {
    const errors: Partial<Record<keyof ClienteFormState, string>> = {};
    if (!clienteForm.nome.trim()) errors.nome = "Informe o nome.";
    if (!clienteForm.email.trim()) {
      errors.email = "Informe o e-mail.";
    } else if (!EMAIL_REGEX.test(clienteForm.email)) {
      errors.email = "Informe um e-mail válido.";
    }
    if (!clienteForm.senha || clienteForm.senha.length < 6) {
      errors.senha = "A senha precisa ter pelo menos 6 caracteres.";
    }
    setClienteErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleCreateCliente(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setClienteMessage(null);

    if (!validateClienteForm()) return;

    setIsCreatingCliente(true);
    const result = await criarCliente({
      nome: clienteForm.nome,
      email: clienteForm.email,
      empresa: clienteForm.empresa || undefined,
      senha: clienteForm.senha,
    });
    setIsCreatingCliente(false);

    if (!result.ok) {
      setClienteMessage({
        type: "error",
        text: result.data.error || "Não foi possível cadastrar o cliente.",
      });
      return;
    }

    setClienteMessage({ type: "success", text: `Cliente "${clienteForm.nome}" cadastrado com sucesso.` });
    setClienteForm(initialClienteForm);
  }

  async function handleStatusChange(chamadoId: string, novoStatus: string) {
    const anterior = chamados.find((c) => c.id === chamadoId)?.status;

    setUpdatingId(chamadoId);
    setRowError(null);
    setChamados((prev) => prev.map((c) => (c.id === chamadoId ? { ...c, status: novoStatus } : c)));

    const result = await atualizarStatus(chamadoId, novoStatus);
    setUpdatingId(null);

    if (!result.ok) {
      setChamados((prev) =>
        prev.map((c) => (c.id === chamadoId ? { ...c, status: anterior ?? c.status } : c)),
      );
      setRowError(result.data.error || "Não foi possível atualizar o status.");
    }
  }

  if (panelState === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-navy-950">
        <Loader2 size={28} className="animate-spin text-cyan-accent" aria-hidden="true" />
      </div>
    );
  }

  if (panelState === "denied") {
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
        <div className="mx-auto max-w-6xl px-6 py-10">
          <h1 className="text-2xl font-bold tracking-tight text-navy-900">Painel administrativo</h1>
          <p className="mt-1 text-sm text-navy-900/60">
            Cadastre clientes e acompanhe os chamados de toda a base.
          </p>

          {/* Área 1 — cadastro de cliente */}
          <section className="mt-8 rounded-2xl border border-navy-900/8 bg-white p-6 sm:p-8">
            <div className="flex items-center gap-2">
              <UserPlus size={20} className="text-blue-600" aria-hidden="true" />
              <h2 className="text-lg font-semibold text-navy-900">Cadastrar cliente</h2>
            </div>

            <form onSubmit={handleCreateCliente} noValidate className="mt-6 flex flex-col gap-5">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="cliente-nome" className="text-sm font-medium text-navy-900">
                    Nome <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="cliente-nome"
                    type="text"
                    autoComplete="name"
                    value={clienteForm.nome}
                    onChange={(e) => updateClienteField("nome", e.target.value)}
                    className={inputClasses}
                  />
                  {clienteErrors.nome && <p className="text-xs text-red-500">{clienteErrors.nome}</p>}
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="cliente-empresa" className="text-sm font-medium text-navy-900">
                    Empresa
                  </label>
                  <input
                    id="cliente-empresa"
                    type="text"
                    autoComplete="organization"
                    value={clienteForm.empresa}
                    onChange={(e) => updateClienteField("empresa", e.target.value)}
                    className={inputClasses}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="cliente-email" className="text-sm font-medium text-navy-900">
                    E-mail <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="cliente-email"
                    type="email"
                    autoComplete="email"
                    value={clienteForm.email}
                    onChange={(e) => updateClienteField("email", e.target.value)}
                    className={inputClasses}
                  />
                  {clienteErrors.email && <p className="text-xs text-red-500">{clienteErrors.email}</p>}
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="cliente-senha" className="text-sm font-medium text-navy-900">
                    Senha <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="cliente-senha"
                    type="password"
                    autoComplete="new-password"
                    value={clienteForm.senha}
                    onChange={(e) => updateClienteField("senha", e.target.value)}
                    className={inputClasses}
                  />
                  {clienteErrors.senha && <p className="text-xs text-red-500">{clienteErrors.senha}</p>}
                </div>
              </div>

              {clienteMessage && (
                <p
                  role="status"
                  className={`flex items-center gap-2 rounded-lg px-4 py-3 text-sm ${
                    clienteMessage.type === "success"
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-red-50 text-red-600"
                  }`}
                >
                  {clienteMessage.type === "success" ? (
                    <CheckCircle2 size={16} aria-hidden="true" />
                  ) : (
                    <AlertCircle size={16} aria-hidden="true" />
                  )}
                  {clienteMessage.text}
                </p>
              )}

              <button
                type="submit"
                disabled={isCreatingCliente}
                className="inline-flex w-fit items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition-all hover:bg-blue-500 disabled:pointer-events-none disabled:opacity-70"
              >
                {isCreatingCliente ? (
                  <>
                    <Loader2 size={16} className="animate-spin" aria-hidden="true" />
                    Cadastrando...
                  </>
                ) : (
                  "Cadastrar cliente"
                )}
              </button>
            </form>
          </section>

          {/* Áreas 2 e 3 — lista de chamados com seletor de status */}
          <section className="mt-8">
            <h2 className="text-lg font-semibold text-navy-900">Todos os chamados</h2>

            {panelState === "error" && (
              <div className="mt-4 flex items-center gap-3 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
                <AlertCircle size={18} aria-hidden="true" />
                Não foi possível carregar os chamados.
              </div>
            )}

            {rowError && (
              <div className="mt-4 flex items-center gap-3 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
                <AlertCircle size={18} aria-hidden="true" />
                {rowError}
              </div>
            )}

            {panelState === "ready" && chamados.length === 0 && (
              <p className="mt-4 text-sm text-navy-900/50">Nenhum chamado registrado ainda.</p>
            )}

            {panelState === "ready" && chamados.length > 0 && (
              <ul className="mt-4 flex flex-col gap-4">
                {chamados.map((chamado) => (
                  <li
                    key={chamado.id}
                    className="rounded-2xl border border-navy-900/8 bg-white p-6 shadow-sm shadow-navy-900/5"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
                          {chamado.cliente_nome ?? "Cliente desconhecido"}
                        </p>
                        <h3 className="mt-1 text-base font-semibold text-navy-900">{chamado.titulo}</h3>
                        <p className="mt-1 text-xs uppercase tracking-wide text-navy-900/40">
                          {tipoLabel(chamado.tipo)}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        {updatingId === chamado.id && (
                          <Loader2 size={14} className="animate-spin text-navy-900/40" aria-hidden="true" />
                        )}
                        <label className="sr-only" htmlFor={`status-${chamado.id}`}>
                          Status do chamado {chamado.titulo}
                        </label>
                        <select
                          id={`status-${chamado.id}`}
                          value={chamado.status}
                          disabled={updatingId === chamado.id}
                          onChange={(e) => handleStatusChange(chamado.id, e.target.value)}
                          className={`rounded-full border-0 px-3 py-1.5 text-xs font-semibold capitalize transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600/30 disabled:opacity-50 ${
                            statusStyles[chamado.status] ?? "bg-navy-900/8 text-navy-900/60"
                          }`}
                        >
                          {statusOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <p className="mt-3 text-sm leading-relaxed text-navy-900/60">{chamado.descricao}</p>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
