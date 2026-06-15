import Link from "next/link";
import Card, { CardBody } from "@/components/ui/Card";
import Badge, { RoleBadge, ScoreBadge } from "@/components/ui/Badge";
import { CLASS_COLORS } from "@/lib/constants";
import { getRioScore, getRioIlvl, safeJsonParse } from "@/lib/utils";
import type { RaiderIoProfile } from "@/lib/wow-types";
import { getClassIconUrl, getRaceIconUrl } from "@/lib/wow-assets";
import WowIcon from "@/components/ui/WowIcon";

interface CharacterCardProps {
  slug: string;
  name: string;
  className: string;
  spec: string;
  role: string;
  rioData: string | null;
}

export default function CharacterCard({
  slug,
  name,
  className,
  spec,
  role,
  rioData,
}: CharacterCardProps) {
  const score = getRioScore(rioData);
  const ilvl = getRioIlvl(rioData);
  const classColor = CLASS_COLORS[className] || "#f0c35a";

  const rio = safeJsonParse<RaiderIoProfile>(rioData);
  const race = rio?.race || "";
  const classIcon = getClassIconUrl(className);
  const raceIcon = getRaceIconUrl(race);
  const raidProg = rio?.raid_progression?.["tier-mn-1"];
  const mythicBosses = raidProg?.mythic_bosses_killed || 0;
  const totalBosses = raidProg?.total_bosses || 9;

  return (
    <Link href={`/personajes/${slug}`} className="group block h-full">
      <Card className="relative h-full overflow-hidden">
        <div
          className="absolute inset-x-0 top-0 h-1 opacity-90"
          style={{ background: `linear-gradient(90deg, transparent, ${classColor}, transparent)` }}
        />
        <div
          className="absolute inset-0 opacity-60 transition-opacity group-hover:opacity-100"
          style={{
            background: `radial-gradient(circle at top left, ${classColor}15, transparent 36%), linear-gradient(180deg, rgba(255,255,255,0.035), transparent 42%)`,
          }}
        />
        <CardBody className="relative">
          <div className="flex items-center gap-4 mb-4">
            <WowIcon
              src={classIcon}
              alt={`${className} icon`}
              color={classColor}
              fallback={name.charAt(0)}
              className="h-16 w-16 transition-transform group-hover:scale-[1.03]"
            />
            <div className="min-w-0">
              <h3 className="font-cinzel text-base tracking-[0.08em] truncate" style={{ color: classColor }}>
                {name}
              </h3>
              <p className="text-muted text-xs font-inter truncate uppercase tracking-[0.12em]">{spec}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5 mb-3">
            <Badge color={classColor} variant="filled" size="sm">
              {className}
            </Badge>
            {race && (
              <Badge color="#c49445" variant="outline" size="sm" className="pl-1">
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
            <RoleBadge role={role} size="sm" />
            <ScoreBadge score={score} size="sm" />
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs text-muted font-inter pt-3 border-t border-[rgba(240,195,90,0.2)]">
            <span className="rounded border border-[rgba(240,195,90,0.2)] bg-[rgba(7,5,4,0.52)] px-2 py-2">
              <span className="block text-[10px] uppercase tracking-[0.16em]">ILvl</span>
              <span className="text-bone font-semibold">{ilvl > 0 ? ilvl : "—"}</span>
            </span>
            <span className="rounded border border-[rgba(240,195,90,0.2)] bg-[rgba(7,5,4,0.52)] px-2 py-2 text-right">
              <span className="block text-[10px] uppercase tracking-[0.16em]">Mitico</span>
              <span className="text-gold font-semibold">{mythicBosses}/{totalBosses}</span>
            </span>
          </div>
        </CardBody>
      </Card>
    </Link>
  );
}
