"use client";

import React from "react";
import { useCatalog } from "@/context/CatalogContext";
import { WikiPackageCard } from "@/components/wiki/WikiPackageCard";
import { ChevronLeft, ChevronRight, RotateCcw, CheckCheck, Info } from "lucide-react";

export const WikiCategoryView: React.FC = () => {
  const {
    selectedCategory,
    activeCategories,
    setSelectedCategoryId,
    selections,
    togglePackage,
    clearCategory,
    isPackageSelected
  } = useCatalog();

  if (!selectedCategory) {
    return (
      <div className="flex-1 flex items-center justify-center p-8 text-neutral-500 font-mono text-xs">
        Select a category from the contents sidebar to begin.
      </div>
    );
  }

  // Find index among active categories
  const currentIndex = activeCategories.findIndex((c) => c.id === selectedCategory.id);
  const prevCategory = currentIndex > 0 ? activeCategories[currentIndex - 1] : null;
  const nextCategory = currentIndex < activeCategories.length - 1 ? activeCategories[currentIndex + 1] : null;

  const selectedPkgIds = selections[selectedCategory.id] || [];

  const handleSelectRecommended = () => {
    const recPkgs = selectedCategory.packages.filter((p) => p.recommended).map((p) => p.id);
    if (recPkgs.length > 0) {
      recPkgs.forEach((id) => {
        if (!selectedPkgIds.includes(id)) {
          togglePackage(selectedCategory.id, id);
        }
      });
    } else if (selectedCategory.packages.length > 0) {
      togglePackage(selectedCategory.id, selectedCategory.packages[0].id);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 max-w-4xl">
      {/* Category Header */}
      <div className="space-y-2 border-b border-neutral-800 pb-4">
        <div className="flex items-center gap-2 text-xs font-mono text-neutral-500">
          <span>{selectedCategory.phase.title}</span>
          <span>/</span>
          <span>Category {selectedCategory.order}</span>
          <span>•</span>
          <span className="uppercase text-[10px] px-1.5 py-0.2 rounded bg-neutral-900 border border-neutral-800 text-neutral-400">
            {selectedCategory.selectionType === "single" ? "Single Selection" : "Multiple Selections"}
          </span>
          {selectedCategory.optional && (
            <span className="text-[10px] text-neutral-500">(Optional)</span>
          )}
        </div>

        <div className="flex items-baseline justify-between gap-4 flex-wrap">
          <h1 className="text-xl md:text-2xl font-bold text-neutral-100 font-mono tracking-tight">
            {selectedCategory.name}
          </h1>

          {/* Quick Actions */}
          <div className="flex items-center gap-2 text-xs font-mono">
            <button
              onClick={handleSelectRecommended}
              className="text-[#1793d1] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>Recommended</span>
            </button>
            {selectedPkgIds.length > 0 && (
              <>
                <span className="text-neutral-700">|</span>
                <button
                  onClick={() => clearCategory(selectedCategory.id)}
                  className="text-neutral-500 hover:text-neutral-300 flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Clear ({selectedPkgIds.length})</span>
                </button>
              </>
            )}
          </div>
        </div>

        <p className="text-xs text-neutral-400 leading-relaxed font-sans">
          {selectedCategory.shortDesc}
        </p>

        {selectedCategory.detailedDesc && (
          <p className="text-xs text-neutral-500 leading-relaxed font-sans italic">
            {selectedCategory.detailedDesc}
          </p>
        )}

        {/* Dependency Notice (if any) */}
        {selectedCategory.dependsOn && (
          <div className="flex items-center gap-2 p-2 rounded bg-neutral-900 border border-neutral-800 text-xs font-mono text-neutral-400">
            <Info className="w-3.5 h-3.5 text-[#1793d1] shrink-0" />
            <span>
              Condition: Dependent on parent category <code>{selectedCategory.dependsOn.category}</code>.
            </span>
          </div>
        )}
      </div>

      {/* Package Options Grid / List */}
      <div className="space-y-3">
        {selectedCategory.packages.map((pkg) => (
          <WikiPackageCard
            key={pkg.id}
            packageItem={pkg}
            categoryId={selectedCategory.id}
            selectionType={selectedCategory.selectionType}
            isSelected={isPackageSelected(selectedCategory.id, pkg.id)}
            onToggle={() => togglePackage(selectedCategory.id, pkg.id)}
          />
        ))}

        {selectedCategory.packages.length === 0 && (
          <div className="p-8 border border-neutral-800 border-dashed rounded text-center text-xs font-mono text-neutral-500">
            No packages defined for this category.
          </div>
        )}
      </div>

      {/* Category Footer Navigation */}
      <div className="pt-6 border-t border-neutral-800 flex items-center justify-between gap-4 font-mono text-xs">
        {prevCategory ? (
          <button
            onClick={() => setSelectedCategoryId(prevCategory.id)}
            className="flex items-center gap-1.5 text-neutral-400 hover:text-neutral-100 hover:bg-neutral-900 px-3 py-1.5 rounded border border-neutral-800 transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span className="truncate max-w-[160px]">{prevCategory.name}</span>
          </button>
        ) : (
          <div />
        )}

        {nextCategory ? (
          <button
            onClick={() => setSelectedCategoryId(nextCategory.id)}
            className="flex items-center gap-1.5 text-neutral-400 hover:text-neutral-100 hover:bg-neutral-900 px-3 py-1.5 rounded border border-neutral-800 transition-colors cursor-pointer ml-auto"
          >
            <span className="truncate max-w-[160px]">{nextCategory.name}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        ) : (
          <div />
        )}
      </div>
    </div>
  );
};
