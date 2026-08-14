import type { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  variant?: "light" | "dark";
}

const variantClasses = {
  light: {
    card: "border-navy-900/8 bg-white",
    iconBox: "bg-blue-50 text-blue-600",
    title: "text-navy-900",
    description: "text-navy-900/60",
  },
  dark: {
    card: "border-white/10 bg-white/5",
    iconBox: "bg-cyan-accent/15 text-cyan-accent",
    title: "text-white",
    description: "text-white/60",
  },
} as const;

export function FeatureCard({ icon: Icon, title, description, variant = "light" }: FeatureCardProps) {
  const styles = variantClasses[variant];

  return (
    <div className={`flex h-full flex-col gap-4 rounded-2xl border p-7 ${styles.card}`}>
      <div className={`flex h-11 w-11 items-center justify-center rounded-lg ${styles.iconBox}`}>
        <Icon size={22} aria-hidden="true" />
      </div>
      <h3 className={`text-base font-semibold ${styles.title}`}>{title}</h3>
      <p className={`text-sm leading-relaxed ${styles.description}`}>{description}</p>
    </div>
  );
}
