import { Mail, MapPin, MessageCircle, Clock } from "lucide-react";
import { Seo } from "../components/Seo";
import { Container } from "../components/Container";
import { PageHero } from "../components/PageHero";
import { ContactForm } from "../components/ContactForm";
import { RevealOnScroll } from "../components/RevealOnScroll";
import { company, whatsappLink } from "../config/company";
import { pagesSeo } from "../data/pagesSeo";

export function Contato() {
  const hasContactInfo = company.whatsapp || company.email || company.address;

  return (
    <>
      <Seo {...pagesSeo.contato} />

      <PageHero
        eyebrow="Contato"
        title="Vamos transformar sua ideia em uma solução?"
        description="Preencha o formulário abaixo com os detalhes do que você precisa. Retornaremos o contato o quanto antes."
      />

      <section className="bg-white py-20 sm:py-28">
        <Container className="grid grid-cols-1 gap-12 lg:grid-cols-5 lg:gap-16">
          <RevealOnScroll className="lg:col-span-3">
            <ContactForm />
          </RevealOnScroll>

          <RevealOnScroll delay={120} className="lg:col-span-2">
            <div className="flex flex-col gap-6 rounded-2xl border border-navy-900/8 bg-slate-50 p-8">
              <h2 className="text-lg font-semibold text-navy-900">
                Outros canais de contato
              </h2>

              {hasContactInfo ? (
                <ul className="flex flex-col gap-5">
                  {company.whatsapp && (
                    <li className="flex items-start gap-3">
                      <MessageCircle size={20} className="mt-0.5 shrink-0 text-blue-600" aria-hidden="true" />
                      <div>
                        <p className="text-sm font-medium text-navy-900">WhatsApp</p>
                        <a
                          href={whatsappLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-navy-900/60 hover:text-blue-600"
                        >
                          Conversar agora
                        </a>
                      </div>
                    </li>
                  )}
                  {company.email && (
                    <li className="flex items-start gap-3">
                      <Mail size={20} className="mt-0.5 shrink-0 text-blue-600" aria-hidden="true" />
                      <div>
                        <p className="text-sm font-medium text-navy-900">E-mail</p>
                        <a
                          href={`mailto:${company.email}`}
                          className="text-sm text-navy-900/60 hover:text-blue-600"
                        >
                          {company.email}
                        </a>
                      </div>
                    </li>
                  )}
                  {company.address && (
                    <li className="flex items-start gap-3">
                      <MapPin size={20} className="mt-0.5 shrink-0 text-blue-600" aria-hidden="true" />
                      <div>
                        <p className="text-sm font-medium text-navy-900">Endereço</p>
                        <p className="text-sm text-navy-900/60">{company.address}</p>
                      </div>
                    </li>
                  )}
                </ul>
              ) : (
                <p className="text-sm leading-relaxed text-navy-900/50">
                  Nossos canais diretos de atendimento serão disponibilizados em
                  breve. Por enquanto, utilize o formulário ao lado.
                </p>
              )}

              <div className="flex items-start gap-3 border-t border-navy-900/8 pt-5">
                <Clock size={20} className="mt-0.5 shrink-0 text-blue-600" aria-hidden="true" />
                <div>
                  <p className="text-sm font-medium text-navy-900">Tempo de resposta</p>
                  <p className="text-sm text-navy-900/60">
                    Retornamos todas as solicitações o mais breve possível.
                  </p>
                </div>
              </div>
            </div>
          </RevealOnScroll>
        </Container>
      </section>
    </>
  );
}
