'use client';

import { useState, useEffect } from "react";
import Card, { CardBody, CardHeader } from "@/components/ui/Card";

interface MonedasPanelProps {
  slug: string;
}

const MONEDAS_CONFIG = [
  { key: "valorstones", label: "Valorstones", color: "#7dd3fc" },
  { key: "whelp", label: "Whelp's Crest", color: "#1eff00" },
  { key: "drake", label: "Drake's Crest", color: "#0070dd" },
  { key: "wyrm", label: "Wyrm's Crest", color: "#a335ee" },
  { key: "aspect", label: "Aspect's Crest", color: "#ff8000" },
  { key: "gold", label: "Oro", color: "#f0c35a" },
];

const DEFAULT_MONEDAS: Record<string, number> = {
  valorstones: 0,
  whelp: 0,
  drake: 0,
  wyrm: 0,
  aspect: 0,
  gold: 0,
};

export default function MonedasPanel({ slug }: MonedasPanelProps) {
  const storageKey = `${slug}_monedas`;

  const [monedas, setMonedas] = useState<Record<string, number>>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        try {
          return { ...DEFAULT_MONEDAS, ...JSON.parse(saved) };
        } catch {
          return DEFAULT_MONEDAS;
        }
      }
    }
    return DEFAULT_MONEDAS;
  });

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(monedas));
  }, [monedas, storageKey]);

  const updateMoneda = (key: string, value: string) => {
    const num = parseInt(value, 10);
    if (!isNaN(num) && num >= 0) {
      setMonedas((prev) => ({ ...prev, [key]: num }));
    }
  };

  const resetMonedas = () => {
    setMonedas(DEFAULT_MONEDAS);
  };

  return (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <p className="text-gold text-[0.74rem] font-black tracking-[0.18em] uppercase">
          Monedas
        </p>
        <button
          type="button"
          onClick={resetMonedas}
          className="min-h-10 px-3 text-xs text-muted hover:text-blood-2 transition-colors font-inter font-bold uppercase tracking-wide focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-surface-strong"
        >
          Resetear
        </button>
      </CardHeader>
      <CardBody>
        <div className="space-y-3">
          {MONEDAS_CONFIG.map((moneda) => (
            <div
              key={moneda.key}
              className="flex items-center justify-between bg-[rgba(7,5,4,0.52)] rounded border border-[rgba(240,195,90,0.2)] px-4 py-3"
            >
              <label htmlFor={`moneda-${moneda.key}`} className="flex items-center gap-2">
                <span
                  aria-hidden="true"
                  className="h-3 w-3 rounded-full border border-white/20 shadow-sm"
                  style={{ backgroundColor: moneda.color }}
                />
                <span className="text-bone text-sm font-inter">{moneda.label}</span>
              </label>

              <input
                id={`moneda-${moneda.key}`}
                type="number"
                min="0"
                value={monedas[moneda.key] || 0}
                onChange={(e) => updateMoneda(moneda.key, e.target.value)}
                className="min-h-11 w-24 text-right bg-surface-strong border border-[rgba(240,195,90,0.2)] rounded px-3 py-1.5 text-bone font-inter text-sm focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/30 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
            </div>
          ))}
        </div>

        <p className="text-xs text-muted mt-4 text-center font-inter">
          Los datos se guardan automaticamente en tu navegador.
        </p>
      </CardBody>
    </Card>
  );
}
