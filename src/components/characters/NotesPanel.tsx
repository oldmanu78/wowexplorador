'use client';

import { useState, useCallback, useEffect } from "react";
import Card, { CardBody, CardHeader } from "@/components/ui/Card";
import { DUNGEONS } from "@/lib/constants";

interface NotesPanelProps {
  slug: string;
}

export default function NotesPanel({ slug }: NotesPanelProps) {
  const storageKey = `${slug}_notes`;
  const [selectedDungeon, setSelectedDungeon] = useState(DUNGEONS[0]?.slug || "");
  const [savedNotes, setSavedNotes] = useState<Record<string, string>>({});
  const note = savedNotes[selectedDungeon] || "";

  useEffect(() => {
    queueMicrotask(() => {
      try {
        setSavedNotes(JSON.parse(localStorage.getItem(storageKey) || "{}") as Record<string, string>);
      } catch {
        setSavedNotes({});
      }
    });
  }, [storageKey]);

  const saveNote = useCallback((value: string) => {
    const updated = { ...savedNotes, [selectedDungeon]: value };
    setSavedNotes(updated);
    localStorage.setItem(storageKey, JSON.stringify(updated));
  }, [savedNotes, selectedDungeon, storageKey]);

  return (
    <Card>
      <CardHeader>
        <p className="text-gold text-[0.74rem] font-black tracking-[0.18em] uppercase">
          Notas por Mazmorra
        </p>
      </CardHeader>
      <CardBody>
        <div className="mb-4">
          <label htmlFor="dungeon-select" className="block text-xs text-muted font-inter font-bold mb-1 uppercase tracking-wide">
            Mazmorra:
          </label>
          <select
            id="dungeon-select"
            value={selectedDungeon}
            onChange={(e) => setSelectedDungeon(e.target.value)}
            className="w-full bg-[rgba(7,5,4,0.52)] border border-[rgba(240,195,90,0.2)] rounded px-3 py-2 text-bone text-sm font-inter focus:outline-none focus:border-gold"
          >
            {DUNGEONS.map((d) => (
              <option key={d.slug} value={d.slug}>
                {d.name} ({d.sigla})
              </option>
            ))}
          </select>
        </div>

        <textarea
          value={note}
          onChange={(e) => saveNote(e.target.value)}
          placeholder="Escribe tus notas para esta mazmorra..."
          rows={6}
          className="w-full bg-[rgba(7,5,4,0.52)] border border-[rgba(240,195,90,0.2)] rounded px-3 py-2 text-bone text-sm font-inter focus:outline-none focus:border-gold resize-y placeholder:text-muted"
        />

        <div className="flex justify-end mt-3">
          <button
            onClick={() => saveNote(note)}
            className="px-4 py-2 text-xs font-inter font-bold rounded bg-gold text-[#180c07] hover:bg-brass transition-colors uppercase tracking-wide"
          >
            Guardado
          </button>
        </div>

        <p className="text-xs text-muted mt-3 text-center font-inter">
          Las notas se guardan automaticamente en tu navegador (localStorage).
        </p>
      </CardBody>
    </Card>
  );
}
