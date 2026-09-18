import {
  EyeOff,
  Receipt,
  FileSpreadsheet,
  ShieldAlert,
  RefreshCw,
  Smartphone,
  type LucideIcon,
} from "lucide-react";

export interface PainPoint {
  icon: LucideIcon;
  title: string;
}

export const varejoPainPoints: PainPoint[] = [
  { icon: EyeOff, title: "Operador vendo e decidindo valor no caixa" },
  { icon: Receipt, title: "Fiado controlado em caderno ou de cabeça" },
  { icon: FileSpreadsheet, title: "Contas a pagar espalhadas em papel ou planilha" },
  { icon: ShieldAlert, title: "Qualquer funcionário com acesso a tudo" },
  { icon: RefreshCw, title: "Pedido errado sem um jeito fácil de corrigir" },
  { icon: Smartphone, title: "Sistema caro que só funciona no computador da loja" },
];
