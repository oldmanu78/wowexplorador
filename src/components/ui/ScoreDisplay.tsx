// Display de score M+ con color por rango
// Muestra el score numérico con el color correspondiente a su rango
import { cn, getScoreColor } from "@/lib/utils";

interface ScoreDisplayProps {
  score: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export default function ScoreDisplay({ score, size = "md", className }: ScoreDisplayProps) {
  // Tamaños de texto según prop size
  const textSize = size === "lg" ? "text-3xl" : size === "md" ? "text-xl" : "text-sm";

  return (
    <span
      className={cn("font-bold font-exo", textSize, className)}
      style={{ color: getScoreColor(score) }}
    >
      {score.toLocaleString("es-CL")}
    </span>
  );
}
