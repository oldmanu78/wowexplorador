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
    <Link href={`/personajes/${slug}`} className="group block h-full">
      <Card className="relative h-full overflow-hidden border-horda-border/90 bg-[linear-gradient(135deg,rgba(38,24,18,0.96),rgba(14,10,9,0.98))] shadow-[inset_0_1px_0_rgba(248,183,0,0.08),0_18px_40px_rgba(0,0,0,0.24)]">
        <div
          className="absolute inset-x-0 top-0 h-1 opacity-90"
          style={{ background: `linear-gradient(90deg, transparent, ${classColor}, transparent)` }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(248,183,0,0.07),transparent_36%),linear-gradient(180deg,rgba(255,255,255,0.035),transparent_42%)] opacity-80 transition-opacity group-hover:opacity-100" />
        <CardBody className="relative">
          {/* Avatar con inicial */}
          <div className="flex items-center gap-4 mb-4">
            <div
              className="w-16 h-16 rounded flex items-center justify-center text-2xl font-bold font-cinzel border-2 shrink-0 shadow-[inset_0_0_18px_rgba(0,0,0,0.55)] transition-transform group-hover:scale-[1.03]"
              style={{
                background: `linear-gradient(135deg, ${classColor}3d, rgba(10,10,10,0.88))`,
                borderColor: classColor,
                color: classColor,
              }}
            >
              {name.charAt(0)}
            </div>
            <div className="min-w-0">
              {/* Nombre */}
              <h3 className="font-cinzel text-base tracking-[0.08em] truncate" style={{ color: classColor }}>
                {name}
              </h3>
              {/* Spec */}
              <p className="text-horda-muted text-xs font-exo truncate uppercase tracking-[0.12em]">{spec}</p>
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
          <div className="grid grid-cols-2 gap-2 text-xs text-horda-muted font-exo pt-3 border-t border-horda-border/80">
            {/* Item level */}
            <span className="rounded border border-horda-border/70 bg-black/18 px-2 py-2">
              <span className="block text-[10px] uppercase tracking-[0.16em]">ILvl</span>
              <span className="text-horda-text font-semibold">{ilvl > 0 ? ilvl : "—"}</span>
            </span>
            {/* Progreso mítico */}
            <span className="rounded border border-horda-border/70 bg-black/18 px-2 py-2 text-right">
              <span className="block text-[10px] uppercase tracking-[0.16em]">Mítico</span>
              <span className="text-horda-gold font-semibold">{mythicBosses}/{totalBosses}</span>
            </span>
          </div>
        </CardBody>
      </Card>
    </Link>
  );
}
