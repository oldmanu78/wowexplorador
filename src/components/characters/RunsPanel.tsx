// Tab 5: Últimas carreras M+
// Muestra las carreras recientes y mejores del personaje
import Card, { CardBody, CardHeader } from "@/components/ui/Card";
import { getDungeonName, formatDate } from "@/lib/utils";

interface Run {
  dungeonSlug: string;
  score: number;
  level: number;
  completedAt: string; // ISO string
  isBest: boolean;
}

interface RunsPanelProps {
  bestRuns: Run[];   // Mejores carreras por dungeon
  recentRuns: Run[]; // Últimas carreras
}

export default function RunsPanel({ bestRuns, recentRuns }: RunsPanelProps) {
  return (
    <div className="space-y-6">
      {/* Mejores carreras */}
      <Card>
        <CardHeader>
          <h3 className="font-cinzel text-horda-gold text-sm tracking-wide">
            MEJORES CARRERAS
          </h3>
        </CardHeader>
        <CardBody>
          <div className="space-y-2">
            {bestRuns.length === 0 && (
              <p className="text-horda-muted text-sm font-exo">Sin datos</p>
            )}
            {bestRuns.slice(0, 10).map((run, i) => (
              <RunRow key={`best-${i}`} run={run} />
            ))}
          </div>
        </CardBody>
      </Card>

      {/* Últimas carreras */}
      <Card>
        <CardHeader>
          <h3 className="font-cinzel text-horda-gold text-sm tracking-wide">
            ÚLTIMAS CARRERAS
          </h3>
        </CardHeader>
        <CardBody>
          <div className="space-y-2">
            {recentRuns.length === 0 && (
              <p className="text-horda-muted text-sm font-exo">Sin datos</p>
            )}
            {recentRuns.slice(0, 10).map((run, i) => (
              <RunRow key={`recent-${i}`} run={run} />
            ))}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

// Fila individual de carrera
function RunRow({ run }: { run: Run }) {
  const scoreColor =
    run.score >= 3000 ? "#ff8000" :
    run.score >= 2000 ? "#a335ee" :
    run.score >= 1500 ? "#0070dd" :
    run.score >= 1000 ? "#1eff00" :
    "#ffffff";

  return (
    <div className="flex items-center justify-between py-2 px-3 bg-horda-bg rounded border border-horda-border">
      <div className="flex items-center gap-3">
        {/* Nivel de la clave */}
        <span className="text-xs font-bold font-exo text-horda-gold w-8">
          +{run.level}
        </span>
        {/* Nombre de la mazmorra */}
        <span className="text-horda-text text-sm font-exo">
          {getDungeonName(run.dungeonSlug)}
        </span>
      </div>
      <div className="flex items-center gap-3">
        {/* Fecha */}
        <span className="text-xs text-horda-muted font-exo">
          {formatDate(run.completedAt)}
        </span>
        {/* Score */}
        <span className="font-bold text-sm font-exo" style={{ color: scoreColor }}>
          {run.score.toFixed(1)}
        </span>
      </div>
    </div>
  );
}
