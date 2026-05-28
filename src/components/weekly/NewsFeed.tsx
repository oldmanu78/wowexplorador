// Lista de noticias de WoW con fecha, título y fuente
import Card, { CardBody, CardHeader } from "@/components/ui/Card";
import { cn } from "@/lib/utils";

interface NewsItem {
  id: string;
  title: string;
  link: string;
  date: string;
  source: string;
}

interface NewsFeedProps {
  news: NewsItem[];
}

export default function NewsFeed({ news }: NewsFeedProps) {
  return (
    <Card>
      <CardHeader>
        <h3 className="font-cinzel text-horda-gold text-sm tracking-wide">
          NOTICIAS
        </h3>
      </CardHeader>
      <CardBody className="space-y-3">
        {news.length === 0 && (
          <p className="text-horda-muted text-sm">Sin noticias disponibles</p>
        )}
        {news.map((item) => (
          <a
            key={item.id}
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "block pb-3 border-b border-horda-border last:border-0 last:pb-0",
              "hover:bg-horda-surface-2 -mx-4 px-4 py-2 rounded transition-colors"
            )}
          >
            {/* Título de la noticia */}
            <p className="text-horda-text text-sm font-exo leading-snug">
              {item.title}
            </p>
            {/* Fecha y fuente */}
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-horda-muted">{item.date}</span>
              <span className="text-xs text-horda-gold">{item.source}</span>
            </div>
          </a>
        ))}
      </CardBody>
    </Card>
  );
}
