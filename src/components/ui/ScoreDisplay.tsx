// Display de score M+ con color por rango
// Muestra el score numérico con el color correspondiente a su rango
import { cn } from "@/lib/utils";

interface ScoreDisplayProps {
  score: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export default function ScoreDisplay({ score, size = "md", className }: ScoreDisplayProps) {
  // Determina el color según el rango del score
  const color =
    score >= 3000 ? "#ff8000" :
    score >= 2000 ? "#a335ee" :
    score >= 1500 ? "#0070dd" :
    score >= 1000 ? "#1eff00" :
    "#ffffff";

  // Tamaños de texto según prop size
  const textSize = size === "lg" ? "text-3xl" : size === "md" ? "text-xl" : "text-sm";

  return (
    <span
      className={cn("font-bold font-exo", textSize, className)}
      style={{ color }}
    >
      {score.toLocaleString("es-CL")}
    </span>
  );
}
