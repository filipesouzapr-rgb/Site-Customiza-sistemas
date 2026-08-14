export interface PageSeo {
  path: string;
  title: string;
  description: string;
}

/**
 * Fonte única dos metadados de SEO por página.
 * Usado tanto pelo componente <Seo> em tempo de execução quanto pelo script
 * de pré-renderização estática (scripts/generate-static-seo.mjs) após o build.
 */
export const pagesSeo = {
  home: {
    path: "/",
    title: "Customiza Sistemas | Soluções sob medida para o seu negócio",
    description:
      "A Customiza Sistemas desenvolve sistemas personalizados, automações, dashboards e soluções digitais sob medida para empresas.",
  },
  servicos: {
    path: "/servicos",
    title: "Serviços | Customiza Sistemas",
    description:
      "Conheça os serviços da Customiza Sistemas: sistemas personalizados, automação de processos, dashboards, integrações e digitalização de processos.",
  },
  solucoes: {
    path: "/solucoes",
    title: "Soluções | Customiza Sistemas",
    description:
      "A Customiza Sistemas não vende apenas um sistema — resolve problemas reais do seu negócio com soluções digitais sob medida.",
  },
  sobre: {
    path: "/sobre",
    title: "Sobre | Customiza Sistemas",
    description:
      "Conheça a proposta da Customiza Sistemas: tecnologia personalizada, focada nas necessidades reais de cada negócio.",
  },
  contato: {
    path: "/contato",
    title: "Contato | Customiza Sistemas",
    description:
      "Solicite um orçamento para o desenvolvimento de um sistema sob medida para a sua empresa. Conte para a Customiza Sistemas o que você precisa.",
  },
} satisfies Record<string, PageSeo>;
