// Muestra el precio del Token de WoW en oro
import Card, { CardBody } from "@/components/ui/Card";

interface TokenPriceProps {
  price: string; // Ej: "284.739g" o "Buscando..."
}

export default function TokenPrice({ price }: TokenPriceProps) {
  return (
    <Card>
      <CardBody>
        <h3 className="font-cinzel text-horda-gold text-sm mb-2 tracking-wide">
          PRECIO DEL TOKEN
        </h3>
        <p className="text-horda-text font-exo text-lg font-bold">
          {price || "Buscando..."}
        </p>
      </CardBody>
    </Card>
  );
}
