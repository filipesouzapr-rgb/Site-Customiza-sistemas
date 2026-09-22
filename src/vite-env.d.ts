/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// Meta Pixel (ver index.html) — carregado via <script> externo, então só
// existe em runtime; a tipagem aqui é o que basta para os disparos de
// evento (ex: fbq('track', 'Lead')) feitos pelo app.
interface Window {
  fbq?: (...args: unknown[]) => void;
}
