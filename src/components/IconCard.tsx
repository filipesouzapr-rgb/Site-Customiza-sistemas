import type { LucideIcon } from "lucide-react";

interface IconCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

export function IconCard({ icon: Icon, title, description }: IconCardProps) {
  return (
    <div className="flex h-full flex-col gap-4 rounded-2xl border border-navy-900/8 bg-white p-7">
      <Icon size={26} className="text-blue-600" aria-hidden="true" />
      <h3 className="text-base font-semibold text-navy-900">{title}</h3>
      <p className="text-sm leading-relaxed text-navy-900/60">{description}</p>
    </div>
  );
}
