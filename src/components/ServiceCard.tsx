import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import type { Service } from "../data/services";

interface ServiceCardProps {
  service: Service;
}

export function ServiceCard({ service }: ServiceCardProps) {
  const Icon = service.icon;

  return (
    <div className="group flex h-full flex-col gap-5 rounded-2xl border border-navy-900/8 bg-white p-7 shadow-sm shadow-navy-900/5 transition-all duration-300 hover:-translate-y-1 hover:border-blue-600/20 hover:shadow-xl hover:shadow-blue-900/10">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-cyan-accent text-white">
        <Icon size={24} aria-hidden="true" />
      </div>
      <div className="flex flex-1 flex-col gap-2">
        <h3 className="text-lg font-semibold text-navy-900">{service.title}</h3>
        <p className="text-sm leading-relaxed text-navy-900/60">
          {service.shortDescription}
        </p>
      </div>
      <Link
        to="/contato"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 transition-colors group-hover:gap-2.5 hover:text-blue-700"
      >
        Solicitar orçamento
        <ArrowRight size={16} aria-hidden="true" />
      </Link>
    </div>
  );
}
