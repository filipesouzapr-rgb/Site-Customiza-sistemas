import { statusOptions, statusStyles } from "../lib/statusChamado";

interface StatusSelectProps {
  id: string;
  label: string;
  value: string;
  disabled?: boolean;
  onChange: (value: string) => void;
}

export function StatusSelect({ id, label, value, disabled, onChange }: StatusSelectProps) {
  return (
    <>
      <label className="sr-only" htmlFor={id}>
        {label}
      </label>
      <select
        id={id}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        className={`rounded-full border-0 px-3 py-1.5 text-xs font-semibold capitalize transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600/30 disabled:opacity-50 ${
          statusStyles[value] ?? "bg-navy-900/8 text-navy-900/60"
        }`}
      >
        {statusOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </>
  );
}
