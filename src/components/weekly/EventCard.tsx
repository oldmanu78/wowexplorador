import Card, { CardBody } from "@/components/ui/Card";

interface EventCardProps {
  event: string;
}

export default function EventCard({ event }: EventCardProps) {
  return (
    <Card>
      <CardBody>
        <p className="text-gold text-[0.74rem] font-black tracking-[0.18em] uppercase mb-2">
          Evento de la semana
        </p>
        <p className="text-bone font-inter text-base leading-relaxed">{event || "Sin datos"}</p>
      </CardBody>
    </Card>
  );
}
