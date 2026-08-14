import {
  SlidersHorizontal,
  Workflow,
  Globe,
  LayoutDashboard,
  Network,
  ScanLine,
  type LucideIcon,
} from "lucide-react";

export interface Service {
  slug: string;
  icon: LucideIcon;
  title: string;
  shortDescription: string;
  description: string;
  benefits: string[];
  example: string;
}

export const services: Service[] = [
  {
    slug: "sistema-sob-medida",
    icon: SlidersHorizontal,
    title: "Sistema sob medida",
    shortDescription:
      "Sistemas desenvolvidos especificamente para os processos da sua empresa.",
    description:
      "Nada de soluções genéricas que obrigam sua empresa a se adaptar. Desenvolvemos o sistema em torno da forma como o seu negócio realmente funciona, respeitando suas regras, fluxos e particularidades.",
    benefits: [
      "Funcionalidades pensadas para o seu processo, sem excessos",
      "Sistema que acompanha a rotina da equipe, não o contrário",
      "Liberdade para evoluir o sistema conforme a empresa cresce",
    ],
    example:
      "Uma empresa com um processo interno específico, que não é atendido por sistemas prontos do mercado.",
  },
  {
    slug: "automacao-de-processos",
    icon: Workflow,
    title: "Automação de processos",
    shortDescription: "Redução de tarefas manuais e repetitivas.",
    description:
      "Identificamos tarefas manuais e repetitivas no dia a dia da empresa e criamos automações que eliminam retrabalho, reduzem erros e liberam tempo da equipe para atividades mais importantes.",
    benefits: [
      "Menos tarefas manuais e repetitivas",
      "Redução de erros causados por processos manuais",
      "Equipe com mais tempo para atividades estratégicas",
    ],
    example:
      "Uma rotina que hoje depende de preenchimento manual de planilhas ou repetição da mesma tarefa em vários sistemas.",
  },
  {
    slug: "sistemas-web",
    icon: Globe,
    title: "Sistemas Web",
    shortDescription:
      "Soluções acessíveis pelo navegador, computador, tablet ou celular.",
    description:
      "Desenvolvemos sistemas web modernos, acessíveis de qualquer lugar, sem necessidade de instalação. Sua equipe acessa de onde estiver, no computador, tablet ou celular.",
    benefits: [
      "Acesso de qualquer lugar, sem instalação",
      "Compatível com computador, tablet e celular",
      "Atualizações centralizadas, sem complicação",
    ],
    example:
      "Uma equipe que precisa acessar o mesmo sistema em diferentes locais ou dispositivos.",
  },
  {
    slug: "dashboards",
    icon: LayoutDashboard,
    title: "Dashboards",
    shortDescription: "Informações organizadas para facilitar decisões.",
    description:
      "Transformamos dados dispersos em painéis visuais claros e objetivos, ajudando a empresa a enxergar indicadores importantes e tomar decisões com mais segurança.",
    benefits: [
      "Indicadores organizados em um só lugar",
      "Visão clara para apoiar decisões estratégicas",
      "Menos tempo procurando informação, mais tempo analisando",
    ],
    example:
      "Uma gestão que precisa acompanhar indicadores importantes, mas hoje depende de relatórios manuais e dispersos.",
  },
  {
    slug: "integracoes",
    icon: Network,
    title: "Integrações",
    shortDescription:
      "Conexão entre diferentes sistemas, APIs e bancos de dados.",
    description:
      "Conectamos sistemas que hoje não conversam entre si, eliminando a necessidade de digitar a mesma informação em vários lugares e mantendo os dados sempre atualizados.",
    benefits: [
      "Fim da digitação repetida da mesma informação",
      "Sistemas trocando dados automaticamente",
      "Menos inconsistência entre diferentes bases de dados",
    ],
    example:
      "Duas ferramentas diferentes usadas pela empresa que precisam compartilhar as mesmas informações.",
  },
  {
    slug: "digitalizacao",
    icon: ScanLine,
    title: "Digitalização de processos",
    shortDescription:
      "Transformação de processos manuais em processos digitais.",
    description:
      "Pegamos processos que hoje dependem de papel, planilhas ou controles informais e transformamos em processos digitais organizados, seguros e fáceis de acompanhar.",
    benefits: [
      "Fim dos controles em papel ou planilhas soltas",
      "Processos organizados e fáceis de auditar",
      "Informação segura e centralizada",
    ],
    example:
      "Um controle interno que hoje é feito em papel, planilhas soltas ou anotações informais.",
  },
];
