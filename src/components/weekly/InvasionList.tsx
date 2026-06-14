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
        <p className="text-gold text-[0.74rem] font-black tracking-[0.18em] uppercase">
          Invasiones
        </p>
      </CardHeader>
      <CardBody className="space-y-2">
        {invasions.length === 0 && (
          <p className="text-muted text-sm">Sin invasiones</p>
        )}
        {invasions.map((inv) => (
          <div
            key={inv.id}
            className="flex items-center justify-between py-3 px-4 bg-[rgba(7,5,4,0.52)] rounded border border-[rgba(240,195,90,0.2)]"
          >
            <div>
              <p className="text-bone text-sm font-inter">{inv.zone}</p>
              <p className="text-xs text-muted">{inv.npcs} NPCs</p>
            </div>
            <span className="text-gold text-xs font-bold">{inv.reward}</span>
          </div>
        ))}
      </CardBody>
    </Card>
  );
}
