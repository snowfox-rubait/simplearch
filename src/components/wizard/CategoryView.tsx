"use client";

import React, { useState } from "react";
import { useWizard } from "@/context/WizardContext";
import { PackageCard } from "@/components/wizard/PackageCard";
import { IconRenderer } from "@/components/ui/IconRenderer";
import { CATALOG_PHASES } from "@/data/catalog";
import { CheckCheck, Info, RotateCcw, Search, Sparkles } from "lucide-react";

export const CategoryView: React.FC = () => {
  const {
    currentCategory,
    selections,
    togglePackage,
    selectRecommended,
    clearCategory
  } = useWizard();

  const [searchQuery, setSearchQuery] = useState("");

  const currentPhase = CATALOG_PHASES.find((p) => p.id === currentCategory.phaseId);
  const selectedIds = selections[currentCategory.id] || [];

  const filteredPackages = currentCategory.packages.filter((pkg) => {
    const query = searchQuery.toLowerCase();
    return (
      pkg.name.toLowerCase().includes(query) ||
      pkg.packageName.toLowerCase().includes(query) ||
      pkg.description.toLowerCase().includes(query) ||
      pkg.tags.some((t) => t.toLowerCase().includes(query))
    );
  });

  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
      {/* Category Header */}
      <div className="space-y-3 pb-6 border-b border-neutral-800">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-cyan-400">
          <span>{currentPhase?.title}</span>
          <span className="text-neutral-600">/</span>
          <span className="text-neutral-400">{currentCategory.name}</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-950/40 border border-cyan-800/50 flex items-center justify-center text-cyan-400 flex-shrink-0">
              <IconRenderer name={currentCategory.iconName} className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-neutral-100 tracking-tight flex items-center gap-3">
                {currentCategory.name}
                <span className="text-xs font-mono font-normal px-2.5 py-0.5 rounded-full bg-neutral-900 border border-neutral-800 text-neutral-400">
                  {currentCategory.selectionType === "single" ? "Single Select" : "Multi Select"}
                </span>
                {currentCategory.optional && (
                  <span className="text-xs font-mono font-normal px-2.5 py-0.5 rounded-full bg-neutral-900/60 border border-neutral-800/80 text-neutral-400">
                    Optional
                  </span>
                )}
              </h2>
              <p className="text-sm text-neutral-400 mt-1">
                {currentCategory.shortDesc}
              </p>
            </div>
          </div>

          {/* Quick Category Actions */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => selectRecommended(currentCategory.id)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-neutral-900 hover:bg-neutral-800 text-neutral-200 border border-neutral-700 hover:border-neutral-600 transition-all"
            >
              <CheckCheck className="w-3.5 h-3.5 text-cyan-400" />
              <span>Select Recommended</span>
            </button>

            {selectedIds.length > 0 && (
              <button
                onClick={() => clearCategory(currentCategory.id)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-neutral-900/60 hover:bg-neutral-800 text-neutral-400 hover:text-neutral-200 border border-neutral-800 transition-all"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Clear</span>
              </button>
            )}
          </div>
        </div>

        {/* Detailed Explanation Note */}
        <div className="flex items-start gap-2.5 p-3 rounded-lg bg-neutral-900/40 border border-neutral-800/80 text-xs text-neutral-300">
          <Info className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            {currentCategory.detailedDesc}
          </p>
        </div>

        {/* Search Bar if category has 3 or more packages */}
        {currentCategory.packages.length >= 3 && (
          <div className="relative pt-2">
            <Search className="w-4 h-4 absolute left-3 top-5 text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Search in ${currentCategory.name}...`}
              className="w-full pl-9 pr-4 py-2 rounded-lg bg-neutral-900/80 border border-neutral-800 text-sm text-neutral-100 placeholder-neutral-400 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
            />
          </div>
        )}
      </div>

      {/* Package Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredPackages.map((pkg) => (
          <PackageCard
            key={pkg.id}
            pkg={pkg}
            isSelected={selectedIds.includes(pkg.id)}
            selectionType={currentCategory.selectionType}
            onToggle={() => togglePackage(currentCategory.id, pkg.id)}
          />
        ))}
      </div>

      {filteredPackages.length === 0 && (
        <div className="text-center py-12 text-neutral-400">
          <p className="text-sm">No packages match &quot;{searchQuery}&quot;.</p>
        </div>
      )}
    </div>
  );
};
