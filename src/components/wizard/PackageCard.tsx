"use client";

import React, { useState } from "react";
import { PackageItem, SelectionType } from "@/types/catalog";
import {
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Cpu,
  ExternalLink,
  Eye,
  GitFork,
  Image as ImageIcon,
  ShieldCheck,
  Sparkles,
  Zap
} from "lucide-react";
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
  const [showMedia, setShowMedia] = useState(false);

  const hasMedia = Boolean(pkg.media && (pkg.media.before_ricing || (pkg.media.after_ricing && pkg.media.after_ricing.length > 0)));

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
        {/* Top Header: Title, Badges, Selection Indicator */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
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
              <span className="text-cyan-300/90 truncate">{pkg.packageName}</span>
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
        <p className="text-sm text-neutral-300 leading-relaxed mb-3">
          {pkg.description}
        </p>

        {/* Badges / Tags */}
        {pkg.tags && pkg.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {pkg.tags.map((tag) => {
              const isOldHw = tag === "old-hardware-friendly" || tag === "legacy";
              const isVerified = tag === "verified";
              const isMem = tag === "minimal-memory";
              const isGpu = tag === "gpu-composited" || tag === "modern-hardware";

              return (
                <span
                  key={tag}
                  className={clsx(
                    "text-[10px] font-mono px-2 py-0.5 rounded-md flex items-center gap-1",
                    isVerified && "bg-emerald-950/50 text-emerald-400 border border-emerald-800/50",
                    isOldHw && "bg-amber-950/50 text-amber-300 border border-amber-800/50",
                    isMem && "bg-cyan-950/50 text-cyan-300 border border-cyan-800/50",
                    isGpu && "bg-indigo-950/50 text-indigo-300 border border-indigo-800/50",
                    !isVerified && !isOldHw && !isMem && !isGpu && "bg-neutral-900 text-neutral-400 border border-neutral-800"
                  )}
                >
                  {isOldHw && <Cpu className="w-2.5 h-2.5" />}
                  {isVerified && <CheckCircle2 className="w-2.5 h-2.5" />}
                  {isGpu && <Zap className="w-2.5 h-2.5" />}
                  {tag}
                </span>
              );
            })}
          </div>
        )}

        {/* Pros & Cons Bullets */}
        {(pkg.pros.length > 0 || pkg.cons.length > 0) && (
          <div className="space-y-1.5 mb-3 text-xs">
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
            <span className="text-neutral-200 truncate">{pkg.targetConfigPath}</span>
          </div>
        )}

        {/* Media Showcase Toggle Button */}
        <div className="mb-3" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            onClick={() => setShowMedia(!showMedia)}
            className="w-full text-xs font-medium py-1.5 px-3 rounded-lg bg-neutral-950/80 hover:bg-neutral-800/80 text-neutral-300 hover:text-cyan-300 border border-neutral-800 flex items-center justify-between transition-colors"
          >
            <span className="flex items-center gap-1.5">
              <ImageIcon className="w-3.5 h-3.5 text-cyan-400" />
              <span>Ricing Showcase: Before vs After</span>
            </span>
            {showMedia ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {/* Media Drawer */}
          {showMedia && (
            <div className="mt-2.5 p-3 rounded-lg bg-neutral-950 border border-neutral-800 text-xs space-y-3 animate-in fade-in duration-150">
              {hasMedia ? (
                <div className="space-y-3">
                  {pkg.media?.before_ricing && (
                    <div>
                      <span className="text-[10px] font-mono font-semibold uppercase text-neutral-400 block mb-1">
                        Before Ricing (Vanilla Out-of-the-Box)
                      </span>
                      <p className="text-neutral-300 text-[11px] mb-1.5">
                        {pkg.media.before_ricing.description}
                      </p>
                      <div className="p-2 rounded bg-neutral-900 border border-neutral-800 text-center text-neutral-500 font-mono text-[11px]">
                        [{pkg.media.before_ricing.file}]
                      </div>
                    </div>
                  )}

                  {pkg.media?.after_ricing && pkg.media.after_ricing.length > 0 && (
                    <div>
                      <span className="text-[10px] font-mono font-semibold uppercase text-cyan-400 block mb-1">
                        After Ricing (SimpleArch Minimal Baseline)
                      </span>
                      {pkg.media.after_ricing.map((example, idx) => (
                        <div key={idx} className="mb-2 p-2 rounded bg-neutral-900/60 border border-neutral-800/80">
                          <span className="font-semibold text-neutral-200 block text-xs">
                            {example.title}
                          </span>
                          <span className="text-[11px] text-neutral-400 block mb-1.5">
                            {example.description}
                          </span>
                          <div className="p-2 rounded bg-neutral-950 border border-neutral-800 text-center text-cyan-400/80 font-mono text-[11px]">
                            [{example.type.toUpperCase()}: {example.file}]
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-2 text-neutral-400">
                  <p className="text-[11px] text-neutral-300 mb-1">
                    No community showcase media uploaded for {pkg.name} yet.
                  </p>
                  <p className="text-[10px] text-neutral-500">
                    Want to show your rice? Submit a screenshot/GIF in a contributor ZIP!
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Footer: Stability Score, External Links */}
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

        {/* Action Links */}
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
