import { cn } from "@/lib/utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export default function Card({ children, className, hover = true }: CardProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden border border-[rgba(240,195,90,0.28)] rounded-lg",
        "bg-[linear-gradient(180deg,rgba(25,16,13,0.96),rgba(7,5,4,0.96))]",
        "shadow-[0_18px_60px_rgba(0,0,0,0.34)]",
        hover && "transition-all duration-180 hover:-translate-y-0.5 hover:border-gold hover:shadow-[0_22px_46px_rgba(143,21,19,0.35)]",
        className
      )}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("px-5 py-4 border-b border-[rgba(240,195,90,0.2)]", className)}>
      {children}
    </div>
  );
}

export function CardBody({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("p-5", className)}>
      {children}
    </div>
  );
}
