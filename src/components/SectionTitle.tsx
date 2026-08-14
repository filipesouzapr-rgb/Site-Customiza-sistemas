interface SectionTitleProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "center" | "left";
  as?: "h1" | "h2";
  light?: boolean;
}

export function SectionTitle({
  eyebrow,
  title,
  subtitle,
  align = "center",
  as = "h2",
  light = false,
}: SectionTitleProps) {
  const Heading = as;
  const alignClasses = align === "center" ? "text-center items-center mx-auto" : "text-left items-start";

  return (
    <div className={`flex max-w-2xl flex-col gap-4 ${alignClasses}`}>
      {eyebrow && (
        <span
          className={`text-xs font-semibold uppercase tracking-[0.2em] ${
            light ? "text-cyan-accent" : "text-blue-600"
          }`}
        >
          {eyebrow}
        </span>
      )}
      <Heading
        className={`text-3xl font-bold tracking-tight sm:text-4xl ${
          light ? "text-white" : "text-navy-900"
        }`}
      >
        {title}
      </Heading>
      {subtitle && (
        <p className={`text-lg leading-relaxed ${light ? "text-white/70" : "text-navy-900/60"}`}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
