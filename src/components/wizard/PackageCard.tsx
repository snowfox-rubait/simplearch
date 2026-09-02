"use client";

import React from "react";
import { PackageItem, SelectionType } from "@/types/catalog";
import { Check, CheckCircle2, ExternalLink, GitFork, ShieldCheck, Sparkles } from "lucide-react";
import clsx from "clsx";

interface PackageCardProps {
  pkg: PackageItem;
  isSelected: boolean;
  selectionType: SelectionType;
  onToggle: () => void;
}

export const PackageCard: React.FC<PackageCardProps> = ({
  pkg,
  isSelected,
  selectionType,
  onToggle
}) => {
  return (
    <div
      onClick={onToggle}
      className={clsx(
        "group relative rounded-xl border p-5 cursor-pointer transition-all duration-200 flex flex-col justify-between",
        isSelected
          ? "border-cyan-500/80 bg-cyan-950/20 shadow-lg shadow-cyan-950/30 ring-1 ring-cyan-500/50"
          : "border-neutral-800 bg-neutral-900/60 hover:border-neutral-700 hover:bg-neutral-900/90"
      )}
    >
      <div>
        {/* Top Header: Title, Selection Checkbox/Radio, Badges */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h4 className="text-base font-semibold text-neutral-100 group-hover:text-cyan-400 transition-colors">
                {pkg.name}
              </h4>

              {pkg.isOmarchyDefault && (
                <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30">
                  <Sparkles className="w-3 h-3" /> Omarchy Standard
                </span>
              )}

              {pkg.recommended && !pkg.isOmarchyDefault && (
                <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                  <ShieldCheck className="w-3 h-3" /> Recommended
                </span>
              )}

              <span
                className={clsx(
                  "text-[10px] uppercase font-mono tracking-wider px-2 py-0.5 rounded font-medium",
                  pkg.source === "aur"
                    ? "bg-purple-950/40 text-purple-300 border border-purple-800/40"
                    : "bg-blue-950/40 text-blue-300 border border-blue-800/40"
                )}
              >
                {pkg.source === "aur" ? "AUR" : "Official Repo"}
              </span>
            </div>

            <div className="text-xs font-mono text-neutral-400 flex items-center gap-2">
              <span className="text-neutral-500">$ pacman -S</span>
              <span className="text-cyan-300/90">{pkg.packageName}</span>
            </div>
          </div>

          {/* Visual Indicator: Radio or Checkbox */}
          <div
            className={clsx(
              "w-5 h-5 flex-shrink-0 flex items-center justify-center transition-all",
              selectionType === "single" ? "rounded-full" : "rounded-md",
              isSelected
                ? "bg-cyan-500 text-black shadow-md shadow-cyan-500/40"
                : "border border-neutral-700 bg-neutral-950 group-hover:border-neutral-500"
            )}
          >
            {isSelected && (
              selectionType === "single" ? (
                <div className="w-2 h-2 rounded-full bg-black" />
              ) : (
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              )
            )}
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-neutral-300 leading-relaxed mb-4">
          {pkg.description}
        </p>

        {/* Pros & Cons Bullets */}
        {(pkg.pros.length > 0 || pkg.cons.length > 0) && (
          <div className="space-y-2 mb-4 text-xs">
            {pkg.pros.map((pro, i) => (
              <div key={i} className="flex items-start gap-1.5 text-neutral-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>{pro}</span>
              </div>
            ))}
            {pkg.cons.map((con, i) => (
              <div key={i} className="flex items-start gap-1.5 text-neutral-400">
                <span className="text-amber-400 flex-shrink-0 font-bold px-0.5">−</span>
                <span>{con}</span>
              </div>
            ))}
          </div>
        )}

        {/* Config Placement Path note if exists */}
        {pkg.targetConfigPath && (
          <div className="mb-3 text-[11px] font-mono text-neutral-400 bg-neutral-950/80 px-2.5 py-1.5 rounded border border-neutral-800 flex items-center justify-between">
            <span className="text-neutral-500">Config:</span>
            <span className="text-neutral-200">{pkg.targetConfigPath}</span>
          </div>
        )}
      </div>

      {/* Footer: Stability Score, Tags, External Links */}
      <div className="pt-3 border-t border-neutral-800/80 flex items-center justify-between gap-2 text-xs">
        {/* Stability Rating */}
        <div className="flex items-center gap-1.5" title={`Stability: ${pkg.stabilityScore}/10`}>
          <span className="text-[11px] text-neutral-400 font-mono">Stability</span>
          <div className="flex gap-0.5">
            {[...Array(10)].map((_, i) => (
              <div
                key={i}
                className={clsx(
                  "w-1.5 h-2 rounded-[1px]",
                  i < pkg.stabilityScore
                    ? pkg.stabilityScore >= 9
                      ? "bg-emerald-400"
                      : "bg-amber-400"
                    : "bg-neutral-800"
                )}
              />
            ))}
          </div>
        </div>

        {/* Action Link */}
        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
          {pkg.githubUrl && (
            <a
              href={pkg.githubUrl}
              target="_blank"
              rel="noreferrer"
              className="text-neutral-400 hover:text-neutral-200 transition-colors p-1"
              title="GitHub Repository"
            >
              <GitFork className="w-3.5 h-3.5" />
            </a>
          )}
          {pkg.websiteUrl && (
            <a
              href={pkg.websiteUrl}
              target="_blank"
              rel="noreferrer"
              className="text-neutral-400 hover:text-neutral-200 transition-colors p-1"
              title="Official Website"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};
