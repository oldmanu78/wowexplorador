// Tabs de mazmorras para la página de rutas
// Genera tabs dinámicamente desde los datos de SQLite
'use client';

import { useState } from "react";
import { cn } from "@/lib/utils";
import DungeonHero from "./DungeonHero";
import RouteCard from "./RouteCard";
import type { Dungeon, Route } from "@/generated/prisma/client";

// Datos completos de una mazmorra con sus rutas
interface DungeonWithRoutes extends Dungeon {
  routes: Route[];
}

interface DungeonTabsProps {
  dungeons: DungeonWithRoutes[];
}

export default function DungeonTabs({ dungeons }: DungeonTabsProps) {
  // Estado del dungeon activo
  const [activeIndex, setActiveIndex] = useState(0);
  const [search, setSearch] = useState("");

  // Filtra dungeons por búsqueda
  const filtered = dungeons.filter((d) =>
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.sigla.toLowerCase().includes(search.toLowerCase())
  );

  const activeDungeon = filtered[activeIndex] || dungeons[0];

  return (
    <div>
      {/* Buscador */}
      <input
        type="text"
        placeholder="Buscar mazmorra..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setActiveIndex(0);
        }}
        className="w-full bg-horda-bg border border-horda-border rounded px-4 py-2 text-horda-text text-sm font-exo mb-4 focus:outline-none focus:border-horda-gold placeholder:text-horda-muted"
      />

      {/* Barra de tabs con scroll horizontal */}
      <div className="overflow-x-auto hide-scrollbar mb-6">
        <div className="flex gap-2 min-w-max">
          {filtered.map((dungeon, i) => (
            <button
              key={dungeon.slug}
              onClick={() => setActiveIndex(i)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-exo transition-all whitespace-nowrap",
                "border",
                activeIndex === i
                  ? "bg-horda-gold text-black border-horda-gold font-medium"
                  : "bg-horda-surface text-horda-text border-horda-border hover:border-horda-gold"
              )}
            >
              {/* Dot de tipo */}
              <span
                className="w-2 h-2 rounded-full inline-block shrink-0"
                style={{
                  backgroundColor: dungeon.type === "nueva" ? "#00c8ff" : "#a78bfa",
                }}
              />
              {/* Sigla */}
              <span className="font-bold">{dungeon.sigla}</span>
              {/* Nombre (oculto en mobile) */}
              <span className="hidden md:inline text-xs opacity-80">{dungeon.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Contenido del dungeon activo */}
      {activeDungeon && (
        <div>
          {/* Hero de la mazmorra */}
          <DungeonHero
            name={activeDungeon.name}
            sigla={activeDungeon.sigla}
            type={activeDungeon.type}
            jefes={activeDungeon.jefes}
            zona={activeDungeon.zona}
            timer={activeDungeon.timer}
            desc={activeDungeon.desc}
            img={activeDungeon.img}
          />

          {/* Guías externas */}
          <div className="flex gap-3 mb-6">
            <a
              href={`https://method.gg/dungeons/${activeDungeon.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 text-xs font-exo rounded border border-horda-border text-horda-text hover:text-horda-gold hover:border-horda-gold transition-colors"
            >
              📖 Guía Method
            </a>
            <a
              href={`https://www.icy-veins.com/wow/dungeons/${activeDungeon.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 text-xs font-exo rounded border border-horda-border text-horda-text hover:text-horda-gold hover:border-horda-gold transition-colors"
            >
              📖 Guía Icy-Veins
            </a>
          </div>

          {/* Rutas */}
          <h3 className="font-cinzel text-horda-gold text-sm tracking-wide mb-4">
            RUTAS — {activeDungeon.name}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeDungeon.routes?.map((route) => (
              <RouteCard
                key={route.id}
                name={route.name}
                url={route.url}
                type={route.type}
                desc={route.desc}
                thumb={route.thumb}
              />
            ))}
          </div>

          {/* Sin rutas */}
          {(!activeDungeon.routes || activeDungeon.routes.length === 0) && (
            <p className="text-horda-muted text-sm font-exo text-center py-8">
              No hay rutas disponibles para esta mazmorra.
            </p>
          )}
        </div>
      )}

      {/* Sin resultados de búsqueda */}
      {filtered.length === 0 && (
        <p className="text-horda-muted text-sm font-exo text-center py-8">
          No se encontraron mazmorras con &quot;{search}&quot;
        </p>
      )}
    </div>
  );
}
