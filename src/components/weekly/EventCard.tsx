// Muestra el evento semanal (Timewalking, Bonus, etc.)
import Card, { CardBody } from "@/components/ui/Card";

interface EventCardProps {
  event: string; // Ej: "Timewalking: Wrath of the Lich King"
}

export default function EventCard({ event }: EventCardProps) {
  return (
    <Card>
      <CardBody>
        <h3 className="font-cinzel text-horda-gold text-sm mb-2 tracking-wide">
          EVENTO DE LA SEMANA
        </h3>
        <p className="text-horda-text font-exo">{event || "Sin datos"}</p>
      </CardBody>
    </Card>
  );
}
