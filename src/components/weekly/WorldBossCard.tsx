import Card, { CardBody } from "@/components/ui/Card";

interface WorldBossCardProps {
  boss: string;
}

export default function WorldBossCard({ boss }: WorldBossCardProps) {
  return (
    <Card>
      <CardBody>
        <p className="text-gold text-[0.74rem] font-black tracking-[0.18em] uppercase mb-2">
          Jefe del Mundo
        </p>
        <p className="text-bone font-inter text-base leading-relaxed">{boss || "Sin datos"}</p>
      </CardBody>
    </Card>
  );
}
