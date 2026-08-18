import { useEffect, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { AlertCircle, CheckCircle2, Loader2, Lock, Monitor, UserPlus } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { AppHeader } from "../../components/AppHeader";
import { StatusSelect } from "../../components/StatusSelect";
import {
  criarCliente,
  listarChamados,
  atualizarStatus,
  listarSistemas,
  criarSistema,
  type ChamadoAdmin,
  type Sistema,
} from "../../lib/adminApi";
import { tipoLabel } from "../../lib/tipoChamado";

const inputClasses =
  "w-full rounded-xl border border-navy-900/12 bg-white px-4 py-3 text-sm text-navy-900 placeholder:text-navy-900/35 transition-colors focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/30";

interface ClienteFormState {
  nome: string;
  email: string;
  empresa: string;
  senha: string;
  sistemas: string[];
}

const initialClienteForm: ClienteFormState = {
  nome: "",
  email: "",
  empresa: "",
  senha: "",
  sistemas: [],
};
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

  const [sistemas, setSistemas] = useState<Sistema[]>([]);
  const [sistemasError, setSistemasError] = useState<string | null>(null);
  const [novoSistemaNome, setNovoSistemaNome] = useState("");
  const [isCreatingSistema, setIsCreatingSistema] = useState(false);
  const [sistemaMessage, setSistemaMessage] = useState<{ type: "success" | "error"; text: string } | null>(
    null,
  );

  useEffect(() => {
    loadChamados();
    loadSistemas();
  }, []);

  async function loadSistemas() {
    const { data, error } = await listarSistemas();
    if (error) {
      setSistemasError("Não foi possível carregar os sistemas.");
      return;
    }
    setSistemasError(null);
    setSistemas(data);
  }

  async function handleCreateSistema(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSistemaMessage(null);

    const nome = novoSistemaNome.trim();
    if (!nome) return;

    setIsCreatingSistema(true);
    const result = await criarSistema(nome);
    setIsCreatingSistema(false);

    if (!result.ok || !result.data.sistema) {
      setSistemaMessage({ type: "error", text: result.data.error || "Não foi possível cadastrar o sistema." });
      return;
    }

    setSistemas((prev) =>
      [...prev, result.data.sistema as Sistema].sort((a, b) => a.nome.localeCompare(b.nome)),
    );
    setSistemaMessage({ type: "success", text: `Sistema "${nome}" cadastrado com sucesso.` });
    setNovoSistemaNome("");
  }

  function toggleClienteSistema(sistemaId: string) {
    setClienteForm((prev) => ({
      ...prev,
      sistemas: prev.sistemas.includes(sistemaId)
        ? prev.sistemas.filter((id) => id !== sistemaId)
        : [...prev.sistemas, sistemaId],
    }));
  }

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
      sistemas: clienteForm.sistemas.length > 0 ? clienteForm.sistemas : undefined,
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

              <div className="flex flex-col gap-1.5">
                <span className="text-sm font-medium text-navy-900">Sistemas contratados</span>
                {sistemas.length === 0 ? (
                  <p className="text-xs text-navy-900/40">Nenhum sistema cadastrado ainda.</p>
                ) : (
                  <div className="flex flex-col gap-2 rounded-xl border border-navy-900/12 bg-white p-4 sm:grid sm:grid-cols-2">
                    {sistemas.map((sistema) => (
                      <label
                        key={sistema.id}
                        className="flex items-center gap-2 text-sm text-navy-900"
                      >
                        <input
                          type="checkbox"
                          checked={clienteForm.sistemas.includes(sistema.id)}
                          onChange={() => toggleClienteSistema(sistema.id)}
                          className="h-4 w-4 rounded border-navy-900/20 text-blue-600 focus:ring-blue-600/30"
                        />
                        {sistema.nome}
                      </label>
                    ))}
                  </div>
                )}
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

          {/* Área 2 — cadastro e listagem de sistemas */}
          <section className="mt-8 rounded-2xl border border-navy-900/8 bg-white p-6 sm:p-8">
            <div className="flex items-center gap-2">
              <Monitor size={20} className="text-blue-600" aria-hidden="true" />
              <h2 className="text-lg font-semibold text-navy-900">Sistemas</h2>
            </div>

            <form onSubmit={handleCreateSistema} className="mt-6 flex flex-wrap items-end gap-3">
              <div className="flex min-w-[220px] flex-1 flex-col gap-1.5">
                <label htmlFor="sistema-nome" className="text-sm font-medium text-navy-900">
                  Novo sistema
                </label>
                <input
                  id="sistema-nome"
                  type="text"
                  placeholder="Nome do sistema"
                  value={novoSistemaNome}
                  onChange={(e) => setNovoSistemaNome(e.target.value)}
                  className={inputClasses}
                />
              </div>
              <button
                type="submit"
                disabled={isCreatingSistema || !novoSistemaNome.trim()}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition-all hover:bg-blue-500 disabled:pointer-events-none disabled:opacity-70"
              >
                {isCreatingSistema ? (
                  <>
                    <Loader2 size={16} className="animate-spin" aria-hidden="true" />
                    Cadastrando...
                  </>
                ) : (
                  "Cadastrar sistema"
                )}
              </button>
            </form>

            {sistemaMessage && (
              <p
                role="status"
                className={`mt-4 flex items-center gap-2 rounded-lg px-4 py-3 text-sm ${
                  sistemaMessage.type === "success"
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-red-50 text-red-600"
                }`}
              >
                {sistemaMessage.type === "success" ? (
                  <CheckCircle2 size={16} aria-hidden="true" />
                ) : (
                  <AlertCircle size={16} aria-hidden="true" />
                )}
                {sistemaMessage.text}
              </p>
            )}

            {sistemasError && (
              <p className="mt-4 flex items-center gap-2 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
                <AlertCircle size={16} aria-hidden="true" />
                {sistemasError}
              </p>
            )}

            <ul className="mt-6 flex flex-wrap gap-2">
              {sistemas.length === 0 && !sistemasError && (
                <p className="text-sm text-navy-900/50">Nenhum sistema cadastrado ainda.</p>
              )}
              {sistemas.map((sistema) => (
                <li
                  key={sistema.id}
                  className="rounded-full bg-navy-900/5 px-4 py-1.5 text-sm text-navy-900/80"
                >
                  {sistema.nome}
                </li>
              ))}
            </ul>
          </section>

          {/* Áreas 3 e 4 — lista de chamados com seletor de status */}
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
                    className="rounded-2xl border border-navy-900/8 bg-white shadow-sm shadow-navy-900/5"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-4 p-6">
                      <Link
                        to={`/admin/chamados/${chamado.id}`}
                        className="group min-w-0 flex-1"
                      >
                        <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
                          {chamado.cliente_nome ?? "Cliente desconhecido"}
                        </p>
                        <h3 className="mt-1 text-base font-semibold text-navy-900 transition-colors group-hover:text-blue-600">
                          {chamado.titulo}
                        </h3>
                        <p className="mt-1 text-xs uppercase tracking-wide text-navy-900/40">
                          {tipoLabel(chamado.tipo)}
                        </p>
                        <p className="mt-3 text-sm leading-relaxed text-navy-900/60">
                          {chamado.descricao}
                        </p>
                      </Link>

                      <div className="flex shrink-0 items-center gap-2">
                        {updatingId === chamado.id && (
                          <Loader2 size={14} className="animate-spin text-navy-900/40" aria-hidden="true" />
                        )}
                        <StatusSelect
                          id={`status-${chamado.id}`}
                          label={`Status do chamado ${chamado.titulo}`}
                          value={chamado.status}
                          disabled={updatingId === chamado.id}
                          onChange={(value) => handleStatusChange(chamado.id, value)}
                        />
                      </div>
                    </div>
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
