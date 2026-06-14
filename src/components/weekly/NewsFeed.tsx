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
        <p className="text-gold text-[0.74rem] font-black tracking-[0.18em] uppercase">
          Noticias
        </p>
      </CardHeader>
      <CardBody className="space-y-3">
        {news.length === 0 && (
          <p className="text-muted text-sm">Sin noticias disponibles</p>
        )}
        {news.map((item) => (
          <a
            key={item.id}
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "block pb-3 border-b border-[rgba(240,195,90,0.16)] last:border-0 last:pb-0",
              "hover:bg-[rgba(240,195,90,0.05)] -mx-5 px-5 py-3 rounded transition-colors"
            )}
          >
            <p className="text-bone text-sm font-inter leading-snug">
              {item.title}
            </p>
            <div className="flex items-center gap-2 mt-1.5">
              <span className="text-xs text-muted">{item.date}</span>
              <span className="text-xs text-gold font-bold">{item.source}</span>
            </div>
          </a>
        ))}
      </CardBody>
    </Card>
  );
}
