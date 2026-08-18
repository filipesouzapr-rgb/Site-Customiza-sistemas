import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";
import { useAuth } from "../../hooks/useAuth";
import { AppHeader } from "../../components/AppHeader";

interface ClienteInfo {
  nome: string;
  empresa: string | null;
}

export function AreaClienteLayout() {
  const { session } = useAuth();
  const [cliente, setCliente] = useState<ClienteInfo | null>(null);

  useEffect(() => {
    if (!session) return;

    let isMounted = true;

    supabase
      .from("clientes")
      .select("nome, empresa")
      .eq("id", session.user.id)
      .maybeSingle()
      .then(({ data, error }) => {
        if (!isMounted) return;
        if (error) {
          console.error("Erro ao carregar dados do cliente:", error);
          return;
        }
        setCliente(data);
      });

    return () => {
      isMounted = false;
    };
  }, [session]);

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <AppHeader
        homeTo="/area-do-cliente/chamados"
        userEmail={session?.user.email}
        clienteNome={cliente?.nome}
        clienteEmpresa={cliente?.empresa ?? undefined}
      />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}
