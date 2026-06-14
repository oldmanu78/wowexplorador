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
    <div className={cn(
      "border border-[rgba(240,195,90,0.34)] rounded-lg",
      "bg-[linear-gradient(180deg,rgba(25,16,13,0.96),rgba(7,5,4,0.96))]",
      "shadow-[0_24px_80px_rgba(0,0,0,0.55)]",
      className
    )}>
      <div className="overflow-x-auto hide-scrollbar border-b border-[rgba(240,195,90,0.2)]">
        <div className="flex gap-1 min-w-max px-2" role="tablist" aria-label="Secciones del personaje">
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
                "px-4 py-3 text-[0.78rem] font-inter font-bold whitespace-nowrap transition-all duration-180",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-surface-strong",
                "border-b-2 -mb-[1px] tracking-[0.08em] uppercase",
                activeTab === tab.id
                  ? "text-gold border-gold"
                  : "text-muted border-transparent hover:text-bone hover:border-[rgba(240,195,90,0.4)]"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-5">
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

function findPanel(children: ReactNode, tabId: string): ReactNode {
  const childrenArray = Children.toArray(children);
  return childrenArray.find(
    (child) =>
      isValidElement<{ "data-tab"?: string }>(child) &&
      child.props["data-tab"] === tabId
  );
}
