import { Zap } from "lucide-react";
import screenshotPdv from "../assets/screenshot-pdv.png";

export function HeroScreenshot() {
  return (
    <div className="relative mx-auto w-full max-w-lg lg:mx-0" aria-hidden="true">
      <div
        className="absolute -inset-10 -z-10 rounded-full opacity-60 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(34,193,245,0.35), transparent 70%)",
        }}
      />

      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-navy-900/70 shadow-2xl shadow-black/30 backdrop-blur">
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-3">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-300/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/70" />
          </div>
          <span className="text-xs font-medium text-white/40">frente de caixa</span>
        </div>
        <img
          src={screenshotPdv}
          alt="Tela real de um PDV desenvolvido pela Customiza: carrinho com itens, cliente vinculado e botão de finalizar venda, sem valores visíveis pro operador"
          className="w-full"
          width={1400}
          height={900}
        />
      </div>

      <div className="absolute -right-6 -top-6 flex items-center gap-2.5 rounded-2xl border border-white/10 bg-navy-900/90 px-4 py-3 shadow-xl shadow-black/30 backdrop-blur animate-fade-in">
        <span className="relative flex h-2.5 w-2.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
        </span>
        <div className="flex items-center gap-1.5 text-xs font-medium text-white">
          <Zap size={14} className="text-cyan-accent" />
          Sistema real, em produção
        </div>
      </div>
    </div>
  );
}
