// Hero de mazmorra — imagen, info y guías
import { CardBody } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { withBasePath } from "@/lib/utils";
import Image from "next/image";

interface DungeonHeroProps {
  name: string;
  sigla: string;
  type: string;     // "nueva" | "clasica"
  jefes: number;
  zona: string;
  timer: string;
  desc: string;
  img: string;
}

export default function DungeonHero({
  name,
  sigla,
  type,
  jefes,
  zona,
  timer,
  desc,
  img,
}: DungeonHeroProps) {
  const typeColor = type === "nueva" ? "#00c8ff" : "#a78bfa";
  const typeLabel = type === "nueva" ? "Nueva" : "Clásica";
  const imageSrc = withBasePath(img);

  return (
    <div className="relative rounded-lg overflow-hidden border border-horda-border mb-6">
      {/* Imagen de fondo con overlay oscuro */}
      <div className="h-48 md:h-64 bg-horda-surface relative">
        {imageSrc && (
          <Image
            src={imageSrc}
            alt={name}
            fill
            sizes="100vw"
            className="object-cover opacity-40"
          />
        )}
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-horda-bg via-horda-bg/60 to-transparent" />
      </div>

      {/* Info sobre la imagen */}
      <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="font-cinzel text-xl md:text-2xl text-horda-text tracking-wide">
              {name}
            </h2>
            <p className="text-horda-muted text-sm font-exo mt-1">{zona}</p>
          </div>
          <span className="text-2xl md:text-3xl font-bold font-cinzel opacity-30" style={{ color: typeColor }}>
            {sigla}
          </span>
        </div>
      </div>

      {/* Badges en la parte inferior del hero */}
      <div className="px-4 md:px-6 py-3 flex flex-wrap gap-2 bg-horda-surface/80">
        <Badge color={typeColor} variant="outline" size="sm">
          {typeLabel}
        </Badge>
        <Badge color="#F8B700" variant="outline" size="sm">
          {jefes} Jefes
        </Badge>
        <Badge color="#4488ff" variant="outline" size="sm">
          {timer}
        </Badge>
      </div>

      {/* Descripción de la mazmorra */}
      <CardBody>
        <p className="text-horda-text text-sm font-exo leading-relaxed">
          {desc}
        </p>
      </CardBody>
    </div>
  );
}
