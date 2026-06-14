import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number;
  max: number;
  label?: string;
  color?: string;
  height?: "sm" | "md";
  showPercentage?: boolean;
  className?: string;
}

export default function ProgressBar({
  value,
  max,
  label,
  color = "bg-gold",
  height = "sm",
  showPercentage = true,
  className,
}: ProgressBarProps) {
  const percentage = max > 0 ? Math.min((value / max) * 100, 100) : 0;

  return (
    <div className={cn("space-y-1.5", className)}>
      {(label || showPercentage) && (
        <div className="flex justify-between text-xs text-muted font-extrabold tracking-[0.08em] uppercase">
          {label && <span>{label}</span>}
          {showPercentage && (
            <span>
              {value}/{max} ({Math.round(percentage)}%)
            </span>
          )}
        </div>
      )}

      <div
        className={cn(
          "w-full rounded-full overflow-hidden bg-[rgba(240,195,90,0.12)]",
          height === "sm" ? "h-2.5" : "h-3"
        )}
      >
        <div
          className={cn("h-full rounded-full transition-all duration-500 shadow-[0_0_18px_rgba(240,90,40,0.65)]", color)}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
