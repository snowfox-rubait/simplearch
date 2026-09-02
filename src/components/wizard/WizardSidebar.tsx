"use client";

import React from "react";
import { useWizard } from "@/context/WizardContext";
import { CATALOG_PHASES } from "@/data/catalog";
import { IconRenderer } from "@/components/ui/IconRenderer";
import { Check, ChevronRight } from "lucide-react";
import clsx from "clsx";

export const WizardSidebar: React.FC = () => {
  const { currentCategory, activeCategories, selections, goToCategory } = useWizard();

  const activeCategoryIds = new Set(activeCategories.map((c) => c.id));

  return (
    <aside className="w-80 h-full flex-shrink-0 bg-neutral-950/80 border-r border-neutral-800 flex flex-col overflow-hidden">
      {/* Sidebar Header */}
      <div className="p-4 border-b border-neutral-800 bg-neutral-900/30">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
          Architecture Phases
        </h3>
        <p className="text-xs text-neutral-400 mt-1">
          {activeCategories.length} categories configured
        </p>
      </div>

      {/* Categories Tree */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4 custom-scrollbar">
        {CATALOG_PHASES.map((phase) => {
          // Filter to only categories that are active
          const phaseActiveCategories = phase.categories.filter((c) => activeCategoryIds.has(c.id));
          if (phaseActiveCategories.length === 0) return null;

          return (
            <div key={phase.id} className="space-y-1">
              <div className="flex items-center gap-2 px-2 py-1 text-xs font-semibold text-neutral-400">
                <IconRenderer name={phase.iconName} className="w-3.5 h-3.5 text-cyan-400" />
                <span>{phase.title}</span>
              </div>

              <div className="space-y-0.5 pl-2">
                {phaseActiveCategories.map((cat) => {
                  const isActive = currentCategory.id === cat.id;
                  const selectedItems = selections[cat.id] || [];
                  const hasSelection = selectedItems.length > 0;

                  return (
                    <button
                      key={cat.id}
                      onClick={() => goToCategory(cat.id)}
                      className={clsx(
                        "w-full flex items-center justify-between gap-2 px-2.5 py-2 rounded-lg text-left text-xs transition-all",
                        isActive
                          ? "bg-cyan-950/40 text-cyan-300 font-medium border border-cyan-800/50 shadow-sm"
                          : "text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900/60"
                      )}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <IconRenderer
                          name={cat.iconName}
                          className={clsx(
                            "w-3.5 h-3.5 flex-shrink-0",
                            isActive ? "text-cyan-400" : "text-neutral-400"
                          )}
                        />
                        <span className="truncate">{cat.name}</span>
                      </div>

                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        {hasSelection && (
                          <span className="inline-flex items-center justify-center text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-700/50">
                            {selectedItems.length}
                          </span>
                        )}
                        {isActive && <ChevronRight className="w-3 h-3 text-cyan-400" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </aside>
  );
};
