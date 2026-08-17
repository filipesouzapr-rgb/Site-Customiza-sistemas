import { Paperclip } from "lucide-react";
import { formatFileSize } from "../lib/formatFileSize";

export interface Anexo {
  id: string;
  nome_arquivo: string;
  tamanho: number | null;
  signedUrl: string | null;
}

interface AnexosListProps {
  anexos: Anexo[];
}

export function AnexosList({ anexos }: AnexosListProps) {
  if (anexos.length === 0) return null;

  return (
    <div className="flex flex-col gap-2">
      {anexos.map((anexo) => (
        <a
          key={anexo.id}
          href={anexo.signedUrl ?? undefined}
          target="_blank"
          rel="noopener noreferrer"
          aria-disabled={!anexo.signedUrl}
          className={`flex items-center gap-3 rounded-xl border border-navy-900/12 bg-white px-4 py-3 text-sm transition-colors ${
            anexo.signedUrl
              ? "hover:border-blue-600/30 hover:bg-blue-50/40"
              : "pointer-events-none opacity-50"
          }`}
        >
          <Paperclip size={16} className="shrink-0 text-blue-600" aria-hidden="true" />
          <span className="truncate text-navy-900">{anexo.nome_arquivo}</span>
          {anexo.tamanho != null && (
            <span className="ml-auto shrink-0 text-xs text-navy-900/40">
              {formatFileSize(anexo.tamanho)}
            </span>
          )}
        </a>
      ))}
    </div>
  );
}
