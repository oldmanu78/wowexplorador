import Card, { CardBody } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { withBasePath } from "@/lib/utils";
import Image from "next/image";

interface RouteCardProps {
  name: string;
  url: string;
  type: string;
  desc: string;
  thumb: string | null;
}

export default function RouteCard({ name, url, type, desc, thumb }: RouteCardProps) {
  const typeColor = type === "high" ? "#f05a28" : "#4ade80";
  const typeLabel = type === "high" ? "High Key" : "PUG";
  const thumbSrc = withBasePath(thumb);

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block h-full"
    >
      <Card className="h-full">
        <CardBody className="flex h-full flex-col">
          <div className="relative mb-4 flex aspect-[16/9] w-full items-center justify-center overflow-hidden rounded border border-[rgba(240,195,90,0.2)] bg-bg">
            {thumbSrc ? (
              <Image
                src={thumbSrc}
                alt={name}
                fill
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
              />
            ) : (
              <span
                className="inline-flex h-12 w-12 items-center justify-center rounded border border-[rgba(240,195,90,0.2)] bg-[rgba(7,5,4,0.52)] text-xs font-bold tracking-[0.18em] text-gold"
                aria-label="Ruta sin imagen"
              >
                MAP
              </span>
            )}
          </div>

          <h4 className="mb-2 min-h-10 font-cinzel text-sm leading-5 text-bone tracking-wide">
            {name}
          </h4>

          <div>
            <Badge color={typeColor} variant="filled" size="sm">
              {typeLabel}
            </Badge>
          </div>

          <p className="mt-3 min-h-10 text-xs leading-5 text-muted font-inter">
            {desc}
          </p>
        </CardBody>
      </Card>
    </a>
  );
}
