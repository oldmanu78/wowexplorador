// Card de ruta individual para una mazmorra
// Muestra thumbnail, nombre, tipo (pug/high) y descripción
import Card, { CardBody } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

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

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="block"
    >
      <Card className="h-full">
        <CardBody>
          {/* Thumbnail o placeholder */}
          <div className="w-full h-28 bg-horda-bg rounded border border-horda-border mb-3 overflow-hidden flex items-center justify-center">
            {thumb ? (
              <img
                src={thumb}
                alt={name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                  // Muestra icono fallback
                  const parent = (e.target as HTMLElement).parentElement;
                  if (parent) {
                    parent.innerHTML = '<span class="text-3xl">🗺️</span>';
                  }
                }}
              />
            ) : (
              <span className="text-3xl">🗺️</span>
            )}
          </div>

          {/* Nombre de la ruta */}
          <h4 className="font-cinzel text-sm text-horda-text tracking-wide mb-1 truncate">
            {name}
          </h4>

          {/* Badge de tipo */}
          <Badge color={typeColor} variant="filled" size="sm">
            {typeLabel}
          </Badge>

          {/* Descripción */}
          <p className="text-horda-muted text-xs font-exo mt-2 line-clamp-2">
            {desc}
          </p>
        </CardBody>
      </Card>
    </a>
  );
}
