import { Outlet, Link } from "react-router-dom";
import { LogOut } from "lucide-react";
import { supabase } from "../../lib/supabaseClient";
import { useAuth } from "../../hooks/useAuth";
import logo from "../../assets/logo-header.png";

export function AreaClienteLayout() {
  const { session } = useAuth();

  async function handleLogout() {
    await supabase.auth.signOut();
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <header className="border-b border-navy-900/8 bg-white">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link to="/area-do-cliente/chamados" className="flex items-center">
            <img src={logo} alt="Customiza Sistemas" className="h-8 w-auto" />
          </Link>
          <div className="flex items-center gap-4">
            <span className="hidden text-sm text-navy-900/60 sm:inline">
              {session?.user.email}
            </span>
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 rounded-lg border border-navy-900/12 px-3 py-2 text-sm font-medium text-navy-900/70 transition-colors hover:border-red-300 hover:text-red-600"
            >
              <LogOut size={16} aria-hidden="true" />
              Sair
            </button>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}
