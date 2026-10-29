"use client";

import React, { useMemo } from "react";
import { useCatalog } from "@/context/CatalogContext";
import { Check } from "lucide-react";
import clsx from "clsx";

export const WikiSidebar: React.FC = () => {
  const {
    phases,
    activeCategories,
    selectedCategory,
    setSelectedCategoryId,
    selections,
    searchQuery
  } = useCatalog();

  // Filter categories by search query if present
  const filteredActiveCategories = useMemo(() => {
    if (!searchQuery.trim()) return activeCategories;
    const q = searchQuery.toLowerCase();
    return activeCategories.filter((cat) => {
      const matchCat = cat.name.toLowerCase().includes(q) || cat.id.toLowerCase().includes(q);
      const matchPkg = cat.packages.some(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.packageName.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
      return matchCat || matchPkg;
    });
  }, [activeCategories, searchQuery]);

  // Group filtered categories by phase
  const groupedPhases = useMemo(() => {
    const map = new Map<string, typeof activeCategories>();
    for (const cat of filteredActiveCategories) {
      const pId = cat.phase.id;
      if (!map.has(pId)) map.set(pId, []);
      map.get(pId)!.push(cat);
    }

    return phases
      .filter((p) => map.has(p.id))
      .map((p) => ({
        phase: p,
        categories: map.get(p.id)!
      }));
  }, [phases, filteredActiveCategories]);

  return (
    <aside className="w-64 md:w-72 border-r border-neutral-800 bg-neutral-950 flex flex-col shrink-0 overflow-y-auto font-mono text-xs select-none">
      <div className="p-3 border-b border-neutral-800 text-neutral-400 font-semibold tracking-wider flex items-center justify-between text-[11px] uppercase">
        <span>Contents</span>
        <span className="text-neutral-600 lowercase font-normal">
          {filteredActiveCategories.length} items
        </span>
      </div>

      <div className="p-2 space-y-4">
        {groupedPhases.map(({ phase, categories }, phaseIndex) => (
          <div key={phase.id} className="space-y-1">
            {/* Phase Heading */}
            <div className="px-2 py-1 text-[11px] text-neutral-400 font-semibold uppercase tracking-wider flex items-center gap-1.5">
              <span className="text-neutral-600">{phaseIndex + 1}.</span>
              <span className="truncate">{phase.title}</span>
            </div>

            {/* Category Links */}
            <div className="space-y-0.5">
              {categories.map((cat) => {
                const isCurrent = selectedCategory?.id === cat.id;
                const selectedPkgIds = selections[cat.id] || [];
                const hasSelection = selectedPkgIds.length > 0;

                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategoryId(cat.id)}
                    className={clsx(
                      "w-full text-left px-2.5 py-1.5 rounded flex items-center justify-between gap-2 transition-colors cursor-pointer group",
                      isCurrent
                        ? "bg-neutral-900 text-neutral-100 border-l-2 border-[#1793d1]"
                        : "text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900/60"
                    )}
                  >
                    <span className="truncate flex-1">{cat.name}</span>

                    {/* Selection status indicator */}
                    {hasSelection ? (
                      <span className="flex items-center gap-1 text-[10px] text-[#1793d1] shrink-0 font-medium">
                        <Check className="w-3 h-3 stroke-[3]" />
                        <span>{selectedPkgIds.length}</span>
                      </span>
                    ) : (
                      <span className="text-neutral-700 text-[10px] shrink-0 font-mono">
                        {cat.optional ? "—" : "•"}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}

        {groupedPhases.length === 0 && (
          <div className="p-4 text-center text-neutral-500 text-xs">
            No matching categories for "{searchQuery}".
          </div>
        )}
      </div>
    </aside>
  );
};
