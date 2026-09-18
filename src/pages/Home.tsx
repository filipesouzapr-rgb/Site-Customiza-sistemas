import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Seo } from "../components/Seo";
import { Container } from "../components/Container";
import { Button } from "../components/Button";
import { SectionTitle } from "../components/SectionTitle";
import { ServiceCard } from "../components/ServiceCard";
import { CTASection } from "../components/CTASection";
import { RevealOnScroll } from "../components/RevealOnScroll";
import { HeroScreenshot } from "../components/HeroScreenshot";
import { FeatureCard } from "../components/FeatureCard";
import { GlowBackground } from "../components/GlowBackground";
import { varejoFeatures } from "../data/varejoFeatures";
import { varejoPainPoints } from "../data/varejoPainPoints";
import { differentials } from "../data/differentials";
import { processSteps } from "../data/process";
import { techStack } from "../data/techStack";
import { pagesSeo } from "../data/pagesSeo";
import screenshotDashboard from "../assets/screenshot-dashboard.png";

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
              PDV e gestão para o seu comércio
            </span>
            <h1 className="text-4xl font-bold leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-[3.25rem]">
              O sistema de vendas que se adapta à sua loja — não o contrário.
            </h1>
            <p className="max-w-xl text-lg leading-relaxed text-white/70">
              PDV, fiado, conciliação de pagamento e contas a pagar num único
              sistema, construído em cima da forma como o seu comércio
              realmente funciona — não um sistema pronto que sobra função e
              falta o que você precisa.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Button to="/contato" icon={<ArrowRight size={18} aria-hidden="true" />}>
                Solicitar demonstração
              </Button>
              <Button to="/solucoes" variant="ghost">
                Ver como funciona
              </Button>
            </div>
          </div>
          <HeroScreenshot />
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
                title="Seu comércio não precisa se virar com sistema genérico."
                subtitle="Planilha, caderno de fiado e sistema caro que ninguém usa por completo — a maioria dos comércios ainda controla a venda do jeito mais difícil possível."
              />
              <ul className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {varejoPainPoints.map((point) => {
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
                  A Customiza desenvolve o sistema em torno da forma como você
                  vende — não o contrário.
                </p>
                <p className="mt-4 text-white/70">
                  Entendemos sua rotina real de caixa, fiado e pagamento antes
                  de propor qualquer solução, pra que o sistema funcione
                  exatamente como o seu negócio precisa.
                </p>
              </div>
            </RevealOnScroll>
          </div>
        </Container>
      </section>

      {/* O QUE O SISTEMA FAZ */}
      <section className="bg-slate-50 py-20 sm:py-28">
        <Container className="flex flex-col items-center gap-14">
          <RevealOnScroll>
            <SectionTitle
              eyebrow="O que o sistema faz"
              title="Tudo que a rotina da sua loja precisa, num só lugar."
              subtitle="Frente de caixa, fiado, conciliação de pagamento e contas a pagar — cada parte pensada pro dia a dia de quem vende."
            />
          </RevealOnScroll>
          <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {varejoFeatures.map((feature, i) => (
              <RevealOnScroll key={feature.slug} delay={i * 80}>
                <ServiceCard service={feature} />
              </RevealOnScroll>
            ))}
          </div>
        </Container>
      </section>

      {/* PROVA - TELAS REAIS */}
      <section className="bg-navy-950 py-20 sm:py-28">
        <Container className="flex flex-col items-center gap-14">
          <RevealOnScroll>
            <SectionTitle
              light
              eyebrow="Sem mockup"
              title="Essa é a tela real do sistema em produção."
              subtitle="Nada de imagem ilustrativa — é o painel que roda hoje em comércios de verdade."
            />
          </RevealOnScroll>
          <RevealOnScroll delay={120} className="w-full">
            <div className="overflow-hidden rounded-3xl border border-white/10 bg-navy-900/70 shadow-2xl shadow-black/30">
              <div className="flex items-center justify-between border-b border-white/10 px-5 py-3">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-300/70" />
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/70" />
                </div>
                <span className="text-xs font-medium text-white/40">painel administrativo</span>
              </div>
              <img
                src={screenshotDashboard}
                alt="Painel administrativo real: vendas do dia, pedidos pendentes de conciliação e saldo de fiado em aberto"
                className="w-full"
                width={1400}
                height={900}
              />
            </div>
          </RevealOnScroll>
        </Container>
      </section>

      {/* POR QUE CUSTOMIZA */}
      <section className="bg-white py-20 sm:py-28">
        <Container className="flex flex-col items-center gap-14">
          <RevealOnScroll>
            <SectionTitle
              eyebrow="Por que Customiza?"
              title="Sistema do jeito que a sua loja precisa."
              subtitle="Cada comércio vende diferente — e o sistema tem que respeitar isso."
            />
          </RevealOnScroll>
          <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {differentials.map((item, i) => (
              <RevealOnScroll key={item.title} delay={i * 80} className="h-full">
                <FeatureCard
                  icon={item.icon}
                  title={item.title}
                  description={item.description}
                />
              </RevealOnScroll>
            ))}
          </div>
        </Container>
      </section>

      {/* COMO FUNCIONA */}
      <section className="bg-slate-50 py-20 sm:py-28">
        <Container className="flex flex-col items-center gap-16">
          <RevealOnScroll>
            <SectionTitle
              eyebrow="Como funciona"
              title="Da conversa à sua loja usando o sistema."
              subtitle="Um processo simples, sem enrolação e sem sumir depois da entrega."
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

      {/* TAMBEM FAZEMOS SOB MEDIDA */}
      <section className="bg-white py-16">
        <Container className="flex flex-col items-center gap-4 text-center">
          <RevealOnScroll className="flex flex-col items-center gap-4">
            <p className="max-w-2xl text-base text-navy-900/60">
              Seu negócio não é varejo? Também desenvolvemos sistemas sob
              medida — automação, dashboards, integrações e digitalização de
              processos pra qualquer tipo de empresa.
            </p>
            <a
              href="/solucoes"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700"
            >
              Conheça as outras soluções
              <ArrowRight size={16} aria-hidden="true" />
            </a>
          </RevealOnScroll>
        </Container>
      </section>

      {/* TECNOLOGIA */}
      <section className="bg-slate-50 py-20 sm:py-28">
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
                  className="rounded-full border border-navy-900/10 bg-white px-5 py-2.5 text-sm font-medium text-navy-900/70"
                >
                  {tech}
                </span>
              ))}
            </div>
          </RevealOnScroll>
        </Container>
      </section>

      <CTASection
        title="Pronto pra ver como fica na sua loja?"
        description="Mostramos o sistema funcionando com o seu tipo de comércio, sem compromisso."
        buttonLabel="Solicitar demonstração"
      />
    </>
  );
}
