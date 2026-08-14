import { Fingerprint, Eye, RefreshCw, Users } from "lucide-react";
import { Seo } from "../components/Seo";
import { Container } from "../components/Container";
import { PageHero } from "../components/PageHero";
import { SectionTitle } from "../components/SectionTitle";
import { CTASection } from "../components/CTASection";
import { RevealOnScroll } from "../components/RevealOnScroll";
import { FeatureCard } from "../components/FeatureCard";
import { pagesSeo } from "../data/pagesSeo";

const values = [
  {
    icon: Fingerprint,
    title: "Personalização real",
    description:
      "Cada sistema é pensado a partir do processo do cliente, não do processo de um sistema pronto.",
  },
  {
    icon: Eye,
    title: "Transparência",
    description:
      "Acompanhamento claro em cada etapa do desenvolvimento, sem surpresas.",
  },
  {
    icon: Users,
    title: "Proximidade com o cliente",
    description:
      "Entendemos o negócio antes de propor qualquer solução técnica.",
  },
  {
    icon: RefreshCw,
    title: "Melhoria contínua",
    description:
      "Um sistema não termina na entrega — ele evolui junto com a empresa.",
  },
];

export function Sobre() {
  return (
    <>
      <Seo {...pagesSeo.sobre} />

      <PageHero
        eyebrow="Sobre nós"
        title="Tecnologia com propósito."
        description="A Customiza Sistemas nasceu com a proposta de desenvolver soluções tecnológicas personalizadas, focadas nas necessidades reais das empresas."
      />

      <section className="bg-white py-20 sm:py-28">
        <Container>
          <div className="mx-auto flex max-w-3xl flex-col gap-6 text-center">
            <RevealOnScroll>
              <p className="text-lg leading-relaxed text-navy-900/70">
                Acreditamos que tecnologia só faz sentido quando resolve um
                problema real. Por isso, antes de escrever qualquer linha de
                código, buscamos entender a fundo como cada empresa funciona:
                seus processos, suas dificuldades e o que realmente faria
                diferença no dia a dia.
              </p>
              <p className="mt-6 text-lg leading-relaxed text-navy-900/70">
                A partir desse entendimento, desenvolvemos sistemas sob medida
                — sem excesso de funcionalidades desnecessárias e sem deixar
                de lado o que é essencial para o seu negócio crescer com mais
                organização e eficiência.
              </p>
            </RevealOnScroll>
          </div>
        </Container>
      </section>

      <section className="bg-slate-50 py-20 sm:py-28">
        <Container className="flex flex-col items-center gap-14">
          <RevealOnScroll>
            <SectionTitle
              eyebrow="Como pensamos"
              title="Princípios que guiam o nosso trabalho."
            />
          </RevealOnScroll>
          <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value, i) => (
              <RevealOnScroll key={value.title} delay={i * 80}>
                <FeatureCard icon={value.icon} title={value.title} description={value.description} />
              </RevealOnScroll>
            ))}
          </div>
        </Container>
      </section>

      <CTASection
        title="Quer conhecer melhor o nosso trabalho?"
        description="Fale com a gente e entenda como podemos ajudar a transformar o processo da sua empresa."
        buttonLabel="Fale conosco"
      />
    </>
  );
}
