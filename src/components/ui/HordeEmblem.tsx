import { cn, withBasePath } from "@/lib/utils";

interface HordeEmblemProps {
  className?: string;
  label?: string;
}

export default function HordeEmblem({ className, label = "Emblema de la Horda" }: HordeEmblemProps) {
  const maskUrl = `url("${withBasePath("/images/horde-emblem-mask.png")}")`;

  return (
    <span
      role={label ? "img" : undefined}
      aria-label={label || undefined}
      aria-hidden={label ? undefined : true}
      className={cn(
        "inline-block shrink-0 bg-[linear-gradient(155deg,#f0c35a_0%,#c32620_34%,#8f1513_68%,#350706_100%)]",
        "drop-shadow-[0_0_14px_rgba(195,38,32,0.55)]",
        className
      )}
      style={{
        WebkitMaskImage: maskUrl,
        maskImage: maskUrl,
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
        WebkitMaskSize: "contain",
        maskSize: "contain",
        WebkitMaskPosition: "center",
        maskPosition: "center",
      }}
    />
  );
}
