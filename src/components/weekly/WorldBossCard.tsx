// Muestra el jefe del mundo activo esta semana
import Card, { CardBody } from "@/components/ui/Card";

interface WorldBossCardProps {
  boss: string; // Ej: "Lu'ashal (Eversong Woods)"
}

export default function WorldBossCard({ boss }: WorldBossCardProps) {
  return (
    <Card>
      <CardBody>
        <h3 className="font-cinzel text-horda-gold text-sm mb-2 tracking-wide">
          JEFE DEL MUNDO
        </h3>
        <p className="text-horda-text font-exo">{boss || "Sin datos"}</p>
      </CardBody>
    </Card>
  );
}
