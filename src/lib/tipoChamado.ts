// Rótulos de exibição para os valores de `chamados.tipo`, que no banco
// ficam restritos pela check constraint chamados_tipo_check (minúsculo,
// sem acento). Ver src/pages/AreaCliente/NovoChamado.tsx.
const TIPO_LABELS: Record<string, string> = {
  erro: "Erro",
  melhoria: "Melhoria",
  personalizacao: "Personalização",
};

export function tipoLabel(tipo: string): string {
  return TIPO_LABELS[tipo] ?? tipo;
}
