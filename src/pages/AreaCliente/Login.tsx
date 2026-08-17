import { useState, type FormEvent } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { LogIn, Loader2 } from "lucide-react";
import { supabase } from "../../lib/supabaseClient";
import { useAuth } from "../../hooks/useAuth";
import { GlowBackground } from "../../components/GlowBackground";
import logo from "../../assets/logo-header.png";

const inputClasses =
  "w-full rounded-xl border border-navy-900/12 bg-white px-4 py-3 text-sm text-navy-900 placeholder:text-navy-900/35 transition-colors focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/30";

export function Login() {
  const navigate = useNavigate();
  const { session, isLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isLoading && session) {
    return <Navigate to="/area-do-cliente/chamados" replace />;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });

    if (signInError) {
      setError("E-mail ou senha incorretos.");
      setIsSubmitting(false);
      return;
    }

    navigate("/area-do-cliente/chamados");
  }

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-navy-950 px-6 py-16">
      <GlowBackground positions={["15% 15%", "85% 85%"]} />

      <div className="relative w-full max-w-md rounded-2xl border border-navy-900/8 bg-white p-8 shadow-2xl shadow-black/30 sm:p-10">
        <div className="flex flex-col items-center gap-3 text-center">
          <img src={logo} alt="Customiza Sistemas" className="h-9 w-auto" />
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-navy-900">Área do cliente</h1>
            <p className="mt-1.5 text-sm leading-relaxed text-navy-900/60">
              Entre com seu e-mail e senha para acompanhar seus chamados.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} noValidate className="mt-8 flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-sm font-medium text-navy-900">
              E-mail
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClasses}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="password" className="text-sm font-medium text-navy-900">
              Senha
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputClasses}
            />
          </div>

          {error && (
            <p role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-2 inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition-all hover:bg-blue-500 disabled:pointer-events-none disabled:opacity-70"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={18} className="animate-spin" aria-hidden="true" />
                Entrando...
              </>
            ) : (
              <>
                Entrar
                <LogIn size={16} aria-hidden="true" />
              </>
            )}
          </button>
        </form>
      </div>
    </section>
  );
}
