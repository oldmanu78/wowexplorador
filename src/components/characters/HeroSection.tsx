// Hero section de la página de personaje
// Muestra nombre, clase, spec, rol, score M+, ilvl y links externos
import Badge, { RoleBadge, ScoreBadge } from "@/components/ui/Badge";
import { CLASS_COLORS, ROLE_EMOJI } from "@/lib/constants";
import { getRioScore, getRioIlvl } from "@/lib/utils";

interface HeroSectionProps {
  name: string;
  className: string;
  spec: string;
  role: string;
  rioData: string | null;
  slug: string;
}

export default function HeroSection({
  name,
  className,
  spec,
  role,
  rioData,
  slug,
}: HeroSectionProps) {
  const score = getRioScore(rioData);
  const ilvl = getRioIlvl(rioData);
  const classColor = CLASS_COLORS[className] || "#F8B700";

  return (
    <div
      className="relative overflow-hidden rounded-lg border border-horda-border mb-6"
      style={{
        background: `linear-gradient(135deg, ${classColor}22 0%, #0a0a0a 60%)`,
      }}
    >
      <div className="p-6 md:p-8 flex flex-col md:flex-row items-center gap-6">
        {/* Avatar circular con inicial */}
        <div
          className="w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center text-3xl md:text-4xl font-bold font-cinzel border-2 shrink-0"
          style={{
            backgroundColor: `${classColor}33`,
            borderColor: classColor,
            color: classColor,
          }}
        >
          {name.charAt(0)}
        </div>

        {/* Info del personaje */}
        <div className="text-center md:text-left flex-1">
          {/* Nombre */}
          <h1 className="text-2xl md:text-3xl font-cinzel tracking-wide" style={{ color: classColor }}>
            {name}
          </h1>

          {/* Spec + Clase */}
          <p className="text-horda-text text-sm md:text-base font-exo mt-1">
            {spec} {ROLE_EMOJI[role] || ""}
          </p>

          {/* Badges */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mt-3">
            <Badge color={classColor} variant="filled">
              {className}
            </Badge>
            <RoleBadge role={role} />
            <ScoreBadge score={score} />
          </div>

          {/* Item Level */}
          {ilvl > 0 && (
            <p className="text-horda-muted text-sm mt-2 font-exo">
              Item Level: <span className="text-horda-text font-bold">{ilvl}</span>
            </p>
          )}
        </div>

        {/* Links externos (Raider.io y Armory) */}
        <div className="flex gap-2 shrink-0">
          <a
            href={`https://raider.io/characters/us/quelthalas/${slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 text-xs font-exo rounded border border-horda-gold text-horda-gold hover:bg-horda-gold hover:text-black transition-colors"
          >
            Raider.io
          </a>
          <a
            href={`https://worldofwarcraft.blizzard.com/en-us/character/us/quelthalas/${slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 text-xs font-exo rounded border border-horda-border text-horda-muted hover:text-horda-gold hover:border-horda-gold transition-colors"
          >
            Armory
          </a>
        </div>
      </div>
    </div>
  );
}
