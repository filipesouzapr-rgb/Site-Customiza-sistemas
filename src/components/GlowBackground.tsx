interface GlowBackgroundProps {
  positions?: [string, string];
}

export function GlowBackground({ positions = ["15% 10%", "85% 30%"] }: GlowBackgroundProps) {
  return (
    <div
      className="pointer-events-none absolute inset-0 opacity-40"
      style={{
        backgroundImage: `radial-gradient(circle at ${positions[0]}, rgba(34,193,245,0.25), transparent 45%), radial-gradient(circle at ${positions[1]}, rgba(37,99,235,0.3), transparent 45%)`,
      }}
      aria-hidden="true"
    />
  );
}
