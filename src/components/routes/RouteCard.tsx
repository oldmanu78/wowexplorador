// Card de ruta individual para una mazmorra
// Muestra thumbnail, nombre, tipo (pug/high) y descripción
import Card, { CardBody } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { withBasePath } from "@/lib/utils";
import Image from "next/image";

interface RouteCardProps {
  name: string;
  url: string;
  type: string;     // "pug" | "high"
  desc: string;
  thumb: string | null;
}

export default function RouteCard({ name, url, type, desc, thumb }: RouteCardProps) {
  // Color según tipo de ruta
  const typeColor = type === "high" ? "#f97316" : "#4ade80";
  const typeLabel = type === "high" ? "High Key" : "PUG";
  const thumbSrc = withBasePath(thumb);

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block h-full"
    >
      <Card className="h-full overflow-hidden bg-[linear-gradient(135deg,rgba(32,21,16,0.96),rgba(12,9,8,0.98))]">
        <CardBody className="flex h-full flex-col">
          {/* Thumbnail o placeholder */}
          <div className="relative mb-4 flex aspect-[16/9] w-full items-center justify-center overflow-hidden rounded border border-horda-border bg-horda-bg">
            {thumbSrc ? (
              <Image
                src={thumbSrc}
                alt={name}
                fill
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
              />
            ) : (
              <span
                className="inline-flex h-12 w-12 items-center justify-center rounded border border-horda-border bg-black/20 text-xs font-bold tracking-[0.18em] text-horda-gold"
                aria-label="Ruta sin imagen"
              >
                MAP
              </span>
            )}
          </div>

          {/* Nombre de la ruta */}
          <h4 className="mb-2 min-h-10 font-cinzel text-sm leading-5 text-horda-text tracking-wide">
            {name}
          </h4>

          {/* Badge de tipo */}
          <div>
            <Badge color={typeColor} variant="filled" size="sm">
              {typeLabel}
            </Badge>
          </div>

          {/* Descripción */}
          <p className="mt-3 min-h-10 text-xs leading-5 text-horda-muted font-exo">
            {desc}
          </p>
        </CardBody>
      </Card>
    </a>
  );
}
