// Componente Tabs con scroll horizontal
// Recibe los paneles como children directos (no render props)
// Cada panel debe tener data-tab="tabId" para identificar su tab
'use client';

import { useState, Children, isValidElement } from "react";
import type { KeyboardEvent, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface TabDefinition {
  id: string;
  label: string;
}

interface TabsProps {
  tabs: TabDefinition[];
  defaultTab?: string;
  className?: string;
  children: ReactNode;
}

export default function Tabs({ tabs, defaultTab, className, children }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id || "");

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft" && event.key !== "Home" && event.key !== "End") {
      return;
    }

    event.preventDefault();
    const lastIndex = tabs.length - 1;
    const nextIndex =
      event.key === "Home" ? 0 :
      event.key === "End" ? lastIndex :
      event.key === "ArrowRight" ? (index + 1) % tabs.length :
      (index - 1 + tabs.length) % tabs.length;
    const nextTab = tabs[nextIndex];
    if (!nextTab) return;

    setActiveTab(nextTab.id);
    document.getElementById(`tab-${nextTab.id}`)?.focus();
  };

  return (
    <div className={className}>
      {/* Barra de tabs con scroll horizontal */}
      <div className="overflow-x-auto hide-scrollbar border-b border-horda-border">
        <div className="flex gap-1 min-w-max px-1" role="tablist" aria-label="Secciones del personaje">
          {tabs.map((tab, index) => (
            <button
              key={tab.id}
              id={`tab-${tab.id}`}
              type="button"
              role="tab"
              aria-selected={activeTab === tab.id}
              aria-controls={`panel-${tab.id}`}
              tabIndex={activeTab === tab.id ? 0 : -1}
              onClick={() => setActiveTab(tab.id)}
              onKeyDown={(event) => handleKeyDown(event, index)}
              className={cn(
                "px-4 py-2.5 text-sm font-exo whitespace-nowrap transition-all duration-200",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-horda-gold focus-visible:ring-offset-2 focus-visible:ring-offset-horda-surface",
                "border-b-2 -mb-[1px]",
                activeTab === tab.id
                  ? "text-horda-gold border-horda-gold"
                  : "text-horda-muted border-transparent hover:text-horda-text hover:border-horda-muted"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Contenido del tab activo */}
      <div className="py-4">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            id={`panel-${tab.id}`}
            role="tabpanel"
            aria-labelledby={`tab-${tab.id}`}
            tabIndex={0}
            className={cn(tab.id !== activeTab && "hidden")}
          >
            {findPanel(children, tab.id)}
          </div>
        ))}
      </div>
    </div>
  );
}

// Encuentra el panel con data-tab coincidente entre los children
function findPanel(children: ReactNode, tabId: string): ReactNode {
  const childrenArray = Children.toArray(children);
  return childrenArray.find(
    (child) =>
      isValidElement<{ "data-tab"?: string }>(child) &&
      child.props["data-tab"] === tabId
  );
}
