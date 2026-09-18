import {
  EyeOff,
  Wallet,
  ClipboardCheck,
  FileText,
  ShieldCheck,
  Globe,
  type LucideIcon,
} from "lucide-react";

export interface VarejoFeature {
  slug: string;
  icon: LucideIcon;
  title: string;
  shortDescription: string;
  description: string;
  benefits: string[];
  example: string;
}

export const varejoFeatures: VarejoFeature[] = [
  {
    slug: "pdv-sem-valor",
    icon: EyeOff,
    title: "PDV sem exposição de valor",
    shortDescription:
      "O operador lança o item, não o preço — erro e fraude de caixa ficam muito mais difíceis.",
    description:
      "O operador só enxerga o que está sendo vendido, nunca o valor, o troco ou o desconto. Todo o lado financeiro fica só com quem você autorizar.",
    benefits: [
      "Operador não decide nem vê valor",
      "Cliente sempre vinculado à venda",
      "Menos espaço pra erro ou fraude no caixa",
    ],
    example: "Uma loja que hoje não consegue explicar diferenças de caixa no fim do dia.",
  },
  {
    slug: "fiado-controlado",
    icon: Wallet,
    title: "Fiado com controle automático",
    shortDescription: "Saldo de cada cliente calculado sozinho, sem depender de caderneta.",
    description:
      "Toda venda fica vinculada a um cliente. O sistema soma o que cada um deve e o que já pagou, sem planilha, sem caderno, sem esquecer de anotar.",
    benefits: [
      "Saldo por cliente sempre atualizado",
      "Histórico de compras e pagamentos",
      "Fim da caderneta de fiado",
    ],
    example: "Um comércio que vende fiado pra clientes fixos e perde o controle de quem já pagou.",
  },
  {
    slug: "conciliacao-edicao",
    icon: ClipboardCheck,
    title: "Conciliação e edição de pedidos",
    shortDescription:
      "Quem manda decide a forma de pagamento e corrige o pedido depois, sem pressa.",
    description:
      "Toda venda nasce pendente de conciliação. O responsável revisa, define a forma de pagamento (inclusive dividida) e pode corrigir itens ou desconto quando precisar — sem depender do operador.",
    benefits: [
      "Forma de pagamento decidida por quem tem autoridade",
      "Pagamento pode ser dividido em mais de uma forma",
      "Pedido pode ser corrigido depois, sem gambiarra",
    ],
    example: "Uma venda que precisa de ajuste depois de fechada, ou pagamento definido só no fim do dia.",
  },
  {
    slug: "contas-a-pagar",
    icon: FileText,
    title: "Contas a pagar completo",
    shortDescription: "Fornecedores, despesas recorrentes e vencimentos organizados num só lugar.",
    description:
      "Cadastre fornecedores e despesas que se repetem (semanal, quinzenal, mensal) e o sistema já gera as próximas contas a vencer sozinho, com data e valor certos.",
    benefits: [
      "Despesas recorrentes geradas automaticamente",
      "Visão clara do que vence e do que já foi pago",
      "Nada mais anotado em papel avulso",
    ],
    example: "Uma empresa que paga aluguel, fornecedores e contas fixas todo mês e perde prazo por falta de controle.",
  },
  {
    slug: "acesso-por-papel",
    icon: ShieldCheck,
    title: "Acesso por papel, não por confiança",
    shortDescription: "Operador só opera o caixa. Só quem você autorizar vê o resto.",
    description:
      "Cada pessoa tem um papel definido — operador, supervisor ou dono — e o próprio sistema controla o que cada um pode ver e fazer, sem depender de combinação verbal.",
    benefits: [
      "Operador restrito só à tela de venda",
      "Painel completo só pra quem administra",
      "Login individual, com senha que o próprio usuário troca",
    ],
    example: "Um funcionário novo que só deveria mexer no caixa, mas hoje tem acesso a tudo.",
  },
  {
    slug: "acesso-de-qualquer-lugar",
    icon: Globe,
    title: "Direto do navegador, de qualquer lugar",
    shortDescription: "Sem instalar nada. Acompanhe a loja do computador, tablet ou celular.",
    description:
      "O sistema roda no navegador — computador, tablet ou celular. Você acompanha vendas, fiado e contas a pagar de onde estiver, sem instalar nada.",
    benefits: [
      "Acesso de qualquer dispositivo",
      "Sem instalação, sempre atualizado",
      "Dá pra acompanhar a loja de fora",
    ],
    example: "Um dono que quer ver como a loja está indo sem precisar estar lá.",
  },
];
