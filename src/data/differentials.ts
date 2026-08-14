import {
  Target,
  Sparkles,
  TrendingUp,
  Handshake,
  CheckCircle2,
  type LucideIcon,
} from "lucide-react";

export interface Differential {
  icon: LucideIcon;
  title: string;
  description: string;
}

export const differentials: Differential[] = [
  {
    icon: Target,
    title: "Sob medida",
    description:
      "Nada de solução genérica. O sistema é desenvolvido de acordo com sua necessidade.",
  },
  {
    icon: Sparkles,
    title: "Simplicidade",
    description:
      "Tecnologia sem complicação para quem precisa utilizar o sistema no dia a dia.",
  },
  {
    icon: TrendingUp,
    title: "Escalabilidade",
    description: "A solução pode evoluir junto com a empresa.",
  },
  {
    icon: Handshake,
    title: "Proximidade",
    description: "Entendemos o problema antes de desenvolver a solução.",
  },
  {
    icon: CheckCircle2,
    title: "Resultado",
    description:
      "O objetivo não é apenas criar um sistema, mas melhorar o processo da empresa.",
  },
];
