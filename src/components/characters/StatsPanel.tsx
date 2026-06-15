import Card, { CardBody, CardHeader } from "@/components/ui/Card";
import { getRioScore, getRioIlvl, getScoreColor, safeJsonParse } from "@/lib/utils";
import type { ArmoryStats, ArmoryStatValue } from "@/lib/wow-types";

interface StatsPanelProps {
  rioData: string | null;
  armory: string | null;
}

export default function StatsPanel({ rioData, armory }: StatsPanelProps) {
  const score = getRioScore(rioData);
  const rioIlvl = getRioIlvl(rioData);

  const armoryStats = safeJsonParse<ArmoryStats>(armory);

  const ilvl = armoryStats?.ilvl || rioIlvl;
  const statValue = (stat?: ArmoryStatValue) => stat?.value;

  const statList = [
    { label: "Fuerza", stat: armoryStats?.strength, value: statValue(armoryStats?.strength) },
    { label: "Agilidad", stat: armoryStats?.agility, value: statValue(armoryStats?.agility) },
    { label: "Intelecto", stat: armoryStats?.intellect, value: statValue(armoryStats?.intellect) },
    { label: "Aguante", stat: armoryStats?.stamina, value: statValue(armoryStats?.stamina) },
    { label: "Crítico", stat: armoryStats?.crit, value: statValue(armoryStats?.crit) },
    { label: "Celeridad", stat: armoryStats?.haste, value: statValue(armoryStats?.haste) },
    { label: "Maestría", stat: armoryStats?.mastery, value: statValue(armoryStats?.mastery) },
    { label: "Versatilidad", stat: armoryStats?.versatility, value: statValue(armoryStats?.versatility) },
    { label: "Leech", stat: armoryStats?.leech, value: statValue(armoryStats?.leech) },
    { label: "Velocidad", stat: armoryStats?.speed, value: statValue(armoryStats?.speed) },
    { label: "Evasión", stat: armoryStats?.avoidance, value: statValue(armoryStats?.avoidance) },
  ].filter((s) => s.value != null);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardBody className="text-center">
            <p className="text-muted text-xs font-inter font-bold uppercase tracking-[0.16em] mb-1">Score M+</p>
            <p className="text-3xl font-bold font-cinzel" style={{ color: getScoreColor(score) }}>
              {score.toLocaleString("es-CL")}
            </p>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="text-center">
            <p className="text-muted text-xs font-inter font-bold uppercase tracking-[0.16em] mb-1">Item Level</p>
            <p className="text-3xl font-bold text-gold font-cinzel">
              {ilvl > 0 ? ilvl : "—"}
            </p>
          </CardBody>
        </Card>
      </div>

      {statList.length > 0 && (
        <Card>
          <CardHeader>
            <p className="text-gold text-[0.74rem] font-black tracking-[0.18em] uppercase">
              Estadísticas
            </p>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {statList.map((stat) => (
                <div
                  key={stat.label}
                  className="bg-[rgba(7,5,4,0.52)] rounded border border-[rgba(240,195,90,0.2)] p-3"
                >
                  <p className="text-muted text-xs font-inter font-bold uppercase tracking-wide">{stat.label}</p>
                  <p className="text-bone font-bold font-inter text-lg">
                    {formatStatValue(stat.value, stat.stat)}
                  </p>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      )}

      {statList.length === 0 && (
        <Card>
          <CardBody>
            <p className="text-muted text-sm font-inter text-center">
              Stats no disponibles. Los datos se actualizan con el pipeline semanal.
            </p>
          </CardBody>
        </Card>
      )}
    </div>
  );
}

function formatStatValue(value: number | undefined, stat?: ArmoryStatValue): string {
  if (value == null) return "—";

  if (stat?.type === "PERCENTAGE") {
    return `(${value.toLocaleString("es-CL", { maximumFractionDigits: 2 })}%)`;
  }

  return value.toLocaleString("es-CL", { maximumFractionDigits: 2 });
}
