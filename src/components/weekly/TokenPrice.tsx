import Card, { CardBody } from "@/components/ui/Card";

interface TokenPriceProps {
  price: string;
}

export default function TokenPrice({ price }: TokenPriceProps) {
  return (
    <Card>
      <CardBody>
        <p className="text-gold text-[0.74rem] font-black tracking-[0.18em] uppercase mb-2">
          Precio del Token
        </p>
        <p className="text-bone font-cinzel text-2xl font-bold">
          {price || "Buscando..."}
        </p>
      </CardBody>
    </Card>
  );
}
