import { cn, getScoreColor } from "@/lib/utils";
import { ROLE_COLORS, ROLE_TEXT } from "@/lib/constants";

interface BadgeProps {
  children: React.ReactNode;
  color?: string;
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
    "inline-flex items-center gap-1.5 font-inter font-bold rounded",
    size === "sm" ? "px-2.5 py-0.5 text-[0.72rem]" : "px-3 py-1 text-sm"
  );

  if (variant === "dot") {
    return (
      <span className={cn("inline-flex items-center gap-2", className)}>
        <span
          className="w-2.5 h-2.5 rounded-full inline-block"
          style={{ backgroundColor: color || "#f0c35a" }}
        />
        <span className="text-bone text-sm">{children}</span>
      </span>
    );
  }

  if (variant === "outline") {
    return (
      <span
        className={cn(baseStyle, "border", className)}
        style={{
          borderColor: color || "#f0c35a",
          color: color || "#f0c35a",
        }}
      >
        {children}
      </span>
    );
  }

  return (
    <span
      className={cn(baseStyle, "text-[#180c07]", className)}
      style={{
        backgroundColor: color || "#f0c35a",
      }}
    >
      {children}
    </span>
  );
}

export function ScoreBadge({ score, size }: { score: number; size?: "sm" | "md" }) {
  return (
    <Badge color={getScoreColor(score)} variant="filled" size={size}>
      {score.toLocaleString("es-CL")}
    </Badge>
  );
}

export function RoleBadge({ role, size }: { role: string; size?: "sm" | "md" }) {
  return (
    <Badge color={ROLE_COLORS[role] || ROLE_COLORS.DPS} variant="filled" size={size}>
      {ROLE_TEXT[role] || role}
    </Badge>
  );
}
