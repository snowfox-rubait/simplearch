"use client";

import React, { useState } from "react";
import { PackageItem, SelectionType } from "@/types/catalog";
import { Check, ExternalLink, Image, Plus, Minus, Server, Settings } from "lucide-react";
import clsx from "clsx";

interface WikiPackageCardProps {
  packageItem: PackageItem;
  categoryId: string;
  selectionType: SelectionType;
  isSelected: boolean;
  onToggle: () => void;
}

export const WikiPackageCard: React.FC<WikiPackageCardProps> = ({
  packageItem,
  categoryId,
  selectionType,
  isSelected,
  onToggle
}) => {
  const [showScreenshot, setShowScreenshot] = useState(false);

  const hasMedia = packageItem.media?.before_ricing?.file || (packageItem.media?.after_ricing && packageItem.media.after_ricing.length > 0);

  return (
    <div
      onClick={onToggle}
      className={clsx(
        "border rounded p-3.5 transition-all cursor-pointer font-sans select-none relative group",
        isSelected
          ? "border-[#1793d1] bg-[#1793d1]/5 shadow-sm"
          : "border-neutral-800 bg-neutral-900/40 hover:border-neutral-700 hover:bg-neutral-900/80"
      )}
    >
      <div className="flex items-start gap-3">
        {/* Selection Indicator (Radio or Checkbox style) */}
        <div
          className={clsx(
            "w-4 h-4 mt-0.5 rounded flex items-center justify-center shrink-0 border transition-colors",
            selectionType === "single" ? "rounded-full" : "rounded",
            isSelected
              ? "border-[#1793d1] bg-[#1793d1] text-black"
              : "border-neutral-700 bg-neutral-950 text-transparent group-hover:border-neutral-500"
          )}
        >
          <Check className="w-3 h-3 stroke-[3]" />
        </div>

        {/* Content Body */}
        <div className="flex-1 min-w-0 space-y-2">
          {/* Header Row */}
          <div className="flex items-start justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-neutral-100 text-sm tracking-tight">
                {packageItem.name}
              </span>

              {/* Exact pacman/AUR package name */}
              <code className="text-xs font-mono px-1.5 py-0.5 rounded bg-neutral-950 border border-neutral-800 text-neutral-300">
                {packageItem.packageName}
              </code>

              {/* Source badge */}
              <span
                className={clsx(
                  "text-[10px] font-mono px-1.5 py-0.2 rounded border uppercase",
                  packageItem.source === "aur"
                    ? "border-amber-900/60 bg-amber-950/40 text-amber-400"
                    : "border-neutral-800 bg-neutral-900 text-neutral-400"
                )}
              >
                {packageItem.source === "aur" ? "aur" : "repo"}
              </span>

              {packageItem.recommended && (
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded border border-[#1793d1]/40 bg-[#1793d1]/10 text-[#1793d1]">
                  recommended
                </span>
              )}
            </div>

            {/* External Links */}
            <div className="flex items-center gap-2 text-xs font-mono text-neutral-500" onClick={(e) => e.stopPropagation()}>
              {packageItem.websiteUrl && (
                <a
                  href={packageItem.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-neutral-300 flex items-center gap-0.5"
                  title="Official Website"
                >
                  <span>site</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
              )}
              {packageItem.githubUrl && (
                <a
                  href={packageItem.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-neutral-300 flex items-center gap-0.5"
                  title="GitHub Repository"
                >
                  <span>src</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
              )}
            </div>
          </div>

          {/* Description */}
          <p className="text-xs text-neutral-400 leading-relaxed">
            {packageItem.description}
          </p>

          {/* Pros / Cons (ArchWiki technical style) */}
          {((packageItem.pros && packageItem.pros.length > 0) || (packageItem.cons && packageItem.cons.length > 0)) && (
            <div className="pt-1 space-y-1 text-xs">
              {packageItem.pros?.map((pro, idx) => (
                <div key={idx} className="flex items-start gap-1.5 text-neutral-300">
                  <span className="text-emerald-500 font-mono font-bold text-[11px] shrink-0">+</span>
                  <span>{pro}</span>
                </div>
              ))}
              {packageItem.cons?.map((con, idx) => (
                <div key={idx} className="flex items-start gap-1.5 text-neutral-400">
                  <span className="text-neutral-600 font-mono font-bold text-[11px] shrink-0">-</span>
                  <span>{con}</span>
                </div>
              ))}
            </div>
          )}

          {/* Metadata Row: Services, Dotfiles, Screenshot Toggle */}
          <div className="pt-2 flex items-center justify-between gap-3 flex-wrap border-t border-neutral-800/60 text-[11px] font-mono text-neutral-500">
            <div className="flex items-center gap-3 flex-wrap">
              {packageItem.services && packageItem.services.length > 0 && (
                <span className="flex items-center gap-1 text-neutral-400" title="Systemd service enabled automatically">
                  <Server className="w-3 h-3 text-neutral-500" />
                  <span>{packageItem.services.join(", ")}</span>
                </span>
              )}
              {packageItem.targetConfigPath && (
                <span className="flex items-center gap-1 text-neutral-500" title="Config target location">
                  <Settings className="w-3 h-3 text-neutral-600" />
                  <span>{packageItem.targetConfigPath}</span>
                </span>
              )}
            </div>

            {hasMedia && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowScreenshot((prev) => !prev);
                }}
                className="text-[11px] text-[#1793d1] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Image className="w-3 h-3" />
                <span>{showScreenshot ? "Hide Preview" : "View Preview"}</span>
              </button>
            )}
          </div>

          {/* Inline Media Expand */}
          {showScreenshot && hasMedia && (
            <div
              className="mt-2 pt-2 border-t border-neutral-800/80 rounded overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {packageItem.media?.before_ricing?.file && (
                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-neutral-500 uppercase">
                    Preview: {packageItem.media.before_ricing.description || "Vanilla View"}
                  </span>
                  <img
                    src={packageItem.media.before_ricing.file}
                    alt={packageItem.name}
                    className="rounded border border-neutral-800 max-h-64 object-cover w-full"
                    loading="lazy"
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
