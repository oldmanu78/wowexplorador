// Tab 7: Notas por mazmorra — editor de texto con localStorage
'use client';

import { useState, useEffect, useCallback } from "react";
import Card, { CardBody, CardHeader } from "@/components/ui/Card";
import { DUNGEONS } from "@/lib/constants";

interface NotesPanelProps {
  slug: string; // Slug del personaje para key de localStorage
}

export default function NotesPanel({ slug }: NotesPanelProps) {
  // Dungeon seleccionado actualmente
  const [selectedDungeon, setSelectedDungeon] = useState(DUNGEONS[0]?.slug || "");
  // Nota actual
  const [note, setNote] = useState("");
  // Notas cargadas desde localStorage
  const [savedNotes, setSavedNotes] = useState<Record<string, string>>({});

  // Cargar notas desde localStorage al montar el componente
  useEffect(() => {
    try {
      const raw = localStorage.getItem(`${slug}_notes`);
      if (raw) {
        setSavedNotes(JSON.parse(raw));
      }
    } catch {
      // Ignorar errores de parseo
    }
  }, [slug]);

  // Cuando cambia el dungeon seleccionado, cargar su nota
  useEffect(() => {
    setNote(savedNotes[selectedDungeon] || "");
  }, [selectedDungeon, savedNotes]);

  // Guardar la nota actual
  const saveNote = useCallback(() => {
    const updated = { ...savedNotes, [selectedDungeon]: note };
    setSavedNotes(updated);
    localStorage.setItem(`${slug}_notes`, JSON.stringify(updated));
  }, [savedNotes, selectedDungeon, note, slug]);

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
          onChange={(e) => setNote(e.target.value)}
          placeholder="Escribe tus notas para esta mazmorra..."
          rows={6}
          className="w-full bg-horda-bg border border-horda-border rounded px-3 py-2 text-horda-text text-sm font-exo focus:outline-none focus:border-horda-gold resize-vertical placeholder:text-horda-muted"
        />

        {/* Botón guardar */}
        <div className="flex justify-end mt-3">
          <button
            onClick={saveNote}
            className="px-4 py-2 text-xs font-exo rounded bg-horda-gold text-black font-medium hover:bg-horda-gold-dark transition-colors"
          >
            Guardar Nota
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
