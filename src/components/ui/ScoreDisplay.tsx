import { cn, getScoreColor } from "@/lib/utils";

interface ScoreDisplayProps {
  score: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export default function ScoreDisplay({ score, size = "md", className }: ScoreDisplayProps) {
  const textSize = size === "lg" ? "text-3xl" : size === "md" ? "text-xl" : "text-sm";

  return (
    <span
      className={cn("font-bold font-inter", textSize, className)}
      style={{ color: getScoreColor(score) }}
    >
      {score.toLocaleString("es-CL")}
    </span>
  );
}
