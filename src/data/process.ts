import { Search, ClipboardList, Code2, Rocket, type LucideIcon } from "lucide-react";

export interface ProcessStep {
  number: string;
  icon: LucideIcon;
  title: string;
  description: string;
}

export const processSteps: ProcessStep[] = [
  {
    number: "01",
    icon: Search,
    title: "Entendemos",
    description: "Conversamos para entender o problema e o processo atual.",
  },
  {
    number: "02",
    icon: ClipboardList,
    title: "Planejamos",
    description: "Definimos a melhor solução, funcionalidades e estrutura.",
  },
  {
    number: "03",
    icon: Code2,
    title: "Desenvolvemos",
    description: "Construímos o sistema de forma personalizada.",
  },
  {
    number: "04",
    icon: Rocket,
    title: "Entregamos",
    description:
      "Colocamos a solução em funcionamento e acompanhamos sua evolução.",
  },
];
