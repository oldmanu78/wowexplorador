// Barra de progreso reutilizable para raid progress, crests, etc.
import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number;       // Valor actual
  max: number;         // Valor máximo
  label?: string;      // Texto descriptivo
  color?: string;      // Color de la barra (clase Tailwind o hex)
  height?: "sm" | "md";
  showPercentage?: boolean;
  className?: string;
}

export default function ProgressBar({
  value,
  max,
  label,
  color = "bg-horda-gold",
  height = "sm",
  showPercentage = true,
  className,
}: ProgressBarProps) {
  // Calcula el porcentaje de progreso, limitado a 100%
  const percentage = max > 0 ? Math.min((value / max) * 100, 100) : 0;

  return (
    <div className={cn("space-y-1", className)}>
      {/* Label con valores */}
      {(label || showPercentage) && (
        <div className="flex justify-between text-xs text-horda-muted">
          {label && <span>{label}</span>}
          {showPercentage && (
            <span>
              {value}/{max} ({Math.round(percentage)}%)
            </span>
          )}
        </div>
      )}

      {/* Contenedor de la barra */}
      <div
        className={cn(
          "w-full bg-horda-bg rounded-full overflow-hidden border border-horda-border",
          height === "sm" ? "h-2" : "h-3"
        )}
      >
        {/* Relleno de la barra */}
        <div
          className={cn("h-full rounded-full transition-all duration-500", color)}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
