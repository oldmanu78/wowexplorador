// Tab 1: Stats del personaje
// Muestra score M+, item level, stats secundarias desde Blizzard API o Armory
import Card, { CardBody, CardHeader } from "@/components/ui/Card";
import { getRioScore, getRioIlvl, safeJsonParse } from "@/lib/utils";

interface StatsPanelProps {
  rioData: string | null;
  armory: string | null;
}

interface ArmoryStats {
  ilvl: number;
  items?: Record<string, any>;
  stats?: Record<string, number>;
}

export default function StatsPanel({ rioData, armory }: StatsPanelProps) {
  const score = getRioScore(rioData);
  const rioIlvl = getRioIlvl(rioData);

  // Intenta parsear datos de Armory Blizzard (stats detallados)
  const armoryStats = safeJsonParse<ArmoryStats>(armory);

  // Stats secundarias desde Armory (más completas que Raider.io)
  const stats = armoryStats?.stats;
  const ilvl = armoryStats?.ilvl || rioIlvl;

  // Lista de stats a mostrar con sus labels en español
  const statList = stats
    ? [
        { label: "Fuerza", value: stats.strength },
        { label: "Agilidad", value: stats.agility },
        { label: "Intelecto", value: stats.intellect },
        { label: "Aguante", value: stats.stamina },
        { label: "Crítico", value: stats.crit },
        { label: "Celeridad", value: stats.haste },
        { label: "Maestría", value: stats.mastery },
        { label: "Versatilidad", value: stats.versatility },
        { label: "Leach", value: stats.leech },
        { label: "Velocidad", value: stats.speed },
        { label: "Evasión", value: stats.avoidance },
      ].filter((s) => s.value != null)
    : [];

  return (
    <div className="space-y-6">
      {/* Score e ilvl principales */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardBody className="text-center">
            <p className="text-horda-muted text-xs font-exo mb-1">SCORE M+</p>
            <p className="text-3xl font-bold font-exo" style={{
              color: score >= 3000 ? "#ff8000" : score >= 2000 ? "#a335ee" : score >= 1500 ? "#0070dd" : "#ffffff"
            }}>
              {score.toLocaleString("es-CL")}
            </p>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="text-center">
            <p className="text-horda-muted text-xs font-exo mb-1">ITEM LEVEL</p>
            <p className="text-3xl font-bold text-horda-gold font-exo">
              {ilvl > 0 ? ilvl : "—"}
            </p>
          </CardBody>
        </Card>
      </div>

      {/* Stats secundarias en grid */}
      {statList.length > 0 && (
        <Card>
          <CardHeader>
            <h3 className="font-cinzel text-horda-gold text-sm tracking-wide">
              ESTADÍSTICAS
            </h3>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {statList.map((stat) => (
                <div
                  key={stat.label}
                  className="bg-horda-bg rounded border border-horda-border p-3"
                >
                  <p className="text-horda-muted text-xs font-exo">{stat.label}</p>
                  <p className="text-horda-text font-bold font-exo text-lg">
                    {stat.value?.toLocaleString("es-CL") || "—"}
                  </p>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      )}

      {/* Mensaje si no hay stats */}
      {statList.length === 0 && !stats && (
        <Card>
          <CardBody>
            <p className="text-horda-muted text-sm font-exo text-center">
              Stats no disponibles. Los datos se actualizan con el pipeline semanal.
            </p>
          </CardBody>
        </Card>
      )}
    </div>
  );
}
