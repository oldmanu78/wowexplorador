'use client';

import { useState } from "react";
import { cn } from "@/lib/utils";
import DungeonHero from "./DungeonHero";
import RouteCard from "./RouteCard";
import type { Dungeon, Route } from "@/generated/prisma/client";

interface DungeonWithRoutes extends Dungeon {
  routes: Route[];
}

interface DungeonTabsProps {
  dungeons: DungeonWithRoutes[];
}

export default function DungeonTabs({ dungeons }: DungeonTabsProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [search, setSearch] = useState("");

  const filtered = dungeons.filter((d) =>
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.sigla.toLowerCase().includes(search.toLowerCase())
  );

  const activeDungeon = filtered[activeIndex];

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-[rgba(240,195,90,0.28)] bg-[rgba(25,16,13,0.96)] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.55)]">
        <label htmlFor="dungeon-search" className="mb-2 block text-xs text-muted font-inter font-bold uppercase tracking-[0.18em]">
          Buscar mazmorra
        </label>
        <input
          id="dungeon-search"
          name="dungeon-search"
          type="text"
          autoComplete="off"
          placeholder="Nombre o sigla…"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setActiveIndex(0);
          }}
          className="min-h-11 w-full rounded border border-[rgba(240,195,90,0.2)] bg-[rgba(7,5,4,0.52)] px-4 py-2 text-sm text-bone placeholder:text-muted focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/25 font-inter"
        />
      </div>

      <div className="overflow-x-auto hide-scrollbar">
        <div className="flex min-w-max gap-2 pb-1" role="tablist" aria-label="Mazmorras disponibles">
          {filtered.map((dungeon, i) => (
            <button
              key={dungeon.slug}
              type="button"
              role="tab"
              aria-selected={activeIndex === i}
              onClick={() => setActiveIndex(i)}
              className={cn(
                "flex min-h-11 items-center gap-2 rounded-lg border px-4 py-2 text-sm font-inter font-bold transition-colors whitespace-nowrap",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
                activeIndex === i
                  ? "bg-gold text-[#180c07] border-gold"
                  : "bg-surface-strong text-bone border-[rgba(240,195,90,0.2)] hover:border-gold"
              )}
            >
              <span
                className="w-2 h-2 rounded-full inline-block shrink-0"
                style={{
                  backgroundColor: dungeon.type === "nueva" ? "#00c8ff" : "#a78bfa",
                }}
              />
              <span>{dungeon.sigla}</span>
              <span className="hidden md:inline text-xs opacity-80">{dungeon.name}</span>
            </button>
          ))}
        </div>
      </div>

      {activeDungeon && (
        <div className="min-w-0">
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

          <div className="mb-6 flex flex-wrap gap-3">
            <a
              href={`https://method.gg/dungeons/${activeDungeon.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="min-h-10 px-4 py-2 text-xs font-inter font-bold rounded border border-[rgba(240,195,90,0.2)] bg-surface-strong text-bone hover:text-gold hover:border-gold transition-colors uppercase tracking-wide"
            >
              Guía Method
            </a>
            <a
              href={`https://www.icy-veins.com/wow/dungeons/${activeDungeon.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="min-h-10 px-4 py-2 text-xs font-inter font-bold rounded border border-[rgba(240,195,90,0.2)] bg-surface-strong text-bone hover:text-gold hover:border-gold transition-colors uppercase tracking-wide"
            >
              Guía Icy-Veins
            </a>
          </div>

          <p className="text-gold text-[0.74rem] font-black tracking-[0.18em] uppercase mb-4">
            Rutas — {activeDungeon.name}
          </p>

          <div className="grid grid-cols-1 items-stretch gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {activeDungeon.routes?.map((route) => (
              <RouteCard
                key={route.id}
                name={route.name}
                url={route.url}
                type={route.type}
                desc={route.desc}
                thumb={route.thumb}
                dungeonName={activeDungeon.name}
                dungeonSigla={activeDungeon.sigla}
                dungeonType={activeDungeon.type}
              />
            ))}
          </div>

          {(!activeDungeon.routes || activeDungeon.routes.length === 0) && (
            <p className="text-muted text-sm font-inter text-center py-8">
              No hay rutas disponibles para esta mazmorra.
            </p>
          )}
        </div>
      )}

      {filtered.length === 0 && (
        <div className="rounded-lg border border-[rgba(240,195,90,0.2)] bg-surface-strong p-8 text-center">
          <p className="text-muted text-sm font-inter">
            No se encontraron mazmorras con &quot;{search}&quot;
          </p>
        </div>
      )}
    </div>
  );
}
