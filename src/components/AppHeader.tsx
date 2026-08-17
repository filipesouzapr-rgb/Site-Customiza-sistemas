import { Link } from "react-router-dom";
import { LogOut } from "lucide-react";
import { supabase } from "../lib/supabaseClient";
import logo from "../assets/logo-header.png";

interface AppHeaderProps {
  homeTo: string;
  userEmail?: string;
}

export function AppHeader({ homeTo, userEmail }: AppHeaderProps) {
  async function handleLogout() {
    await supabase.auth.signOut();
  }

  return (
    <header className="border-b border-navy-900/8 bg-white">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link to={homeTo} className="flex items-center">
          <img src={logo} alt="Customiza Sistemas" className="h-8 w-auto" />
        </Link>
        <div className="flex items-center gap-4">
          {userEmail && (
            <span className="hidden text-sm text-navy-900/60 sm:inline">{userEmail}</span>
          )}
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
  );
}
