import { ArrowRight } from "lucide-react";
import { Container } from "./Container";
import { Button } from "./Button";
import { RevealOnScroll } from "./RevealOnScroll";
import { GlowBackground } from "./GlowBackground";

interface CTASectionProps {
  title?: string;
  description?: string;
  buttonLabel?: string;
}

export function CTASection({
  title = "Tem um processo que poderia ser melhor?",
  description = "Conte para a Customiza o que sua empresa precisa. Nós transformamos sua necessidade em uma solução digital.",
  buttonLabel = "Vamos conversar",
}: CTASectionProps) {
  return (
    <section className="relative overflow-hidden bg-navy-950 py-20 sm:py-24">
      <GlowBackground positions={["20% 20%", "80% 80%"]} />
      <Container className="relative flex flex-col items-center gap-6 text-center">
        <RevealOnScroll className="flex flex-col items-center gap-6">
          <h2 className="max-w-2xl text-3xl font-bold tracking-tight text-white sm:text-4xl">
            {title}
          </h2>
          <p className="max-w-xl text-lg text-white/70">{description}</p>
          <Button to="/contato" icon={<ArrowRight size={18} aria-hidden="true" />}>
            {buttonLabel}
          </Button>
        </RevealOnScroll>
      </Container>
    </section>
  );
}
