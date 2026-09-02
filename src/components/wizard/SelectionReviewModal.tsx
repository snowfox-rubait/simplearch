"use client";

import React, { useState } from "react";
import { useWizard } from "@/context/WizardContext";
import { CATALOG_PHASES } from "@/data/catalog";
import { IconRenderer } from "@/components/ui/IconRenderer";
import {
  Check,
  Copy,
  Download,
  FileCode,
  Package,
  Sparkles,
  Trash2,
  X
} from "lucide-react";
import clsx from "clsx";

export const SelectionReviewModal: React.FC = () => {
  const {
    isReviewOpen,
    setIsReviewOpen,
    selectedPackages,
    togglePackage,
    getManifest,
    goToCategory
  } = useWizard();

  const [copied, setCopied] = useState(false);

  if (!isReviewOpen) return null;

  const manifest = getManifest();
  const aurCount = selectedPackages.filter((p) => p.packageItem.source === "aur").length;
  const repoCount = selectedPackages.filter((p) => p.packageItem.source === "repo").length;

  const handleCopyManifest = () => {
    navigator.clipboard.writeText(JSON.stringify(manifest, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-neutral-950 border border-neutral-800 rounded-2xl flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="p-5 md:p-6 border-b border-neutral-800 bg-neutral-900/40 flex items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold text-neutral-100 tracking-tight">
                Selection Manifest & System Blueprint
              </h3>
              <span className="text-xs font-mono font-medium px-2.5 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800/40">
                {selectedPackages.length} Total Packages
              </span>
            </div>
            <p className="text-xs text-neutral-400 mt-1">
              Review every chosen package, daemon, and config placement before script generation.
            </p>
          </div>

          <button
            onClick={() => setIsReviewOpen(false)}
            className="p-2 rounded-lg text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-5 md:p-6 border-b border-neutral-800 bg-neutral-900/20 text-xs font-mono">
          <div className="p-3 rounded-lg bg-neutral-900/50 border border-neutral-800">
            <span className="text-neutral-400 block mb-1">Architecture</span>
            <span className="text-sm font-semibold text-neutral-200 capitalize">
              {manifest.architecture.replace("-", " ")}
            </span>
          </div>
          <div className="p-3 rounded-lg bg-neutral-900/50 border border-neutral-800">
            <span className="text-neutral-400 block mb-1">Display Protocol</span>
            <span className="text-sm font-semibold text-cyan-300 uppercase">
              {manifest.protocol}
            </span>
          </div>
          <div className="p-3 rounded-lg bg-neutral-900/50 border border-neutral-800">
            <span className="text-neutral-400 block mb-1">Official Repos</span>
            <span className="text-sm font-semibold text-blue-400">
              {repoCount} packages
            </span>
          </div>
          <div className="p-3 rounded-lg bg-neutral-900/50 border border-neutral-800">
            <span className="text-neutral-400 block mb-1">AUR Packages</span>
            <span className="text-sm font-semibold text-purple-400">
              {aurCount} packages
            </span>
          </div>
        </div>

        {/* Grouped Selected Packages List */}
        <div className="flex-1 overflow-y-auto p-5 md:p-6 space-y-6">
          {CATALOG_PHASES.map((phase) => {
            const phaseItems = selectedPackages.filter((item) => item.category.phaseId === phase.id);
            if (phaseItems.length === 0) return null;

            return (
              <div key={phase.id} className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-cyan-400">
                  <IconRenderer name={phase.iconName} className="w-4 h-4" />
                  <span>{phase.title}</span>
                  <span className="text-neutral-600 font-mono">({phaseItems.length})</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {phaseItems.map(({ category, packageItem }) => (
                    <div
                      key={packageItem.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-neutral-900/60 border border-neutral-800/80 hover:border-neutral-700 transition-all text-xs"
                    >
                      <div className="flex items-center gap-2.5 min-w-0 pr-2">
                        <div
                          className="p-1 rounded bg-neutral-800 cursor-pointer hover:bg-neutral-700"
                          onClick={() => {
                            setIsReviewOpen(false);
                            goToCategory(category.id);
                          }}
                          title={`Edit ${category.name}`}
                        >
                          <IconRenderer name={category.iconName} className="w-3.5 h-3.5 text-neutral-400" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="font-medium text-neutral-200 truncate">
                              {packageItem.name}
                            </span>
                            {packageItem.isOmarchyDefault && (
                              <span className="text-[9px] px-1 py-0.2 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30">
                                Omarchy
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] font-mono text-neutral-400 truncate block">
                            {packageItem.packageName}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => togglePackage(category.id, packageItem.id)}
                        className="p-1.5 rounded text-neutral-400 hover:text-red-400 hover:bg-red-950/30 transition-colors"
                        title="Remove package"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

          {selectedPackages.length === 0 && (
            <div className="text-center py-12 text-neutral-400">
              <p className="text-sm">No packages selected yet. Pick options from the categories.</p>
            </div>
          )}
        </div>

        {/* Modal Footer: Export Manifest & Next Step Trigger */}
        <div className="p-4 md:p-5 border-t border-neutral-800 bg-neutral-900/40 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={handleCopyManifest}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-medium text-neutral-300 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 transition-colors"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? "Manifest JSON Copied!" : "Copy Manifest JSON"}</span>
          </button>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={() => setIsReviewOpen(false)}
              className="flex-1 sm:flex-initial px-4 py-2 rounded-lg text-xs font-medium text-neutral-400 hover:text-neutral-200 transition-colors"
            >
              Continue Editing
            </button>

            <button
              onClick={() => {
                setIsReviewOpen(false);
                // Ready for script generator
                alert("Selections saved! Next step: Generate POSIX shell script from this manifest.");
              }}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-2 rounded-lg text-xs font-semibold bg-cyan-500 hover:bg-cyan-400 text-neutral-950 transition-all shadow-md shadow-cyan-500/20 active:scale-95"
            >
              <FileCode className="w-4 h-4" />
              <span>Ready for Script Generator</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
