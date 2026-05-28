// Componente Card base con estilo Horda
// Borde superior rojo, hover gold, sombras sutiles
import { cn } from "@/lib/utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean; // Si true, muestra efecto hover con borde gold
}

export default function Card({ children, className, hover = true }: CardProps) {
  return (
    <div
      className={cn(
        "bg-horda-surface border border-horda-border rounded-lg",
        "border-t-2 border-t-horda-red",
        hover && "hover:border-t-horda-gold hover:shadow-lg hover:shadow-horda-red/5 transition-all duration-300",
        className
      )}
    >
      {children}
    </div>
  );
}

// Card header con título opcional
export function CardHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("px-4 py-3 border-b border-horda-border", className)}>
      {children}
    </div>
  );
}

// Card body con padding
export function CardBody({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("p-4", className)}>
      {children}
    </div>
  );
}
