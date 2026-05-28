// Tab 2: Monedas del personaje — tracker editable con localStorage
// 'use client' porque necesita interactividad del usuario
'use client';

import { useState, useEffect } from "react";
import Card, { CardBody, CardHeader } from "@/components/ui/Card";

interface MonedasPanelProps {
  slug: string; // para key de localStorage (ej: "kr" antes, ahora usamos slug)
}

// Monedas disponibles con su label, icono y key de localStorage
const MONEDAS_CONFIG = [
  { key: "valorstones", label: "Valorstones", icon: "💎" },
  { key: "whelp", label: "Whelp's Crest", icon: "🟢" },
  { key: "drake", label: "Drake's Crest", icon: "🔵" },
  { key: "wyrm", label: "Wyrm's Crest", icon: "🟣" },
  { key: "aspect", label: "Aspect's Crest", icon: "🟠" },
  { key: "gold", label: "Oro", icon: "🪙" },
];

// Estado inicial por defecto
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

  // Estado de las monedas, inicializado desde localStorage
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

  // Persistir en localStorage cuando cambian las monedas
  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(monedas));
  }, [monedas, storageKey]);

  // Actualiza el valor de una moneda específica
  const updateMoneda = (key: string, value: string) => {
    const num = parseInt(value, 10);
    if (!isNaN(num) && num >= 0) {
      setMonedas((prev) => ({ ...prev, [key]: num }));
    }
  };

  // Resetea todas las monedas a 0
  const resetMonedas = () => {
    setMonedas(DEFAULT_MONEDAS);
  };

  return (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <h3 className="font-cinzel text-horda-gold text-sm tracking-wide">MONEDAS</h3>
        {/* Botón de reset */}
        <button
          onClick={resetMonedas}
          className="text-xs text-horda-muted hover:text-horda-red-bright transition-colors font-exo"
        >
          Resetear
        </button>
      </CardHeader>
      <CardBody>
        <div className="space-y-3">
          {MONEDAS_CONFIG.map((moneda) => (
            <div
              key={moneda.key}
              className="flex items-center justify-between bg-horda-bg rounded border border-horda-border px-4 py-3"
            >
              {/* Label con icono */}
              <label htmlFor={`moneda-${moneda.key}`} className="flex items-center gap-2">
                <span>{moneda.icon}</span>
                <span className="text-horda-text text-sm font-exo">{moneda.label}</span>
              </label>

              {/* Input numérico editable */}
              <input
                id={`moneda-${moneda.key}`}
                type="number"
                min="0"
                value={monedas[moneda.key] || 0}
                onChange={(e) => updateMoneda(moneda.key, e.target.value)}
                className="w-24 text-right bg-horda-surface border border-horda-border rounded px-3 py-1.5 text-horda-text font-exo text-sm focus:outline-none focus:border-horda-gold [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
            </div>
          ))}
        </div>

        {/* Nota informativa */}
        <p className="text-xs text-horda-muted mt-4 text-center font-exo">
          Los datos se guardan automáticamente en tu navegador.
        </p>
      </CardBody>
    </Card>
  );
}
