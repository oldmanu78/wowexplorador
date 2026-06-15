import { cn } from "@/lib/utils";
import Image from "next/image";

interface WowIconProps {
  src: string | null;
  alt: string;
  color?: string;
  fallback: string;
  className?: string;
}

export default function WowIcon({ src, alt, color = "#f0c35a", fallback, className }: WowIconProps) {
  return (
    <span
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded border bg-bg text-sm font-bold font-cinzel",
        className
      )}
      style={{
        borderColor: color,
        color,
        boxShadow: `inset 0 0 18px rgba(0,0,0,0.55), 0 0 12px ${color}33`,
      }}
    >
      {src ? (
        <Image
          src={src}
          alt={alt}
          loading="lazy"
          width={64}
          height={64}
          className="h-full w-full object-cover"
        />
      ) : (
        <span aria-hidden="true">{fallback}</span>
      )}
    </span>
  );
}
