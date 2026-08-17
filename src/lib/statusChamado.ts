// Status válidos de `chamados.status`, compartilhado entre a Área do
// Cliente e o Painel administrativo.
export const statusOptions = [
  { value: "aberto", label: "Aberto" },
  { value: "andamento", label: "Andamento" },
  { value: "resolvido", label: "Resolvido" },
];

export const statusStyles: Record<string, string> = {
  aberto: "bg-blue-50 text-blue-700",
  andamento: "bg-amber-50 text-amber-700",
  resolvido: "bg-emerald-50 text-emerald-700",
};

export function statusLabel(status: string): string {
  return status.replace(/_/g, " ");
}
