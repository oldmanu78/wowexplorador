import Badge, { RoleBadge, ScoreBadge } from "@/components/ui/Badge";
import { CLASS_COLORS, ROLE_TEXT } from "@/lib/constants";
import { getRioScore, getRioIlvl, safeJsonParse } from "@/lib/utils";
import type { RaiderIoProfile } from "@/lib/wow-types";
import { getClassIconUrl, getRaceIconUrl } from "@/lib/wow-assets";
import WowIcon from "@/components/ui/WowIcon";

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
  const classColor = CLASS_COLORS[className] || "#f0c35a";
  const rio = safeJsonParse<RaiderIoProfile>(rioData);
  const race = rio?.race || "";
  const classIcon = getClassIconUrl(className);
  const raceIcon = getRaceIconUrl(race);

  return (
    <div
      className="relative overflow-hidden rounded-lg border border-[rgba(240,195,90,0.28)] mb-6"
      style={{
        background: `linear-gradient(135deg, ${classColor}22 0%, #070504 60%)`,
      }}
    >
      <div className="p-6 md:p-8 flex flex-col md:flex-row items-center gap-6">
        <WowIcon
          src={classIcon}
          alt={`${className} icon`}
          color={classColor}
          fallback={name.charAt(0)}
          className="h-20 w-20 rounded-lg md:h-24 md:w-24"
        />

        <div className="text-center md:text-left flex-1">
          <h1 className="text-2xl md:text-3xl font-cinzel tracking-wide" style={{ color: classColor }}>
            {name}
          </h1>

          <p className="text-bone text-sm md:text-base font-inter mt-1">
            {spec} · {ROLE_TEXT[role] || role}
          </p>

          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mt-3">
            <Badge color={classColor} variant="filled">
              {className}
            </Badge>
            {race && (
              <Badge color="#c49445" variant="outline" className="pl-1">
                <WowIcon
                  src={raceIcon}
                  alt={`${race} icon`}
                  color="#c49445"
                  fallback={race.charAt(0)}
                  className="mr-0.5 h-5 w-5 rounded-sm border"
                />
                {race}
              </Badge>
            )}
            <RoleBadge role={role} />
            <ScoreBadge score={score} />
          </div>

          {ilvl > 0 && (
            <p className="text-muted text-sm mt-2 font-inter">
              Item Level: <span className="text-bone font-bold">{ilvl}</span>
            </p>
          )}
        </div>

        <div className="flex gap-2 shrink-0">
          <a
            href={`https://raider.io/characters/us/quelthalas/${slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 text-xs font-inter font-bold rounded border border-gold text-gold hover:bg-gold hover:text-[#180c07] transition-colors uppercase tracking-wide"
          >
            Raider.io
          </a>
          <a
            href={`https://worldofwarcraft.blizzard.com/en-us/character/us/quelthalas/${slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 text-xs font-inter font-bold rounded border border-[rgba(240,195,90,0.2)] text-muted hover:text-gold hover:border-gold transition-colors uppercase tracking-wide"
          >
            Armory
          </a>
        </div>
      </div>
    </div>
  );
}
