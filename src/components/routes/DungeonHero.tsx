import Badge from "@/components/ui/Badge";
import { withBasePath } from "@/lib/utils";
import Image from "next/image";

interface DungeonHeroProps {
  name: string;
  sigla: string;
  type: string;
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
}: DungeonHeroProps) {
  const typeColor = type === "nueva" ? "#00c8ff" : "#a78bfa";
  const typeLabel = type === "nueva" ? "Nueva" : "Clasica";
  const imageSrc = withBasePath("/images/orgrimmar-valley-bg.svg");

  return (
    <section className="mb-6 overflow-hidden rounded-lg border border-[rgba(240,195,90,0.28)] bg-surface-strong shadow-[0_24px_80px_rgba(0,0,0,0.55)]">
      <div className="grid gap-0 lg:grid-cols-[minmax(0,1.25fr)_minmax(340px,0.75fr)]">
        <div className="relative min-h-56 overflow-hidden bg-bg lg:min-h-[320px]">
          <Image
            src={imageSrc}
            alt={`Ambiente visual para ${name}`}
            fill
            sizes="(min-width: 1024px) 60vw, 100vw"
            className="object-cover opacity-75"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-black/10 to-bg/82" />
          <div className="absolute bottom-4 left-4 rounded border border-[rgba(240,195,90,0.2)] bg-black/45 px-3 py-2 backdrop-blur-sm">
            <span className="font-cinzel text-3xl font-bold tracking-[0.18em]" style={{ color: typeColor }}>
              {sigla}
            </span>
          </div>
        </div>

        <div className="flex min-w-0 flex-col justify-between">
          <div className="p-5 md:p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="mb-2 text-xs uppercase tracking-[0.22em] text-muted font-inter font-bold">
                  {zona}
                </p>
                <h2 className="font-cinzel text-xl md:text-2xl text-bone tracking-[0.1em]">
                  {name}
                </h2>
              </div>
              <Badge color={typeColor} variant="outline" size="sm">
                {typeLabel}
              </Badge>
            </div>

            <p className="mt-4 text-sm leading-relaxed text-bone">
              {desc}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 border-t border-[rgba(240,195,90,0.16)] bg-[rgba(7,5,4,0.52)] p-4 md:grid-cols-3">
            <Badge color="#f0c35a" variant="outline" size="sm">
              {jefes} Jefes
            </Badge>
            <Badge color="#4488ff" variant="outline" size="sm">
              {timer}
            </Badge>
            <Badge color={typeColor} variant="outline" size="sm">
              {typeLabel}
            </Badge>
          </div>
        </div>
      </div>
    </section>
  );
}
