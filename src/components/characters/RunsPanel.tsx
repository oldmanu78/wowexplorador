import Card, { CardBody, CardHeader } from "@/components/ui/Card";
import { getDungeonName, formatDate, getScoreColor } from "@/lib/utils";

interface Run {
  dungeonSlug: string;
  score: number;
  level: number;
  completedAt: string;
  isBest: boolean;
}

interface RunsPanelProps {
  bestRuns: Run[];
  recentRuns: Run[];
}

export default function RunsPanel({ bestRuns, recentRuns }: RunsPanelProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <p className="text-gold text-[0.74rem] font-black tracking-[0.18em] uppercase">
            Mejores Carreras
          </p>
        </CardHeader>
        <CardBody>
          <div className="space-y-2">
            {bestRuns.length === 0 && (
              <p className="text-muted text-sm font-inter">Sin datos</p>
            )}
            {bestRuns.slice(0, 10).map((run, i) => (
              <RunRow key={`best-${i}`} run={run} />
            ))}
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <p className="text-gold text-[0.74rem] font-black tracking-[0.18em] uppercase">
            Ultimas Carreras
          </p>
        </CardHeader>
        <CardBody>
          <div className="space-y-2">
            {recentRuns.length === 0 && (
              <p className="text-muted text-sm font-inter">Sin datos</p>
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

function RunRow({ run }: { run: Run }) {
  return (
    <div className="flex items-center justify-between py-3 px-4 bg-[rgba(7,5,4,0.52)] rounded border border-[rgba(240,195,90,0.2)]">
      <div className="flex items-center gap-3">
        <span className="text-xs font-bold font-inter text-gold w-8">
          +{run.level}
        </span>
        <span className="text-bone text-sm font-inter">
          {getDungeonName(run.dungeonSlug)}
        </span>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-xs text-muted font-inter">
          {formatDate(run.completedAt)}
        </span>
        <span className="font-bold text-sm font-inter" style={{ color: getScoreColor(run.score) }}>
          {run.score.toFixed(1)}
        </span>
      </div>
    </div>
  );
}
