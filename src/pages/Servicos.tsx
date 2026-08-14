import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Seo } from "../components/Seo";
import { Container } from "../components/Container";
import { PageHero } from "../components/PageHero";
import { Button } from "../components/Button";
import { CTASection } from "../components/CTASection";
import { RevealOnScroll } from "../components/RevealOnScroll";
import { services } from "../data/services";
import { pagesSeo } from "../data/pagesSeo";

export function Servicos() {
  return (
    <>
      <Seo {...pagesSeo.servicos} />

      <PageHero
        eyebrow="Serviços"
        title="Soluções que acompanham o seu negócio."
        description="Cada serviço abaixo pode ser combinado e ajustado conforme a necessidade real da sua empresa."
      />

      <section className="bg-white py-20 sm:py-28">
        <Container className="flex flex-col gap-20">
          {services.map((service, index) => {
            const Icon = service.icon;
            const reversed = index % 2 === 1;

            return (
              <RevealOnScroll key={service.slug}>
                <article
                  id={service.slug}
                  className={`grid grid-cols-1 items-center gap-10 scroll-mt-24 lg:grid-cols-2 lg:gap-16 ${
                    reversed ? "lg:[&>*:first-child]:order-2" : ""
                  }`}
                >
                  <div className="flex flex-col gap-5">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-accent text-white">
                      <Icon size={26} aria-hidden="true" />
                    </div>
                    <h2 className="text-2xl font-bold tracking-tight text-navy-900 sm:text-3xl">
                      {service.title}
                    </h2>
                    <p className="text-base leading-relaxed text-navy-900/60">
                      {service.description}
                    </p>
                    <Button
                      to="/contato"
                      variant="secondary"
                      icon={<ArrowRight size={16} aria-hidden="true" />}
                      className="w-fit"
                    >
                      Solicitar orçamento
                    </Button>
                  </div>

                  <div className="rounded-2xl border border-navy-900/8 bg-slate-50 p-8">
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-blue-600">
                      Benefícios
                    </h3>
                    <ul className="mt-5 flex flex-col gap-4">
                      {service.benefits.map((benefit) => (
                        <li key={benefit} className="flex items-start gap-3">
                          <CheckCircle2
                            size={20}
                            className="mt-0.5 shrink-0 text-blue-600"
                            aria-hidden="true"
                          />
                          <span className="text-sm leading-relaxed text-navy-900/75">
                            {benefit}
                          </span>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-6 rounded-xl bg-white p-5">
                      <p className="text-xs font-semibold uppercase tracking-wider text-navy-900/40">
                        Exemplo de aplicação
                      </p>
                      <p className="mt-2 text-sm leading-relaxed text-navy-900/70">
                        {service.example}
                      </p>
                    </div>
                  </div>
                </article>
              </RevealOnScroll>
            );
          })}
        </Container>
      </section>

      <CTASection
        title="Não encontrou exatamente o que precisa?"
        description="Nossos serviços podem ser combinados. Conte para a gente qual é o seu desafio e vamos propor a melhor solução."
        buttonLabel="Solicitar orçamento"
      />
    </>
  );
}
