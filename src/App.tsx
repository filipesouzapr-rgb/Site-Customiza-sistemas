import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { PublicLayout } from "./components/PublicLayout";
import { ScrollToTop } from "./components/ScrollToTop";
import { Home } from "./pages/Home";
import { Servicos } from "./pages/Servicos";
import { Solucoes } from "./pages/Solucoes";
import { Sobre } from "./pages/Sobre";
import { Contato } from "./pages/Contato";

// Carregados sob demanda: só quem acessa /area-do-cliente baixa o cliente
// Supabase e o código relacionado, mantendo o bundle das páginas públicas
// enxuto.
const AreaClienteRoot = lazy(() =>
  import("./pages/AreaCliente/AreaClienteRoot").then((m) => ({ default: m.AreaClienteRoot })),
);
const Login = lazy(() => import("./pages/AreaCliente/Login").then((m) => ({ default: m.Login })));
const ProtectedRoute = lazy(() =>
  import("./pages/AreaCliente/ProtectedRoute").then((m) => ({ default: m.ProtectedRoute })),
);
const AreaClienteLayout = lazy(() =>
  import("./pages/AreaCliente/AreaClienteLayout").then((m) => ({ default: m.AreaClienteLayout })),
);
const Chamados = lazy(() => import("./pages/AreaCliente/Chamados").then((m) => ({ default: m.Chamados })));

function AreaClienteFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-navy-950">
      <Loader2 size={28} className="animate-spin text-cyan-accent" aria-hidden="true" />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/servicos" element={<Servicos />} />
          <Route path="/solucoes" element={<Solucoes />} />
          <Route path="/sobre" element={<Sobre />} />
          <Route path="/contato" element={<Contato />} />
        </Route>

        <Route
          path="/area-do-cliente"
          element={
            <Suspense fallback={<AreaClienteFallback />}>
              <AreaClienteRoot />
            </Suspense>
          }
        >
          <Route path="login" element={<Login />} />
          <Route element={<ProtectedRoute />}>
            <Route element={<AreaClienteLayout />}>
              <Route path="chamados" element={<Chamados />} />
            </Route>
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
