// Tab 7: Notas por mazmorra — editor de texto con localStorage
'use client';

import { useState, useCallback } from "react";
import Card, { CardBody, CardHeader } from "@/components/ui/Card";
import { DUNGEONS } from "@/lib/constants";

interface NotesPanelProps {
  slug: string; // Slug del personaje para key de localStorage
}

export default function NotesPanel({ slug }: NotesPanelProps) {
  const storageKey = `${slug}_notes`;
  // Dungeon seleccionado actualmente
  const [selectedDungeon, setSelectedDungeon] = useState(DUNGEONS[0]?.slug || "");
  // Notas cargadas desde localStorage
  const [savedNotes, setSavedNotes] = useState<Record<string, string>>(() => {
    if (typeof window === "undefined") return {};
    try {
      return JSON.parse(localStorage.getItem(storageKey) || "{}") as Record<string, string>;
    } catch {
      return {};
    }
  });
  const note = savedNotes[selectedDungeon] || "";

  // Guardar la nota actual en memoria y localStorage
  const saveNote = useCallback((value: string) => {
    const updated = { ...savedNotes, [selectedDungeon]: value };
    setSavedNotes(updated);
    localStorage.setItem(storageKey, JSON.stringify(updated));
  }, [savedNotes, selectedDungeon, storageKey]);

  return (
    <Card>
      <CardHeader>
        <h3 className="font-cinzel text-horda-gold text-sm tracking-wide">
          NOTAS POR MAZMORRA
        </h3>
      </CardHeader>
      <CardBody>
        {/* Selector de dungeon */}
        <div className="mb-4">
          <label htmlFor="dungeon-select" className="block text-xs text-horda-muted font-exo mb-1">
            Mazmorra:
          </label>
          <select
            id="dungeon-select"
            value={selectedDungeon}
            onChange={(e) => setSelectedDungeon(e.target.value)}
            className="w-full bg-horda-bg border border-horda-border rounded px-3 py-2 text-horda-text text-sm font-exo focus:outline-none focus:border-horda-gold"
          >
            {DUNGEONS.map((d) => (
              <option key={d.slug} value={d.slug}>
                {d.name} ({d.sigla})
              </option>
            ))}
          </select>
        </div>

        {/* Editor de nota */}
        <textarea
          value={note}
          onChange={(e) => saveNote(e.target.value)}
          placeholder="Escribe tus notas para esta mazmorra..."
          rows={6}
          className="w-full bg-horda-bg border border-horda-border rounded px-3 py-2 text-horda-text text-sm font-exo focus:outline-none focus:border-horda-gold resize-vertical placeholder:text-horda-muted"
        />

        {/* Botón guardar */}
        <div className="flex justify-end mt-3">
          <button
            onClick={() => saveNote(note)}
            className="px-4 py-2 text-xs font-exo rounded bg-horda-gold text-black font-medium hover:bg-horda-gold-dark transition-colors"
          >
            Guardado
          </button>
        </div>

        {/* Indicador de guardado */}
        <p className="text-xs text-horda-muted mt-3 text-center font-exo">
          Las notas se guardan automáticamente en tu navegador (localStorage).
        </p>
      </CardBody>
    </Card>
  );
}
