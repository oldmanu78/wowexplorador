// Componente Tabs con scroll horizontal
// Recibe los paneles como children directos (no render props)
// Cada panel debe tener data-tab="tabId" para identificar su tab
'use client';

import { useState, Children, isValidElement } from "react";
import type { ReactNode } from "react";
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

  return (
    <div className={className}>
      {/* Barra de tabs con scroll horizontal */}
      <div className="overflow-x-auto hide-scrollbar border-b border-horda-border">
        <div className="flex gap-1 min-w-max px-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "px-4 py-2.5 text-sm font-exo whitespace-nowrap transition-all duration-200",
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
