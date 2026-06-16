'use client';

import { useState, useEffect } from "react";
import Card, { CardBody, CardHeader } from "@/components/ui/Card";
import { safeJsonParse } from "@/lib/utils";
import type { ArmoryCurrency, ArmoryStats } from "@/lib/wow-types";

interface MonedasPanelProps {
  slug: string;
  armory: string | null;
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

export default function MonedasPanel({ slug, armory }: MonedasPanelProps) {
  const storageKey = `${slug}_monedas`;
  const armoryStats = safeJsonParse<ArmoryStats>(armory);
  const liveCurrencies = normalizeCurrencies(armoryStats?.currencies);

  const [monedas, setMonedas] = useState<Record<string, number>>(DEFAULT_MONEDAS);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    queueMicrotask(() => {
      const saved = localStorage.getItem(storageKey);
      if (!saved) {
        setIsLoaded(true);
        return;
      }

      try {
        setMonedas({ ...DEFAULT_MONEDAS, ...JSON.parse(saved) });
      } catch {
        setMonedas(DEFAULT_MONEDAS);
      }
      setIsLoaded(true);
    });
  }, [storageKey]);

  useEffect(() => {
    if (!isLoaded) return;
    localStorage.setItem(storageKey, JSON.stringify(monedas));
  }, [isLoaded, monedas, storageKey]);

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
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <p className="text-gold text-[0.74rem] font-black tracking-[0.18em] uppercase">
            Monedas actuales
          </p>
        </CardHeader>
        <CardBody>
          {liveCurrencies.length > 0 ? (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {liveCurrencies.map((currency) => (
                <CurrencyRow key={`${currency.id || currency.name}`} currency={currency} />
              ))}
            </div>
          ) : (
            <p className="text-sm leading-relaxed text-muted">
              El pipeline aún no tiene monedas actuales para este personaje. Cuando Blizzard/Armory entregue
              currencies, aparecerán aquí automáticamente; mientras tanto puedes usar el seguimiento manual.
            </p>
          )}
        </CardBody>
      </Card>

      <Card>
        <CardHeader className="flex items-center justify-between">
          <div>
            <p className="text-gold text-[0.74rem] font-black tracking-[0.18em] uppercase">
              Seguimiento manual
            </p>
            <p className="mt-1 text-xs text-muted">
              Se guarda en este navegador por personaje.
            </p>
          </div>
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
                  name={`moneda-${moneda.key}`}
                  type="number"
                  min="0"
                  inputMode="numeric"
                  value={monedas[moneda.key] || 0}
                  onChange={(e) => updateMoneda(moneda.key, e.target.value)}
                  className="min-h-11 w-24 text-right bg-surface-strong border border-[rgba(240,195,90,0.2)] rounded px-3 py-1.5 text-bone font-inter text-sm focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/30 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
              </div>
            ))}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

function CurrencyRow({ currency }: { currency: ArmoryCurrency }) {
  const hasCap = currency.maxQuantity != null && currency.maxQuantity > 0;

  return (
    <div className="rounded border border-[rgba(240,195,90,0.2)] bg-[rgba(7,5,4,0.52)] px-4 py-3">
      <p className="text-xs font-black uppercase tracking-[0.16em] text-muted">{currency.name}</p>
      <p className="mt-1 text-lg font-bold text-bone">
        {(currency.quantity || 0).toLocaleString("es-CL")}
        {hasCap && <span className="text-sm text-muted"> / {currency.maxQuantity?.toLocaleString("es-CL")}</span>}
      </p>
    </div>
  );
}

function normalizeCurrencies(currencies: ArmoryCurrency[] | undefined): ArmoryCurrency[] {
  if (!Array.isArray(currencies)) return [];

  return currencies
    .filter((currency) => currency?.name && currency.quantity != null)
    .sort((a, b) => a.name.localeCompare(b.name));
}
