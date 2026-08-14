import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Seo } from "../components/Seo";
import { Container } from "../components/Container";
import { Button } from "../components/Button";
import { SectionTitle } from "../components/SectionTitle";
import { ServiceCard } from "../components/ServiceCard";
import { CTASection } from "../components/CTASection";
import { RevealOnScroll } from "../components/RevealOnScroll";
import { HeroVisual } from "../components/HeroVisual";
import { FeatureCard } from "../components/FeatureCard";
import { IconCard } from "../components/IconCard";
import { GlowBackground } from "../components/GlowBackground";
import { services } from "../data/services";
import { painPoints } from "../data/painPoints";
import { differentials } from "../data/differentials";
import { processSteps } from "../data/process";
import { solutionExamples } from "../data/solutionExamples";
import { techStack } from "../data/techStack";
import { pagesSeo } from "../data/pagesSeo";

export function Home() {
  return (
    <>
      <Seo {...pagesSeo.home} />

      {/* HERO */}
      <section className="relative overflow-hidden bg-navy-950">
        <GlowBackground positions={["10% 10%", "90% 40%"]} />
        <Container className="relative grid grid-cols-1 items-center gap-16 py-20 sm:py-28 lg:grid-cols-2 lg:py-32">
          <div className="flex flex-col items-start gap-7">
            <span className="rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-accent">
              Tecnologia sob medida
            </span>
            <h1 className="text-4xl font-bold leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-[3.25rem]">
              Tecnologia feita para o seu negócio.
            </h1>
            <p className="max-w-xl text-lg leading-relaxed text-white/70">
              Desenvolvemos sistemas personalizados que simplificam processos,
              automatizam tarefas e ajudam sua empresa a crescer.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Button to="/contato" icon={<ArrowRight size={18} aria-hidden="true" />}>
                Solicitar orçamento
              </Button>
              <Button to="/solucoes" variant="ghost">
                Conheça nossas soluções
              </Button>
            </div>
          </div>
          <HeroVisual />
        </Container>
      </section>

      {/* PROBLEMA */}
      <section className="bg-white py-20 sm:py-28">
        <Container>
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-2 lg:items-center">
            <RevealOnScroll>
              <SectionTitle
                align="left"
                eyebrow="O problema"
                title="Seu negócio não precisa se adaptar ao sistema."
                subtitle="É o sistema que deve se adaptar ao seu negócio. Muitas empresas ainda dependem de processos manuais e ferramentas que não foram feitas para a sua realidade."
              />
              <ul className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {painPoints.map((point) => {
                  const Icon = point.icon;
                  return (
                    <li
                      key={point.title}
                      className="flex items-center gap-3 rounded-xl border border-navy-900/8 bg-slate-50 px-4 py-3.5"
                    >
                      <Icon size={18} className="shrink-0 text-blue-600" aria-hidden="true" />
                      <span className="text-sm font-medium text-navy-900/80">
                        {point.title}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </RevealOnScroll>
            <RevealOnScroll delay={150}>
              <div className="rounded-3xl bg-gradient-to-br from-navy-900 to-blue-800 p-10 text-white shadow-xl shadow-navy-900/20">
                <CheckCircle2 size={40} className="text-cyan-accent" aria-hidden="true" />
                <p className="mt-6 text-2xl font-semibold leading-snug">
                  A Customiza desenvolve o sistema em torno do seu processo — não o
                  contrário.
                </p>
                <p className="mt-4 text-white/70">
                  Entendemos sua rotina real antes de propor qualquer solução, para
                  que o sistema funcione exatamente como sua empresa precisa.
                </p>
              </div>
            </RevealOnScroll>
          </div>
        </Container>
      </section>

      {/* O QUE FAZEMOS */}
      <section className="bg-slate-50 py-20 sm:py-28">
        <Container className="flex flex-col items-center gap-14">
          <RevealOnScroll>
            <SectionTitle
              eyebrow="O que fazemos"
              title="Soluções pensadas para o seu processo."
              subtitle="Da automação de tarefas repetitivas a sistemas completos de gestão, desenvolvemos o que sua empresa precisa."
            />
          </RevealOnScroll>
          <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service, i) => (
              <RevealOnScroll key={service.slug} delay={i * 80}>
                <ServiceCard service={service} />
              </RevealOnScroll>
            ))}
          </div>
        </Container>
      </section>

      {/* POR QUE CUSTOMIZA */}
      <section className="bg-navy-950 py-20 sm:py-28">
        <Container className="flex flex-col items-center gap-14">
          <RevealOnScroll>
            <SectionTitle
              light
              eyebrow="Por que Customiza?"
              title="Tecnologia do seu jeito."
              subtitle="Cada empresa é diferente — e a forma de desenvolver o sistema também deve ser."
            />
          </RevealOnScroll>
          <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {differentials.map((item, i) => (
              <RevealOnScroll key={item.title} delay={i * 80} className="h-full">
                <FeatureCard
                  icon={item.icon}
                  title={item.title}
                  description={item.description}
                  variant="dark"
                />
              </RevealOnScroll>
            ))}
          </div>
        </Container>
      </section>

      {/* COMO FUNCIONA */}
      <section className="bg-white py-20 sm:py-28">
        <Container className="flex flex-col items-center gap-16">
          <RevealOnScroll>
            <SectionTitle
              eyebrow="Como funciona"
              title="Um processo simples e transparente."
              subtitle="Do primeiro contato à entrega, você acompanha cada etapa do desenvolvimento."
            />
          </RevealOnScroll>
          <div className="relative grid w-full grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
            <div
              className="absolute top-6 right-0 left-0 hidden h-px bg-gradient-to-r from-transparent via-navy-900/15 to-transparent lg:block"
              aria-hidden="true"
            />
            {processSteps.map((step, i) => {
              const Icon = step.icon;
              return (
                <RevealOnScroll key={step.number} delay={i * 100} className="relative flex flex-col gap-4">
                  <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-cyan-accent font-bold text-white shadow-md shadow-blue-600/30">
                    <Icon size={22} aria-hidden="true" />
                  </div>
                  <span className="text-xs font-bold tracking-widest text-blue-600">
                    {step.number}
                  </span>
                  <h3 className="text-lg font-semibold text-navy-900">{step.title}</h3>
                  <p className="text-sm leading-relaxed text-navy-900/60">
                    {step.description}
                  </p>
                </RevealOnScroll>
              );
            })}
          </div>
        </Container>
      </section>

      {/* EXEMPLOS DE SOLUÇÕES */}
      <section className="bg-slate-50 py-20 sm:py-28">
        <Container className="flex flex-col items-center gap-14">
          <RevealOnScroll>
            <SectionTitle
              eyebrow="Exemplos de soluções"
              title="Possibilidades do que podemos desenvolver."
              subtitle="Alguns exemplos de sistemas que podem ser criados sob medida para a sua empresa."
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

      {/* TECNOLOGIA */}
      <section className="bg-white py-20 sm:py-28">
        <Container className="flex flex-col items-center gap-10 text-center">
          <RevealOnScroll className="flex flex-col items-center gap-10">
            <SectionTitle
              eyebrow="Tecnologia"
              title="Construído com tecnologia moderna."
              subtitle="Utilizamos ferramentas atuais e consolidadas no mercado para desenvolver sistemas rápidos, seguros e fáceis de evoluir."
            />
            <div className="flex flex-wrap items-center justify-center gap-3">
              {techStack.map((tech) => (
                <span
                  key={tech}
                  className="rounded-full border border-navy-900/10 bg-slate-50 px-5 py-2.5 text-sm font-medium text-navy-900/70"
                >
                  {tech}
                </span>
              ))}
            </div>
          </RevealOnScroll>
        </Container>
      </section>

      <CTASection />
    </>
  );
}
