"use client";

import React from "react";
import { useCatalog } from "@/context/CatalogContext";
import { Terminal, BookOpen, RotateCcw, CheckSquare, Search, Sparkles } from "lucide-react";

export const WikiHeader: React.FC = () => {
  const {
    selectedCount,
    searchQuery,
    setSearchQuery,
    loadPreset,
    openTerminal,
    activeCategories
  } = useCatalog();

  return (
    <header className="border-b border-neutral-800 bg-neutral-950/90 backdrop-blur sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between gap-4">
        {/* Brand mark */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 font-mono text-sm tracking-wider font-semibold">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#1793d1]" />
            <span className="text-neutral-100">SimpleArch</span>
            <span className="text-neutral-500 font-normal hidden sm:inline">/</span>
            <span className="text-neutral-400 text-xs font-normal hidden sm:inline">wiki-catalog</span>
          </div>

          <span className="text-[11px] font-mono text-neutral-500 border border-neutral-800 px-1.5 py-0.5 rounded hidden md:inline">
            {activeCategories.length} categories
          </span>
        </div>

        {/* Search input */}
        <div className="flex-1 max-w-md mx-2 relative">
          <Search className="w-3.5 h-3.5 text-neutral-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search packages, tools, categories... (e.g. hyprland, pipewire)"
            className="w-full bg-neutral-900 border border-neutral-800 rounded px-2.5 pl-8 py-1 text-xs text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-[#1793d1] font-mono"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-neutral-500 hover:text-neutral-300 font-mono"
            >
              clear
            </button>
          )}
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-2">
          {/* Preset Buttons */}
          <div className="hidden lg:flex items-center border border-neutral-800 rounded overflow-hidden text-xs font-mono">
            <button
              onClick={() => loadPreset("recommended")}
              className="px-2.5 py-1 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900 flex items-center gap-1 transition-colors"
              title="Apply vetted defaults"
            >
              <Sparkles className="w-3 h-3 text-[#1793d1]" />
              <span>Defaults</span>
            </button>
            <div className="w-[1px] h-4 bg-neutral-800" />
            <button
              onClick={() => loadPreset("clear")}
              className="px-2 py-1 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900 flex items-center gap-1 transition-colors"
              title="Clear all selections"
            >
              <RotateCcw className="w-3 h-3 text-neutral-500" />
              <span>Reset</span>
            </button>
          </div>

          {/* Pre-Install Guide link */}
          <a
            href="/guides/simplearch-guide/index.html"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono text-neutral-400 hover:text-neutral-200 border border-neutral-800 rounded hover:border-neutral-700 transition-colors"
          >
            <BookOpen className="w-3.5 h-3.5 text-[#1793d1]" />
            <span>Guide</span>
          </a>

          {/* Primary Generate Button */}
          <button
            onClick={openTerminal}
            className="flex items-center gap-2 px-3 py-1 bg-[#1793d1] hover:bg-[#1f9fe0] text-black font-mono text-xs font-semibold rounded shadow-sm transition-colors cursor-pointer"
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Generate Script</span>
            <span className="bg-black/20 text-black px-1.5 py-0.2 rounded text-[10px]">
              {selectedCount}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
