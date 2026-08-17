import { Outlet } from "react-router-dom";
import { AuthProvider } from "../../contexts/AuthContext";

// Ponto de entrada da Área do Cliente: só a partir daqui o cliente Supabase
// é carregado, então visitantes das páginas públicas nunca baixam esse
// código (ver App.tsx — esta árvore inteira é importada via React.lazy).
export function AreaClienteRoot() {
  return (
    <AuthProvider>
      <Outlet />
    </AuthProvider>
  );
}
