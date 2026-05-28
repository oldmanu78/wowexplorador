// Card para la galería de personajes (/personajes)
// Muestra nombre, clase (con color), spec, score M+, ilvl y raid progress
import Link from "next/link";
import Card, { CardBody } from "@/components/ui/Card";
import Badge, { RoleBadge, ScoreBadge } from "@/components/ui/Badge";
import { CLASS_COLORS } from "@/lib/constants";
import { getRioScore, getRioIlvl, safeJsonParse } from "@/lib/utils";
import type { RaiderIoProfile } from "@/lib/wow-types";

interface CharacterCardProps {
  slug: string;        // URL slug
  name: string;        // Nombre en WoW
  className: string;   // Clase (Death Knight, Monk, etc.)
  spec: string;        // Especialización
  role: string;        // TANK|HEALER|DPS
  rioData: string | null; // JSON de Raider.io
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
  const classColor = CLASS_COLORS[className] || "#F8B700";

  // Progreso de raid desde Raider.io
  const rio = safeJsonParse<RaiderIoProfile>(rioData);
  const raidProg = rio?.raid_progression?.["tier-mn-1"];
  const mythicBosses = raidProg?.mythic_bosses_killed || 0;
  const totalBosses = raidProg?.total_bosses || 9;

  return (
    <Link href={`/personajes/${slug}`}>
      <Card className="h-full">
        <CardBody>
          {/* Avatar con inicial */}
          <div className="flex items-center gap-4 mb-4">
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold font-cinzel border-2 shrink-0"
              style={{
                backgroundColor: `${classColor}33`,
                borderColor: classColor,
                color: classColor,
              }}
            >
              {name.charAt(0)}
            </div>
            <div className="min-w-0">
              {/* Nombre */}
              <h3 className="font-cinzel text-base tracking-wide truncate" style={{ color: classColor }}>
                {name}
              </h3>
              {/* Spec */}
              <p className="text-horda-muted text-xs font-exo truncate">{spec}</p>
            </div>
          </div>

          {/* Badges: clase + rol + score */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            <Badge color={classColor} variant="filled" size="sm">
              {className}
            </Badge>
            <RoleBadge role={role} size="sm" />
            <ScoreBadge score={score} size="sm" />
          </div>

          {/* Item level + raid progress */}
          <div className="flex items-center justify-between text-xs text-horda-muted font-exo pt-3 border-t border-horda-border">
            {/* Item level */}
            <span>
              ILvl: <span className="text-horda-text font-medium">{ilvl > 0 ? ilvl : "—"}</span>
            </span>
            {/* Progreso mítico */}
            <span>
              Mítico: <span className="text-horda-gold font-medium">{mythicBosses}/{totalBosses}</span>
            </span>
          </div>
        </CardBody>
      </Card>
    </Link>
  );
}
