import { Link } from "react-router-dom";
import { Mail, MapPin } from "lucide-react";
import { Container } from "./Container";
import { InstagramIcon, LinkedinIcon } from "./SocialIcons";
import { company, whatsappLink, instagramLink } from "../config/company";
import logo from "../assets/logo.png";

const navLinks = [
  { label: "Início", to: "/" },
  { label: "Serviços", to: "/servicos" },
  { label: "Soluções", to: "/solucoes" },
  { label: "Sobre", to: "/sobre" },
  { label: "Contato", to: "/contato" },
];

export function Footer() {
  const year = new Date().getFullYear();
  const hasContactInfo = company.whatsapp || company.email || company.address;
  const hasSocial = company.instagram || company.linkedin;

  return (
    <footer className="border-t border-white/10 bg-navy-950 text-white">
      <Container className="grid grid-cols-1 gap-12 py-16 sm:grid-cols-2 lg:grid-cols-4">
        <div className="flex flex-col gap-4 sm:col-span-2 lg:col-span-1">
          <div className="w-fit rounded-xl bg-white px-4 py-3">
            <img src={logo} alt="Customiza Sistemas" className="h-9 w-auto" />
          </div>
          <p className="max-w-xs text-sm leading-relaxed text-white/60">
            {company.slogan}
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-white/50">
            Navegação
          </h3>
          <nav className="flex flex-col gap-3" aria-label="Links do rodapé">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-sm text-white/70 transition-colors hover:text-cyan-accent"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex flex-col gap-4">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-white/50">
            Fale conosco
          </h3>
          {hasContactInfo ? (
            <ul className="flex flex-col gap-3 text-sm text-white/70">
              {company.whatsapp && (
                <li>
                  <a
                    href={whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-colors hover:text-cyan-accent"
                  >
                    WhatsApp
                  </a>
                </li>
              )}
              {company.email && (
                <li className="flex items-center gap-2">
                  <Mail size={16} className="shrink-0 text-white/40" />
                  <a
                    href={`mailto:${company.email}`}
                    className="transition-colors hover:text-cyan-accent"
                  >
                    {company.email}
                  </a>
                </li>
              )}
              {company.address && (
                <li className="flex items-center gap-2">
                  <MapPin size={16} className="shrink-0 text-white/40" />
                  {company.address}
                </li>
              )}
            </ul>
          ) : (
            <p className="text-sm text-white/40">
              Canais de contato em breve.
            </p>
          )}
        </div>

        <div className="flex flex-col gap-4">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-white/50">
            Redes sociais
          </h3>
          {hasSocial ? (
            <div className="flex gap-3">
              {company.instagram && (
                <a
                  href={instagramLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram da Customiza Sistemas"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 transition-colors hover:border-cyan-accent hover:text-cyan-accent"
                >
                  <InstagramIcon size={18} />
                </a>
              )}
              {company.linkedin && (
                <a
                  href={company.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn da Customiza Sistemas"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 transition-colors hover:border-cyan-accent hover:text-cyan-accent"
                >
                  <LinkedinIcon size={18} />
                </a>
              )}
            </div>
          ) : (
            <p className="text-sm text-white/40">Em breve.</p>
          )}
        </div>
      </Container>

      <div className="border-t border-white/10 py-6">
        <Container className="flex flex-col items-center justify-between gap-2 text-xs text-white/40 sm:flex-row">
          <p>
            © {year} {company.name}. Todos os direitos reservados.
          </p>
          <p>{company.slogan}</p>
        </Container>
      </div>
    </footer>
  );
}
