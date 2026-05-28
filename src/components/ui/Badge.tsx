// Componente Badge para etiquetas de clase, rol, score y tipo
// Usado en tarjetas de personaje, rutas, y elementos de lista
import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  color?: string; // Color de fondo/borde en hex (ej: "#C41E3A")
  variant?: "filled" | "outline" | "dot";
  size?: "sm" | "md";
  className?: string;
}

export default function Badge({
  children,
  color,
  variant = "filled",
  size = "sm",
  className,
}: BadgeProps) {
  const baseStyle = cn(
    "inline-flex items-center gap-1 font-exo font-medium rounded",
    size === "sm" ? "px-2 py-0.5 text-xs" : "px-3 py-1 text-sm"
  );

  if (variant === "dot") {
    return (
      <span className={cn("inline-flex items-center gap-1.5", className)}>
        <span
          className="w-2.5 h-2.5 rounded-full inline-block"
          style={{ backgroundColor: color || "#F8B700" }}
        />
        <span className="text-horda-text text-sm">{children}</span>
      </span>
    );
  }

  if (variant === "outline") {
    return (
      <span
        className={cn(baseStyle, "border", className)}
        style={{
          borderColor: color || "#F8B700",
          color: color || "#F8B700",
        }}
      >
        {children}
      </span>
    );
  }

  // Filled variant
  return (
    <span
      className={cn(baseStyle, "text-white", className)}
      style={{
        backgroundColor: color || "#F8B700",
      }}
    >
      {children}
    </span>
  );
}

// Badge específico para score M+ (color automático según el rango)
export function ScoreBadge({ score, size }: { score: number; size?: "sm" | "md" }) {
  const color =
    score >= 3000 ? "#ff8000" :
    score >= 2000 ? "#a335ee" :
    score >= 1500 ? "#0070dd" :
    score >= 1000 ? "#1eff00" :
    "#ffffff";

  return (
    <Badge color={color} variant="filled" size={size}>
      {score.toLocaleString("es-CL")}
    </Badge>
  );
}

// Badge de rol (TANK/HEALER/DPS)
export function RoleBadge({ role, size }: { role: string; size?: "sm" | "md" }) {
  const color =
    role === "TANK" ? "#4488ff" :
    role === "HEALER" ? "#44cc88" :
    "#ff4444";

  const label =
    role === "TANK" ? "🛡️ Tanque" :
    role === "HEALER" ? "💚 Sanador" :
    "⚔️ DPS";

  return (
    <Badge color={color} variant="filled" size={size}>
      {label}
    </Badge>
  );
}
