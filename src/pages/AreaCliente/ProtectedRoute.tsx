import { Navigate, Outlet, useLocation } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

export function ProtectedRoute() {
  const { session, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-navy-950">
        <Loader2 size={28} className="animate-spin text-cyan-accent" aria-hidden="true" />
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/area-do-cliente/login" state={{ from: location.pathname }} replace />;
  }

  return <Outlet />;
}
