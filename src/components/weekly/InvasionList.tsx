// Lista de invasiones de la semana
import Card, { CardBody, CardHeader } from "@/components/ui/Card";

interface InvasionItem {
  id: string;
  zone: string;
  npcs: number;
  reward: string;
}

interface InvasionListProps {
  invasions: InvasionItem[];
}

export default function InvasionList({ invasions }: InvasionListProps) {
  return (
    <Card>
      <CardHeader>
        <h3 className="font-cinzel text-horda-gold text-sm tracking-wide">
          INVASIONES
        </h3>
      </CardHeader>
      <CardBody className="space-y-2">
        {invasions.length === 0 && (
          <p className="text-horda-muted text-sm">Sin invasiones</p>
        )}
        {invasions.map((inv) => (
          <div
            key={inv.id}
            className="flex items-center justify-between py-2 px-3 bg-horda-bg rounded border border-horda-border"
          >
            <div>
              {/* Zona invadida */}
              <p className="text-horda-text text-sm font-exo">{inv.zone}</p>
              {/* Cantidad de NPCs */}
              <p className="text-xs text-horda-muted">{inv.npcs} NPCs</p>
            </div>
            {/* Recompensa */}
            <span className="text-horda-gold text-xs font-medium">{inv.reward}</span>
          </div>
        ))}
      </CardBody>
    </Card>
  );
}
