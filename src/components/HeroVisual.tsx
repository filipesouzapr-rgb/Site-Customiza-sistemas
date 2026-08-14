import { Activity, GitBranch, Zap } from "lucide-react";

const bars = [42, 68, 54, 88, 61, 95, 73];

export function HeroVisual() {
  return (
    <div className="relative mx-auto w-full max-w-lg lg:mx-0" aria-hidden="true">
      <div
        className="absolute -inset-10 -z-10 rounded-full opacity-60 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(34,193,245,0.35), transparent 70%)",
        }}
      />

      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-navy-900/70 p-6 shadow-2xl shadow-black/30 backdrop-blur">
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />

        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-300/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/70" />
          </div>
          <span className="text-xs font-medium text-white/40">painel.sistema</span>
        </div>

        <div className="relative mt-6 grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs text-white/50">Processos automatizados</p>
            <p className="mt-2 text-2xl font-bold text-white">
              +64<span className="text-cyan-accent">%</span>
            </p>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs text-white/50">Tempo economizado</p>
            <p className="mt-2 text-2xl font-bold text-white">
              12<span className="text-cyan-accent">h</span>/sem
            </p>
          </div>
        </div>

        <div className="relative mt-3 flex h-28 items-end gap-2 rounded-xl border border-white/10 bg-white/5 p-4">
          {bars.map((height, i) => (
            <div
              key={i}
              className="flex-1 rounded-t-md bg-gradient-to-t from-blue-600 to-cyan-accent"
              style={{ height: `${height}%` }}
            />
          ))}
        </div>
      </div>

      <div className="absolute -right-6 -top-6 flex items-center gap-2.5 rounded-2xl border border-white/10 bg-navy-900/90 px-4 py-3 shadow-xl shadow-black/30 backdrop-blur animate-fade-in">
        <span className="relative flex h-2.5 w-2.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
        </span>
        <div className="flex items-center gap-1.5 text-xs font-medium text-white">
          <Zap size={14} className="text-cyan-accent" />
          Automação ativa
        </div>
      </div>

      <div className="absolute -bottom-6 -left-6 flex items-center gap-2.5 rounded-2xl border border-white/10 bg-white px-4 py-3 shadow-xl shadow-black/10 animate-fade-in">
        <GitBranch size={16} className="text-blue-600" />
        <span className="text-xs font-semibold text-navy-900">Sistemas integrados</span>
      </div>

      <div className="absolute right-8 bottom-10 flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-navy-900/90 text-cyan-accent shadow-xl shadow-black/30 animate-fade-in">
        <Activity size={18} />
      </div>
    </div>
  );
}
