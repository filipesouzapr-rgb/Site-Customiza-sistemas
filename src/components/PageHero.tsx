import type { ReactNode } from "react";
import { Container } from "./Container";
import { GlowBackground } from "./GlowBackground";

interface PageHeroProps {
  eyebrow: string;
  title: string;
  description: string;
  children?: ReactNode;
}

export function PageHero({ eyebrow, title, description, children }: PageHeroProps) {
  return (
    <section className="relative overflow-hidden bg-navy-950 pb-20 pt-20 sm:pb-24 sm:pt-28">
      <GlowBackground positions={["15% 10%", "85% 30%"]} />
      <Container className="relative flex flex-col items-center gap-5 text-center">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-accent">
          {eyebrow}
        </span>
        <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-white sm:text-5xl">
          {title}
        </h1>
        <p className="max-w-2xl text-lg leading-relaxed text-white/70">{description}</p>
        {children}
      </Container>
    </section>
  );
}
