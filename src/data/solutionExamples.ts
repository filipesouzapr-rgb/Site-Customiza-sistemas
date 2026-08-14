import {
  Wallet,
  Building2,
  ClipboardCheck,
  LayoutDashboard,
  Cpu,
  Users,
  type LucideIcon,
} from "lucide-react";

export interface SolutionExample {
  icon: LucideIcon;
  title: string;
  description: string;
}

export const solutionExamples: SolutionExample[] = [
  {
    icon: Wallet,
    title: "Gestão financeira",
    description:
      "Controle de clientes, contratos, parcelas, pagamentos e recebimentos.",
  },
  {
    icon: Building2,
    title: "Gestão empresarial",
    description: "Cadastros, processos, usuários, permissões e relatórios.",
  },
  {
    icon: ClipboardCheck,
    title: "Controle operacional",
    description: "Acompanhamento de tarefas, processos e produtividade.",
  },
  {
    icon: LayoutDashboard,
    title: "Dashboards",
    description: "Indicadores e informações estratégicas em tempo real.",
  },
  {
    icon: Cpu,
    title: "Sistemas internos",
    description: "Ferramentas específicas para processos internos.",
  },
  {
    icon: Users,
    title: "Portais e plataformas",
    description:
      "Ambientes personalizados para clientes, funcionários ou parceiros.",
  },
];
