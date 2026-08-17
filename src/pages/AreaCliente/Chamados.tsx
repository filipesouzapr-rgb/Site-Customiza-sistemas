import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AlertCircle, Inbox, Loader2, Plus } from "lucide-react";
import { supabase } from "../../lib/supabaseClient";
import { useAuth } from "../../hooks/useAuth";

interface Chamado {
  id: string;
  titulo: string;
  descricao: string;
  tipo: string;
  status: string;
  created_at: string;
}

const statusStyles: Record<string, string> = {
  aberto: "bg-blue-50 text-blue-700",
  andamento: "bg-amber-50 text-amber-700",
  resolvido: "bg-emerald-50 text-emerald-700",
};

function statusLabel(status: string): string {
  return status.replace(/_/g, " ");
}

export function Chamados() {
  const { session } = useAuth();
  const [chamados, setChamados] = useState<Chamado[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!session) return;

    let isMounted = true;

    supabase
      .from("chamados")
      .select("id, titulo, descricao, tipo, status, created_at")
      .eq("cliente_id", session.user.id)
      .order("created_at", { ascending: false })
      .then(({ data, error: fetchError }) => {
        if (!isMounted) return;
        if (fetchError) {
          setError("Não foi possível carregar seus chamados.");
          return;
        }
        setChamados(data ?? []);
      });

    return () => {
      isMounted = false;
    };
  }, [session]);

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-navy-900">Meus chamados</h1>
          <p className="mt-1 text-sm text-navy-900/60">
            Acompanhe as solicitações abertas com a Customiza Sistemas.
          </p>
        </div>
        <Link
          to="/area-do-cliente/chamados/novo"
          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition-all hover:bg-blue-500"
        >
          <Plus size={16} aria-hidden="true" />
          Novo chamado
        </Link>
      </div>

      <div className="mt-8">
        {error && (
          <div className="flex items-center gap-3 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
            <AlertCircle size={18} aria-hidden="true" />
            {error}
          </div>
        )}

        {!error && chamados === null && (
          <div className="flex items-center justify-center gap-2 py-16 text-navy-900/50">
            <Loader2 size={20} className="animate-spin" aria-hidden="true" />
            Carregando chamados...
          </div>
        )}

        {!error && chamados !== null && chamados.length === 0 && (
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-navy-900/15 py-16 text-center">
            <Inbox size={28} className="text-navy-900/30" aria-hidden="true" />
            <p className="text-sm text-navy-900/50">Você ainda não tem nenhum chamado aberto.</p>
          </div>
        )}

        {!error && chamados && chamados.length > 0 && (
          <ul className="flex flex-col gap-4">
            {chamados.map((chamado) => (
              <li
                key={chamado.id}
                className="rounded-2xl border border-navy-900/8 bg-white p-6 shadow-sm shadow-navy-900/5"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h2 className="text-base font-semibold text-navy-900">{chamado.titulo}</h2>
                    <p className="mt-1 text-xs uppercase tracking-wide text-navy-900/40">
                      {chamado.tipo}
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
                <p className="mt-3 text-sm leading-relaxed text-navy-900/60">{chamado.descricao}</p>
                <p className="mt-4 text-xs text-navy-900/40">
                  Aberto em {new Date(chamado.created_at).toLocaleDateString("pt-BR")}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
