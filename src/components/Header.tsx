import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Container } from "./Container";
import { Button } from "./Button";
import logo from "../assets/logo-header.png";

const navLinks = [
  { label: "Início", to: "/" },
  { label: "Serviços", to: "/servicos" },
  { label: "Soluções", to: "/solucoes" },
  { label: "Sobre nós", to: "/sobre" },
  { label: "Contato", to: "/contato" },
];

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  const linkClasses = ({ isActive }: { isActive: boolean }) =>
    `text-sm font-medium transition-colors hover:text-blue-600 ${
      isActive ? "text-blue-600" : "text-navy-900/80"
    }`;

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled
          ? "bg-white/90 shadow-sm shadow-navy-900/5 backdrop-blur-md"
          : "bg-white/70 backdrop-blur-md"
      }`}
    >
      <Container className="flex h-20 items-center justify-between">
        <Link to="/" className="flex shrink-0 items-center" onClick={() => setIsMenuOpen(false)}>
          <img src={logo} alt="Customiza Sistemas" className="h-8 w-auto sm:h-9 lg:h-10" />
        </Link>

        <nav className="hidden items-center gap-9 lg:flex" aria-label="Navegação principal">
          {navLinks.map((link) => (
            <NavLink key={link.to} to={link.to} className={linkClasses} end={link.to === "/"}>
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden lg:block">
          <Button to="/contato" className="!px-5 !py-2.5">
            Solicitar orçamento
          </Button>
        </div>

        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-lg text-navy-900 lg:hidden"
          aria-label={isMenuOpen ? "Fechar menu" : "Abrir menu"}
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen((v) => !v)}
        >
          {isMenuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </Container>

      {isMenuOpen && (
        <div className="lg:hidden">
          <nav
            className="flex flex-col gap-1 border-t border-navy-900/10 bg-white px-6 py-6"
            aria-label="Navegação móvel"
          >
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === "/"}
                onClick={() => setIsMenuOpen(false)}
                className={({ isActive }) =>
                  `rounded-lg px-3 py-3 text-base font-medium transition-colors ${
                    isActive ? "bg-blue-50 text-blue-600" : "text-navy-900/80 hover:bg-navy-900/5"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
            <Button to="/contato" className="mt-3 w-full" onClick={() => setIsMenuOpen(false)}>
              Solicitar orçamento
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
}
