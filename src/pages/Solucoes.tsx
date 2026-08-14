import { ArrowRight } from "lucide-react";
import { Seo } from "../components/Seo";
import { Container } from "../components/Container";
import { PageHero } from "../components/PageHero";
import { SectionTitle } from "../components/SectionTitle";
import { CTASection } from "../components/CTASection";
import { RevealOnScroll } from "../components/RevealOnScroll";
import { IconCard } from "../components/IconCard";
import { solutionsQA } from "../data/solutionsQA";
import { solutionExamples } from "../data/solutionExamples";
import { pagesSeo } from "../data/pagesSeo";

export function Solucoes() {
  return (
    <>
      <Seo {...pagesSeo.solucoes} />

      <PageHero
        eyebrow="Soluções"
        title="Não vendemos um sistema. Resolvemos um problema."
        description="Cada empresa enfrenta desafios diferentes no dia a dia. Veja como podemos transformar esses desafios em soluções digitais."
      />

      <section className="bg-white py-20 sm:py-28">
        <Container className="flex flex-col gap-6">
          {solutionsQA.map((item, i) => (
            <RevealOnScroll key={item.question} delay={i * 90}>
              <div className="grid grid-cols-1 items-center gap-6 rounded-2xl border border-navy-900/8 bg-slate-50 p-8 sm:grid-cols-2 sm:gap-10">
                <p className="text-xl font-semibold leading-snug text-navy-900">
                  {item.question}
                </p>
                <div className="flex items-start gap-3 sm:items-center">
                  <ArrowRight size={20} className="mt-1 shrink-0 text-blue-600 sm:mt-0" aria-hidden="true" />
                  <p className="text-base leading-relaxed text-navy-900/70">
                    {item.answer}
                  </p>
                </div>
              </div>
            </RevealOnScroll>
          ))}
        </Container>
      </section>

      <section className="bg-slate-50 py-20 sm:py-28">
        <Container className="flex flex-col items-center gap-14">
          <RevealOnScroll>
            <SectionTitle
              eyebrow="O que podemos criar"
              title="Exemplos de soluções sob medida."
              subtitle="Estes são exemplos de sistemas que podem ser desenvolvidos de acordo com a necessidade da sua empresa."
            />
          </RevealOnScroll>
          <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {solutionExamples.map((example, i) => (
              <RevealOnScroll key={example.title} delay={i * 70}>
                <IconCard icon={example.icon} title={example.title} description={example.description} />
              </RevealOnScroll>
            ))}
          </div>
        </Container>
      </section>

      <CTASection
        title="Qual é o desafio do seu negócio?"
        description="Conte para a gente o que está travando o seu processo. Vamos entender e propor a solução ideal."
        buttonLabel="Solicitar orçamento"
      />
    </>
  );
}
