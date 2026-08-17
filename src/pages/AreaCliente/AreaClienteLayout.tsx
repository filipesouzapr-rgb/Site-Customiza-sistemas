import { Outlet } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { AppHeader } from "../../components/AppHeader";

export function AreaClienteLayout() {
  const { session } = useAuth();

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <AppHeader homeTo="/area-do-cliente/chamados" userEmail={session?.user.email} />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}
