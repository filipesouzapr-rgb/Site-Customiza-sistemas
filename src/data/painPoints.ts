import {
  FileSpreadsheet,
  ListTodo,
  Boxes,
  RefreshCw,
  FolderOpen,
  Unplug,
  type LucideIcon,
} from "lucide-react";

export interface PainPoint {
  icon: LucideIcon;
  title: string;
}

export const painPoints: PainPoint[] = [
  { icon: FileSpreadsheet, title: "Planilhas espalhadas por todo lado" },
  { icon: ListTodo, title: "Processos manuais e demorados" },
  { icon: Boxes, title: "Controles descentralizados" },
  { icon: RefreshCw, title: "Retrabalho no dia a dia" },
  { icon: FolderOpen, title: "Informações difíceis de encontrar" },
  { icon: Unplug, title: "Sistemas que não conversam entre si" },
];
